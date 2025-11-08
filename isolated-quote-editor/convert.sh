#!/bin/bash

###############################################################################
# Скрипт автоматической конвертации Quote Editor в Shadow DOM версию
#
# Использование:
#   ./convert.sh input.html
#
# Результат будет сохранен в isolated-output.html
###############################################################################

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция логирования
log_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

log_success() {
    echo -e "${GREEN}✓ ${NC}$1"
}

log_warning() {
    echo -e "${YELLOW}⚠ ${NC}$1"
}

log_error() {
    echo -e "${RED}✗ ${NC}$1"
}

# Проверка аргументов
if [ $# -eq 0 ]; then
    log_error "Не указан входной файл"
    echo "Использование: $0 input.html"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="isolated-output.html"

# Проверка существования входного файла
if [ ! -f "$INPUT_FILE" ]; then
    log_error "Файл $INPUT_FILE не найден"
    exit 1
fi

log_info "Starting conversion..."
log_info "Input:  $INPUT_FILE"
log_info "Output: $OUTPUT_FILE"

# Создаем временную директорию
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Счетчики замен
REPLACEMENTS=0

log_info "Extracting styles and HTML..."

# Извлекаем стили
sed -n '/<style>/,/<\/style>/p' "$INPUT_FILE" | sed '1d;$d' > "$TEMP_DIR/styles.css"

# Извлекаем HTML (все между <div class="main-ctr"> и последним </div>)
# Это упрощенная версия, для сложных случаев нужно использовать специальный парсер
sed -n '/<div class="main-ctr">/,/<\/body>/p' "$INPUT_FILE" > "$TEMP_DIR/content.html"

log_success "Styles extracted: $(wc -l < $TEMP_DIR/styles.css) lines"
log_success "HTML extracted: $(wc -l < $TEMP_DIR/content.html) lines"

log_info "Converting JavaScript selectors..."

# Извлекаем JavaScript
sed -n '/<script>/,/<\/script>/p' "$INPUT_FILE" | sed '1d;$d' > "$TEMP_DIR/script.js"

# Замены в JavaScript
cp "$TEMP_DIR/script.js" "$TEMP_DIR/script_converted.js"

# document.getElementById -> shadowRoot.getElementById
COUNT=$(grep -o "document\.getElementById" "$TEMP_DIR/script.js" | wc -l)
sed -i 's/document\.getElementById/shadowRoot.getElementById/g' "$TEMP_DIR/script_converted.js"
log_success "Replaced document.getElementById: $COUNT occurrences"
REPLACEMENTS=$((REPLACEMENTS + COUNT))

# document.querySelector -> shadowRoot.querySelector
COUNT=$(grep -o "document\.querySelector(" "$TEMP_DIR/script.js" | wc -l)
sed -i 's/document\.querySelector(/shadowRoot.querySelector(/g' "$TEMP_DIR/script_converted.js"
log_success "Replaced document.querySelector: $COUNT occurrences"
REPLACEMENTS=$((REPLACEMENTS + COUNT))

# document.querySelectorAll -> shadowRoot.querySelectorAll
COUNT=$(grep -o "document\.querySelectorAll(" "$TEMP_DIR/script.js" | wc -l)
sed -i 's/document\.querySelectorAll(/shadowRoot.querySelectorAll(/g' "$TEMP_DIR/script_converted.js"
log_success "Replaced document.querySelectorAll: $COUNT occurrences"
REPLACEMENTS=$((REPLACEMENTS + COUNT))

log_info "Creating isolated version..."

# Создаем итоговый файл
cat > "$OUTPUT_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote Editor - Shadow DOM Isolated</title>

    <!-- External Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
</head>
<body>
    <div id="quote-editor-isolated"></div>

    <script>
    (function() {
        'use strict';

        const container = document.getElementById('quote-editor-isolated');
        const shadowRoot = container.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = `
            <style>
EOF

# Вставляем стили
cat "$TEMP_DIR/styles.css" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'EOF'
            </style>
EOF

# Вставляем HTML
cat "$TEMP_DIR/content.html" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'EOF'
        `;

        // Adapted JavaScript
EOF

# Вставляем конвертированный JavaScript
cat "$TEMP_DIR/script_converted.js" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'EOF'

        // Export for external access
        window.QuoteEditorInstance = {
            shadowRoot: shadowRoot,
            getCanvas: () => shadowRoot.getElementById('qcanvas')
        };

        console.log('✅ Quote Editor initialized in Shadow DOM');
    })();
    </script>
</body>
</html>
EOF

log_success "Conversion completed!"
log_success "Total replacements: $REPLACEMENTS"
log_success "Output saved to: $OUTPUT_FILE"

# Статистика
FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
log_info "Output file size: $FILE_SIZE"

# Финальные рекомендации
echo ""
log_warning "IMPORTANT NEXT STEPS:"
echo "  1. Review the generated file"
echo "  2. Test in a browser"
echo "  3. Manually check for:"
echo "     - Global event listeners (paste, resize, etc.)"
echo "     - DOMContentLoaded removal"
echo "     - External API calls"
echo "  4. Adjust QE.get/QE.qs references if needed"

echo ""
log_success "Conversion script completed successfully!"
