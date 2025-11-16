# 🌍 Руководство по мультиязычности (i18n)

## Содержание
1. [Быстрый старт](#быстрый-старт)
2. [Структура файлов](#структура-файлов)
3. [Использование в HTML](#использование-в-html)
4. [Использование в JavaScript](#использование-в-javascript)
5. [Добавление нового языка](#добавление-нового-языка)
6. [API Reference](#api-reference)
7. [Примеры](#примеры)

---

## Быстрый старт

### 1. Подключение
```html
<!-- В <head> ПЕРЕД основными скриптами -->
<script src="/js/i18n.js"></script>

<!-- В <body> где нужен переключатель языка -->
{include file="includes/language_switcher.tpl"}
```

### 2. Использование в HTML
```html
<!-- Простой текст -->
<h1 data-i18n="app_title">Universal Quote Editor</h1>

<!-- Placeholder -->
<input type="text"
       data-i18n-placeholder="fields.author"
       placeholder="Author name">

<!-- Title атрибут -->
<button data-i18n="buttons.download"
        data-i18n-title="buttons.download_hint">
    Download
</button>
```

### 3. Использование в JavaScript
```javascript
// Получить перевод
const title = i18n.t('app_title');

// С fallback значением
const text = i18n.t('missing.key', 'Default text');

// Текущий язык
const lang = i18n.getCurrentLanguage(); // 'en' или 'ru'

// Сменить язык
await i18n.switchLanguage('ru');
```

---

## Структура файлов

```
/translate/
├── en.json    # Английские переводы (основной)
└── ru.json    # Русские переводы

/js/
└── i18n.js    # Модуль переводов

/includes/
└── language_switcher.tpl    # Переключатель языка
```

### Формат JSON
```json
{
  "simple_key": "Simple value",
  "nested": {
    "key": "Nested value",
    "another": "Another nested value"
  },
  "array_like": {
    "item1": "First item",
    "item2": "Second item"
  }
}
```

**Обращение:**
- `i18n.t('simple_key')` → "Simple value"
- `i18n.t('nested.key')` → "Nested value"
- `i18n.t('nested.another')` → "Another nested value"

---

## Использование в HTML

### 1. Атрибут `data-i18n` (основной контент)
```html
<h1 data-i18n="app_title">Universal Quote Editor</h1>
<p data-i18n="app_subtitle">Create beautiful quotes...</p>
<button data-i18n="buttons.download">Download</button>
```

### 2. Атрибут `data-i18n-placeholder` (для input/textarea)
```html
<input type="text"
       id="writer"
       data-i18n-placeholder="fields.author"
       placeholder="Author name">

<textarea data-i18n-placeholder="fields.quote"
          placeholder="Quote text"></textarea>
```

### 3. Атрибут `data-i18n-title` (подсказки)
```html
<button data-i18n="buttons.save"
        data-i18n-title="tooltips.save_hint"
        title="Save your work">
    Save
</button>
```

### 4. Select и Option
```html
<select id="category">
    <option value="random" data-i18n="categories.random">Random</option>
    <option value="love" data-i18n="categories.love">About Love</option>
</select>
```

### 5. Заголовок страницы
```html
<html lang="en" data-i18n-page-title="app_title">
```

---

## Использование в JavaScript

### Основные функции

#### `i18n.t(key, defaultValue)`
Получить перевод по ключу.

```javascript
// Простое использование
const title = i18n.t('app_title');
console.log(title); // "Universal Quote Editor"

// С fallback
const text = i18n.t('nonexistent.key', 'Fallback text');
console.log(text); // "Fallback text"

// Вложенные ключи
const error = i18n.t('messages.error_no_quote');
console.log(error); // "Enter quote text"
```

#### `i18n.switchLanguage(lang)`
Переключить язык интерфейса.

```javascript
// Синхронно (с async/await)
await i18n.switchLanguage('ru');

// Асинхронно
i18n.switchLanguage('en').then(() => {
    console.log('Language switched!');
});
```

#### `i18n.getCurrentLanguage()`
Получить код текущего языка.

```javascript
const currentLang = i18n.getCurrentLanguage();
console.log(currentLang); // 'en' или 'ru'

if (currentLang === 'ru') {
    // Логика для русского языка
}
```

#### `i18n.getAvailableLanguages()`
Получить список доступных языков.

```javascript
const languages = i18n.getAvailableLanguages();
console.log(languages); // ['en', 'ru']
```

#### `i18n.applyTranslations()`
Применить переводы ко всем элементам на странице.

```javascript
// Полезно после динамической загрузки контента
document.getElementById('content').innerHTML = newContent;
i18n.applyTranslations();
```

### Обработка событий

#### Событие `languageChanged`
```javascript
document.addEventListener('languageChanged', function(e) {
    const newLang = e.detail.language;
    console.log('Язык изменен на:', newLang);

    // Обновление динамического контента
    updateCustomElements();

    // Перезагрузка данных
    reloadData();
});
```

### Примеры использования

#### Показ уведомлений с переводом
```javascript
function showSuccess(messageKey) {
    const message = i18n.t(messageKey);
    alert(message);
}

// Использование
showSuccess('messages.success_saved');
```

#### Динамическое создание элементов
```javascript
function createButton(labelKey, onClick) {
    const button = document.createElement('button');
    button.className = 'btn';
    button.textContent = i18n.t(labelKey);
    button.onclick = onClick;

    // Обновлять при смене языка
    document.addEventListener('languageChanged', () => {
        button.textContent = i18n.t(labelKey);
    });

    return button;
}

const saveBtn = createButton('buttons.save', () => {
    console.log('Saving...');
});
```

#### AJAX с языком
```javascript
async function fetchData() {
    const lang = i18n.getCurrentLanguage();

    const response = await fetch(`/api/quotes?lang=${lang}`);
    const data = await response.json();

    return data;
}
```

#### Условная логика по языку
```javascript
function formatDate(date) {
    const lang = i18n.getCurrentLanguage();

    if (lang === 'ru') {
        return date.toLocaleDateString('ru-RU');
    } else {
        return date.toLocaleDateString('en-US');
    }
}
```

---

## Добавление нового языка

### Шаг 1: Создать файл перевода
Создайте `/translate/de.json` (например, для немецкого):
```json
{
  "app_title": "Universeller Zitat-Editor",
  "app_subtitle": "Erstellen Sie schöne Zitate...",
  "buttons": {
    "download": "Herunterladen",
    "save": "Speichern"
  }
}
```

### Шаг 2: Обновить конфигурацию
В `/js/i18n.js` найдите:
```javascript
const CONFIG = {
    defaultLang: 'en',
    availableLangs: ['en', 'ru'],  // Добавьте 'de'
    storageKey: 'quote_editor_lang',
    translationsPath: '/translate/'
};
```

Измените на:
```javascript
availableLangs: ['en', 'ru', 'de'],
```

### Шаг 3: Добавить в переключатель
В `language_switcher.tpl`:
```html
<select id="languageSelector">
    <option value="en">English</option>
    <option value="ru">Русский</option>
    <option value="de">Deutsch</option>  <!-- Добавить -->
</select>
```

Или для ссылок:
```html
<a href="#" data-lang-link="de" class="lang-link">
    <span class="lang-flag">🇩🇪</span>
    <span class="lang-name">DE</span>
</a>
```

---

## API Reference

### Функции

| Функция | Параметры | Возврат | Описание |
|---------|-----------|---------|----------|
| `i18n.t(key, defaultValue)` | `key: string`<br>`defaultValue?: string` | `string` | Получить перевод по ключу |
| `i18n.switchLanguage(lang)` | `lang: string` | `Promise<boolean>` | Переключить язык |
| `i18n.getCurrentLanguage()` | - | `string` | Получить текущий язык |
| `i18n.getAvailableLanguages()` | - | `string[]` | Список доступных языков |
| `i18n.applyTranslations()` | - | `void` | Применить переводы к DOM |

### События

| Событие | Detail | Описание |
|---------|--------|----------|
| `languageChanged` | `{ language: string }` | Срабатывает при смене языка |

### Атрибуты HTML

| Атрибут | Применяется к | Описание |
|---------|---------------|----------|
| `data-i18n` | Любой элемент | Переводит textContent |
| `data-i18n-placeholder` | input, textarea | Переводит placeholder |
| `data-i18n-title` | Любой элемент | Переводит title |
| `data-i18n-value` | input | Переводит value |
| `data-i18n-page-title` | html | Переводит document.title |

---

## Примеры

### Пример 1: Форма с переводами
```html
<form>
    <h2 data-i18n="forms.create_quote">Create Quote</h2>

    <label>
        <span data-i18n="fields.quote">Quote:</span>
        <textarea data-i18n-placeholder="fields.quote_placeholder"></textarea>
    </label>

    <label>
        <span data-i18n="fields.author">Author:</span>
        <input type="text" data-i18n-placeholder="fields.author_placeholder">
    </label>

    <button type="submit" data-i18n="buttons.submit">Submit</button>
</form>
```

### Пример 2: Валидация с переводами
```javascript
function validateForm() {
    const quote = document.getElementById('quote').value;

    if (!quote.trim()) {
        const error = i18n.t('validation.required_quote');
        alert(error);
        return false;
    }

    const success = i18n.t('messages.form_valid');
    console.log(success);
    return true;
}
```

### Пример 3: Динамический список
```javascript
function renderCategories(categories) {
    const container = document.getElementById('categories');

    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.textContent = i18n.t(`categories.${cat.key}`);
        item.dataset.i18n = `categories.${cat.key}`;

        container.appendChild(item);
    });
}

// При смене языка
document.addEventListener('languageChanged', () => {
    i18n.applyTranslations();
});
```

### Пример 4: Множественное число (расширение)
```javascript
// Добавьте в i18n.js
function plural(key, count) {
    const lang = getCurrentLanguage();

    if (lang === 'ru') {
        // Логика для русского: 1 цитата, 2 цитаты, 5 цитат
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod10 === 1 && mod100 !== 11) {
            return i18n.t(`${key}.one`);
        } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
            return i18n.t(`${key}.few`);
        } else {
            return i18n.t(`${key}.many`);
        }
    } else {
        // Английский: 1 quote, 2 quotes
        return count === 1 ? i18n.t(`${key}.one`) : i18n.t(`${key}.other`);
    }
}

// В JSON:
// "quote_count": {
//   "one": "quote",
//   "few": "цитаты",  // только для русского
//   "many": "цитат",  // только для русского
//   "other": "quotes"
// }
```

---

## Лучшие практики

1. **Всегда используйте ключи вместо текста**
   ```javascript
   // ❌ Плохо
   alert('Saved successfully!');

   // ✅ Хорошо
   alert(i18n.t('messages.success_saved'));
   ```

2. **Группируйте переводы логически**
   ```json
   {
     "buttons": { ... },
     "messages": { ... },
     "validation": { ... }
   }
   ```

3. **Используйте осмысленные ключи**
   ```json
   // ❌ Плохо
   { "text1": "Save", "text2": "Cancel" }

   // ✅ Хорошо
   { "buttons": { "save": "Save", "cancel": "Cancel" } }
   ```

4. **Добавляйте контекст в ключи**
   ```json
   {
     "buttons.submit_form": "Submit",
     "buttons.submit_comment": "Post Comment"
   }
   ```

5. **Всегда предоставляйте английский перевод**
   - Английский = fallback
   - Даже если основной язык другой

---

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера
2. Убедитесь, что JSON файлы валидны
3. Проверьте правильность ключей
4. Убедитесь, что i18n.js загружен до использования

**Debug mode:**
```javascript
// В консоли
console.log('Current lang:', i18n.getCurrentLanguage());
console.log('All langs:', i18n.getAvailableLanguages());
console.log('Translation test:', i18n.t('app_title'));
```
