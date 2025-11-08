# 🎨 Quote Editor - Shadow DOM Isolated Version

Изолированная версия редактора цитат с использованием Shadow DOM для полной инкапсуляции стилей и логики.

## 📋 Оглавление

- [Зачем Shadow DOM?](#зачем-shadow-dom)
- [Структура проекта](#структура-проекта)
- [Быстрый старт](#быстрый-старт)
- [Пошаговая миграция](#пошаговая-миграция)
- [API для внешнего доступа](#api-для-внешнего-доступа)
- [Troubleshooting](#troubleshooting)

---

## Зачем Shadow DOM?

### Проблемы без изоляции:
- ❌ Конфликты CSS с основным сайтом DLE
- ❌ Перехват глобальных стилей
- ❌ ID и классы могут пересекаться с DLE шаблоном
- ❌ JavaScript может конфликтовать с другими скриптами

### Преимущества Shadow DOM:
- ✅ **Полная изоляция стилей** - ничто снаружи не влияет на редактор
- ✅ **Инкапсуляция DOM** - ID элементов не конфликтуют
- ✅ **Переносимость** - можно встроить на любую страницу
- ✅ **Безопасность** - защита от внешнего JavaScript
- ✅ **Современный стандарт** - поддерживается всеми браузерами

---

## Структура проекта

```
isolated-quote-editor/
├── js/
│   ├── shadow-adapter.js          # Адаптер для Shadow DOM
│   └── quote-editor-wrapper.js     # Обертка приложения
├── css/
│   └── quote-editor.css            # Изолированные стили (извлечены из HTML)
├── templates/
│   └── quote-editor.html           # HTML шаблон (извлечен из HTML)
├── convert-to-shadow.js            # Скрипт автоматизации
├── example-usage.html              # Пример использования
└── README.md                       # Эта документация
```

---

## Быстрый старт

### Вариант 1: Встроенный (рекомендуется для DLE)

```html
<!-- В вашем DLE шаблоне -->

<!-- 1. Подключите внешние библиотеки ПЕРЕД Shadow DOM -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

<!-- 2. Создайте контейнер -->
<div id="quote-editor-isolated"></div>

<!-- 3. Инициализируйте -->
<script>
(function() {
    const container = document.getElementById('quote-editor-isolated');
    const shadow = container.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
        <style>
            /* ВАШ CSS ЗДЕСЬ */
        </style>

        <div class="main-ctr">
            <!-- ВАШ HTML ЗДЕСЬ -->
        </div>
    `;

    // Адаптированный JavaScript
    const QE = {};
    QE.get = (id) => shadow.getElementById(id);
    QE.qs = (sel) => shadow.querySelector(sel);

    // Ваш код QE здесь...

})();
</script>
```

### Вариант 2: С отдельными файлами

```html
<div id="quote-editor-isolated"></div>

<script src="/path/to/shadow-adapter.js"></script>
<script src="/path/to/quote-editor-wrapper.js"></script>
<script>
    const editor = new QuoteEditorIsolated('quote-editor-isolated', {
        stylesPath: '/path/to/quote-editor.css',
        templatePath: '/path/to/quote-editor.html'
    });
</script>
```

---

## Пошаговая миграция

### Шаг 1: Подготовка файлов

#### 1.1 Извлеките CSS из вашего HTML

Создайте файл `css/quote-editor.css` и скопируйте туда ВСЕ стили из `<style>` тега:

```css
/* quote-editor.css */
.main-ctr {
    margin: 0 auto;
    background: white;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* ... все 8530 строк стилей ... */
```

#### 1.2 Извлеките HTML

Создайте файл `templates/quote-editor.html`:

```html
<!-- quote-editor.html -->
<div class="main-ctr">
    <div class="hdr">
        <h1>🎨 Универсальный редактор цитат</h1>
        <!-- ... весь HTML ... -->
    </div>
</div>
```

#### 1.3 Подготовьте JavaScript

Скопируйте весь ваш JavaScript код в отдельный файл для последующей обработки.

---

### Шаг 2: Автоматическая конвертация

Используйте скрипт `convert-to-shadow.js` для автоматизации:

```bash
# Установите Node.js (если еще не установлен)
# Затем запустите:

node convert-to-shadow.js your-original.html converted-output.js
```

Скрипт автоматически заменит:
- `document.getElementById()` → `QE.get()`
- `document.querySelector()` → `QE.qs()`
- `document.querySelectorAll()` → `QE.qsAll()`
- `document.addEventListener()` → `shadowRoot.addEventListener()` (где необходимо)

---

### Шаг 3: Ручная адаптация

#### 3.1 Замените объект QE

Добавьте в начало вашего кода:

```javascript
const QE = {};

// Адаптированные селекторы для Shadow DOM
QE.get = (id) => shadowRoot.getElementById(id);
QE.qs = (selector) => shadowRoot.querySelector(selector);
QE.qsAll = (selector) => shadowRoot.querySelectorAll(selector);
```

#### 3.2 Обработайте глобальные события

Некоторые события должны оставаться на `document`:

```javascript
// ✅ ПРАВИЛЬНО - глобальные события
document.addEventListener('paste', function(e) {
    // Обработка вставки из буфера
});

document.addEventListener('resize', function(e) {
    // Обработка изменения размера окна
});

// ✅ ПРАВИЛЬНО - локальные события
shadowRoot.addEventListener('click', function(e) {
    // Обработка кликов внутри Shadow DOM
});
```

#### 3.3 Уберите DOMContentLoaded

```javascript
// ❌ БЫЛО:
document.addEventListener('DOMContentLoaded', function() {
    // инициализация
});

// ✅ СТАЛО:
(function init() {
    // инициализация
})();
```

---

### Шаг 4: Создание обертки

#### Минимальная обертка:

```javascript
(function() {
    'use strict';

    // 1. Создаем Shadow DOM
    const container = document.getElementById('quote-editor-isolated');
    const shadowRoot = container.attachShadow({ mode: 'open' });

    // 2. Загружаем стили и HTML
    shadowRoot.innerHTML = `
        <style>${YOUR_CSS}</style>
        ${YOUR_HTML}
    `;

    // 3. Инициализируем QE
    const QE = {};
    QE.get = (id) => shadowRoot.getElementById(id);
    QE.qs = (sel) => shadowRoot.querySelector(sel);
    QE.qsAll = (sel) => shadowRoot.querySelectorAll(sel);

    // 4. Весь ваш код QE
    QE.state = { /* ... */ };
    QE.genImg = function() { /* ... */ };
    // ...

    // 5. Инициализация
    (function() {
        const canvas = QE.get('qcanvas');
        // ... инициализация
    })();

    // 6. Экспорт для внешнего доступа
    window.QuoteEditorInstance = {
        shadowRoot,
        QE,
        getCanvas: () => QE.get('qcanvas')
    };
})();
```

---

## API для внешнего доступа

После инициализации доступен глобальный объект `window.QuoteEditorInstance`:

### Получение canvas

```javascript
const canvas = window.QuoteEditorInstance.getCanvas();
const imageData = canvas.toDataURL('image/png');
```

### Получение текста цитаты

```javascript
const quoteText = window.QuoteEditorInstance.QE.get('txtQuote').value;
```

### Программная генерация изображения

```javascript
window.QuoteEditorInstance.QE.genImg();
```

### Доступ к состоянию

```javascript
const state = window.QuoteEditorInstance.QE.state;
console.log('Current background:', state.bgImg);
```

### Интеграция с DLE

```javascript
// Функция для публикации в DLE
function publishToDLE() {
    const canvas = window.QuoteEditorInstance.getCanvas();
    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    // Ваша логика публикации
    // ...
}
```

---

## Troubleshooting

### Проблема: Canvas не отображается

**Решение:**
```javascript
// Проверьте, что canvas существует в Shadow DOM
const canvas = shadowRoot.getElementById('qcanvas');
console.log('Canvas found:', canvas);

// Если null, проверьте корректность HTML вставки
```

### Проблема: Стили не применяются

**Решение:**
```javascript
// Убедитесь, что стили вставлены ДО HTML
shadowRoot.innerHTML = `
    <style>${css}</style>  <!-- СНАЧАЛА -->
    ${html}                 <!-- ПОТОМ -->
`;
```

### Проблема: События не работают

**Решение:**
```javascript
// ❌ НЕ РАБОТАЕТ:
document.getElementById('myButton').addEventListener('click', ...);

// ✅ РАБОТАЕТ:
shadowRoot.getElementById('myButton').addEventListener('click', ...);

// ✅ ИЛИ:
QE.get('myButton').addEventListener('click', ...);
```

### Проблема: Внешние библиотеки недоступны

**Решение:**
```html
<!-- Подключайте библиотеки ПЕРЕД Shadow DOM -->
<script src="jszip.min.js"></script>
<script src="filesaver.min.js"></script>

<script>
    // Теперь JSZip и saveAs доступны внутри Shadow DOM
    const zip = new JSZip();
</script>
```

### Проблема: LocalStorage не работает

**Решение:**
```javascript
// LocalStorage глобален и работает нормально
localStorage.setItem('key', 'value'); // ✅ Работает
```

---

## Контрольный чеклист

Перед запуском убедитесь:

- [ ] Все стили перенесены в Shadow DOM
- [ ] Все `document.getElementById` заменены на `QE.get`
- [ ] Все `document.querySelector` заменены на `QE.qs`
- [ ] `DOMContentLoaded` заменен на прямой вызов
- [ ] Внешние библиотеки подключены ДО Shadow DOM
- [ ] Глобальные события (paste, resize) остались на `document`
- [ ] Локальные события перенесены на `shadowRoot`
- [ ] Создан API для внешнего доступа
- [ ] Протестирована изоляция стилей

---

## Дополнительные ресурсы

- [MDN: Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Web Components Best Practices](https://web.dev/custom-elements-best-practices/)
- [Изоляция стилей в Web Components](https://css-tricks.com/styling-a-web-component/)

---

## Поддержка

Если возникли проблемы:

1. Проверьте консоль браузера (`F12` → Console)
2. Убедитесь, что контейнер существует
3. Проверьте последовательность подключения скриптов
4. Убедитесь в поддержке Shadow DOM браузером

---

## Лицензия

MIT License - используйте свободно в ваших проектах.

---

**Создано с ❤️ для DLE интеграции**
