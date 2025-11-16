# Шаги интеграции i18n в существующий редактор цитат

## Шаг 1: Подключение файлов

### В начале HTML (в `<head>`):
```html
<head>
    <meta charset="UTF-8">
    <title>Quote Editor</title>

    <!-- ДОБАВИТЬ: Подключение i18n ПЕРЕД другими скриптами -->
    <script src="/js/i18n.js"></script>

    <!-- Остальные скрипты -->
</head>
```

### В начале `<body>`:
```html
<body>
    <div class="main-ctr">
        <!-- ДОБАВИТЬ: Переключатель языка -->
        {include file="includes/language_switcher.tpl"}

        <!-- Остальной контент -->
        <div class="hdr">
            ...
```

---

## Шаг 2: Модификация HTML элементов

### БЫЛО:
```html
<h1>🎨 Универсальный редактор цитат</h1>
<p>Создавайте красивые цитаты с изображением и полным контролем над оформлением</p>
```

### СТАЛО:
```html
<h1 data-i18n="app_title">🎨 Универсальный редактор цитат</h1>
<p data-i18n="app_subtitle">Создавайте красивые цитаты с изображением и полным контролем над оформлением</p>
```

---

### БЫЛО:
```html
<button id="tabMovies" class="api-tab active">🎬 Кино</button>
<button id="tabMusic" class="api-tab">🎵 Музыка</button>
<button id="tabPexels" class="api-tab">🖼️ Фото</button>
```

### СТАЛО:
```html
<button id="tabMovies" class="api-tab active" data-i18n="tabs.movies">🎬 Кино</button>
<button id="tabMusic" class="api-tab" data-i18n="tabs.music">🎵 Музыка</button>
<button id="tabPexels" class="api-tab" data-i18n="tabs.photos">🖼️ Фото</button>
```

---

### БЫЛО:
```html
<input type="text" id="apiSearchQuery" placeholder="Введите название фильма...">
<button class="btn" id="apiSearchBtn">🔍 Найти</button>
```

### СТАЛО:
```html
<input type="text"
       id="apiSearchQuery"
       data-i18n-placeholder="search.placeholder_movie"
       placeholder="Введите название фильма...">
<button class="btn"
        id="apiSearchBtn"
        data-i18n="search.button_search">🔍 Найти</button>
```

---

### БЫЛО:
```html
<select id="quoteCategory">
    <option value="random">🎲 Случайная</option>
    <option value="мотивационную">💪 Мотивационная</option>
    <option value="философскую">🧠 Философская</option>
</select>
```

### СТАЛО:
```html
<select id="quoteCategory">
    <option value="random" data-i18n="categories.random">🎲 Случайная</option>
    <option value="мотивационную" data-i18n="categories.motivational">💪 Мотивационная</option>
    <option value="философскую" data-i18n="categories.philosophical">🧠 Философская</option>
</select>
```

---

### БЫЛО:
```html
<button class="btn" id="randomQuoteBtn">🤖 Сгенерировать(ИИ)</button>
<button class="btn" id="jsonQuoteBtn">📚 Случайная</button>
<button class="btn" id="downloadBtn">💿 Скачать</button>
```

### СТАЛО:
```html
<button class="btn"
        id="randomQuoteBtn"
        data-i18n="buttons.generate_ai">🤖 Сгенерировать(ИИ)</button>
<button class="btn"
        id="jsonQuoteBtn"
        data-i18n="buttons.generate_random">📚 Случайная</button>
<button class="btn"
        id="downloadBtn"
        data-i18n="buttons.download">💿 Скачать</button>
```

---

## Шаг 3: Модификация JavaScript

### БЫЛО:
```javascript
QE.showErr = function(msg) {
    errDiv.textContent = msg;
    errDiv.classList.add('show');
};
```

### СТАЛО (опционально, для более гибкого управления):
```javascript
QE.showErr = function(msgKeyOrText) {
    // Попытка получить перевод, если это ключ
    const message = window.i18n ? window.i18n.t(msgKeyOrText, msgKeyOrText) : msgKeyOrText;
    errDiv.textContent = message;
    errDiv.classList.add('show');
};

// Использование:
QE.showErr('messages.error_no_quote'); // С ключом
QE.showErr('Произвольная ошибка');     // Или напрямую текст
```

---

### БЫЛО:
```javascript
QE.showSuccess = function(msg) {
    successDiv.textContent = msg;
    successDiv.classList.add('show');
};
```

### СТАЛО:
```javascript
QE.showSuccess = function(msgKeyOrText) {
    const message = window.i18n ? window.i18n.t(msgKeyOrText, msgKeyOrText) : msgKeyOrText;
    successDiv.textContent = message;
    successDiv.classList.add('show');
};

// Использование:
QE.showSuccess('messages.success_downloaded');
```

---

### Пример обновления динамического контента:

```javascript
// После загрузки результатов поиска
QE.displayMovieResults = function(results) {
    // ... код создания элементов ...

    if (validResults.length === 0) {
        resultsContainer.innerHTML = `
            <p style="text-align: center; color: #666; padding: 10px;"
               data-i18n="search.no_results">
                Ничего не найдено.
            </p>
        `;

        // ВАЖНО: Применить переводы к новым элементам
        if (window.i18n) {
            window.i18n.applyTranslations();
        }
        return;
    }

    // ... остальной код ...
};
```

---

## Шаг 4: Обработка событий смены языка

Добавьте в конец основного скрипта:

```javascript
// В конце DOMContentLoaded или основного скрипта
document.addEventListener('languageChanged', function(e) {
    console.log('Язык изменен на:', e.detail.language);

    // Перегенерировать изображение с новым языком
    if (typeof QE !== 'undefined' && QE.genImg) {
        QE.genImg();
    }

    // Обновить динамически созданные элементы
    // (если они не обновляются автоматически через data-i18n)
    updateDynamicElements();
});

function updateDynamicElements() {
    // Пример: обновление текста в уведомлениях
    const notifications = document.querySelectorAll('.notification[data-i18n-key]');
    notifications.forEach(notif => {
        const key = notif.getAttribute('data-i18n-key');
        if (key && window.i18n) {
            notif.textContent = window.i18n.t(key);
        }
    });
}
```

---

## Шаг 5: Проверка работы

1. **Откройте страницу в браузере**
2. **Откройте консоль (F12)**
3. **Проверьте инициализацию:**
   ```
   🌍 Инициализация i18n...
   📌 Язык браузера: ru
   💾 Сохраненный язык: нет
   🎯 Выбранный язык: ru
   ✅ i18n инициализирован. Текущий язык: ru
   ```

4. **Проверьте переводы в консоли:**
   ```javascript
   i18n.t('app_title')
   i18n.getCurrentLanguage()
   ```

5. **Переключите язык** через селектор

6. **Убедитесь, что текст изменился**

---

## Шаг 6: Оптимизация (опционально)

### Ленивая загрузка переводов
```javascript
// Загружать переводы только когда нужно
async function loadLanguageIfNeeded(lang) {
    if (!translations[lang]) {
        translations[lang] = await loadTranslations(lang);
    }
    return translations[lang];
}
```

### Кеширование в sessionStorage
```javascript
// В i18n.js
function cacheTranslations(lang, data) {
    try {
        sessionStorage.setItem(`i18n_${lang}`, JSON.stringify(data));
    } catch (e) {}
}

function getCachedTranslations(lang) {
    try {
        const cached = sessionStorage.getItem(`i18n_${lang}`);
        return cached ? JSON.parse(cached) : null;
    } catch (e) {
        return null;
    }
}
```

---

## Типичные ошибки и решения

### ❌ Переводы не применяются
**Причина:** i18n.js загружается после основного скрипта
**Решение:** Переместите `<script src="/js/i18n.js"></script>` в `<head>`

---

### ❌ Показываются ключи вместо текста
**Причина:** Неправильный ключ или отсутствие перевода
**Решение:** Проверьте:
```javascript
console.log(i18n.t('ваш.ключ')); // Должен вернуть текст
```

---

### ❌ Динамический контент не переводится
**Причина:** Контент добавлен после инициализации
**Решение:** Вызовите `i18n.applyTranslations()` после добавления контента

---

### ❌ Язык не сохраняется
**Причина:** localStorage заблокирован или недоступен
**Решение:** Проверьте:
```javascript
try {
    localStorage.setItem('test', '1');
    console.log('localStorage работает');
} catch (e) {
    console.error('localStorage недоступен:', e);
}
```

---

## Полезные команды для отладки

```javascript
// В консоли браузера:

// Текущий язык
i18n.getCurrentLanguage()

// Доступные языки
i18n.getAvailableLanguages()

// Тест перевода
i18n.t('app_title')

// Принудительно применить переводы
i18n.applyTranslations()

// Сменить язык
i18n.switchLanguage('en')

// Проверить что i18n загружен
typeof i18n !== 'undefined'
```

---

## Чеклист интеграции

- [ ] Создан `/translate/en.json`
- [ ] Создан `/translate/ru.json`
- [ ] Создан `/js/i18n.js`
- [ ] Создан `/includes/language_switcher.tpl`
- [ ] Подключен `i18n.js` в `<head>`
- [ ] Добавлен переключатель языка в `<body>`
- [ ] Добавлены атрибуты `data-i18n` к элементам
- [ ] Обновлены placeholder через `data-i18n-placeholder`
- [ ] Обновлены функции показа сообщений
- [ ] Добавлен обработчик события `languageChanged`
- [ ] Протестировано переключение языков
- [ ] Проверена работа fallback

---

**Готово!** Система мультиязычности интегрирована ✅
