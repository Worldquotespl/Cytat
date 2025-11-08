# ⚡ Quick Start - 5 минут до результата

## Самый быстрый способ

### 1. Автоматическая конвертация (1 команда)

```bash
./convert.sh your-quote-editor.html
# Результат: isolated-output.html
```

### 2. Готовый шаблон для DLE (копировать-вставить)

```html
<!-- В ваш DLE шаблон (fullstory.tpl) -->

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

<div id="quote-editor"></div>

<script>
(function() {
    const shadow = document.getElementById('quote-editor').attachShadow({ mode: 'open' });

    shadow.innerHTML = `
        <style>
            /* ВСТАВЬТЕ СЮДА ВСЕ ВАШИ СТИЛИ */
        </style>

        <div class="main-ctr">
            <!-- ВСТАВЬТЕ СЮДА ВЕСЬ ВАШ HTML -->
        </div>
    `;

    const QE = {};
    QE.get = (id) => shadow.getElementById(id);
    QE.qs = (sel) => shadow.querySelector(sel);
    QE.qsAll = (sel) => shadow.querySelectorAll(sel);

    // ВСТАВЬТЕ СЮДА ВСЕ ВАШИ МЕТОДЫ QE
    QE.state = { /* ... */ };
    QE.genImg = function() { /* ... */ };
    // ...

    // Инициализация (вместо DOMContentLoaded)
    (function() {
        const canvas = QE.get('qcanvas');
        // ... ваша инициализация ...
    })();

    // Экспорт
    window.QuoteEditorInstance = { shadowRoot: shadow, QE };
})();
</script>
```

---

## Критичные замены (3 команды)

```bash
# 1. getElementById
sed -i 's/document\.getElementById/QE.get/g' file.js

# 2. querySelector
sed -i 's/document\.querySelector(/QE.qs(/g' file.js

# 3. querySelectorAll
sed -i 's/document\.querySelectorAll(/QE.qsAll(/g' file.js
```

---

## Проверка работоспособности

```javascript
// В консоли браузера (F12)
console.log(window.QuoteEditorInstance.shadowRoot);        // Должен быть объект
console.log(window.QuoteEditorInstance.QE.get('qcanvas')); // Должен быть canvas
window.QuoteEditorInstance.QE.genImg();                     // Должно сгенерировать
```

---

## Что изменить в вашем коде (минимум)

### До:
```javascript
document.getElementById('qcanvas')
document.querySelector('.btn')
document.addEventListener('DOMContentLoaded', ...)
```

### После:
```javascript
QE.get('qcanvas')
QE.qs('.btn')
(function init() { ... })()  // Прямой вызов вместо DOMContentLoaded
```

---

## Файлы для работы

1. **`dle-integration-template.html`** - готовый шаблон (просто заполните)
2. **`convert.sh`** - автоматический конвертер
3. **`MIGRATION-GUIDE.md`** - подробная инструкция (60 мин)
4. **`example-usage.html`** - рабочий пример

---

## Поддержка

**Не работает?** Проверьте:
- [ ] Внешние библиотеки подключены ДО Shadow DOM
- [ ] Все `document.getElementById` заменены на `QE.get`
- [ ] `DOMContentLoaded` убран
- [ ] Стили вставлены ПЕРЕД HTML в Shadow DOM

**Детали:** см. `MIGRATION-GUIDE.md` или `README.md`
