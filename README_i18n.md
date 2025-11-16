# 🌍 Мультиязычность (i18n) - Быстрый старт

## 📦 Что включено

✅ Автоопределение языка браузера
✅ Сохранение выбора в localStorage
✅ Английский как fallback (если перевод отсутствует)
✅ Переключение через селект и ссылки
✅ Полная поддержка HTML атрибутов
✅ JavaScript API

---

## 🚀 Установка (3 шага)

### 1. Подключите i18n.js
```html
<head>
    <script src="/js/i18n.js"></script>
</head>
```

### 2. Добавьте переключатель языка
```html
<body>
    {include file="includes/language_switcher.tpl"}
    <!-- ваш контент -->
</body>
```

### 3. Добавьте атрибуты data-i18n
```html
<h1 data-i18n="app_title">Universal Quote Editor</h1>
<button data-i18n="buttons.download">Download</button>
<input data-i18n-placeholder="fields.author" placeholder="Author">
```

**Готово!** 🎉 Система автоматически:
- Определит язык пользователя
- Загрузит нужные переводы
- Применит их к элементам

---

## 📝 Основное использование

### HTML
```html
<!-- Текст -->
<h1 data-i18n="app_title">Default Text</h1>

<!-- Placeholder -->
<input data-i18n-placeholder="search.placeholder" placeholder="Search...">

<!-- Подсказка -->
<button data-i18n="buttons.save"
        data-i18n-title="tooltips.save">Save</button>

<!-- Select -->
<select>
    <option data-i18n="categories.random">Random</option>
</select>
```

### JavaScript
```javascript
// Получить перевод
const text = i18n.t('app_title');

// С fallback
const text = i18n.t('missing.key', 'Default');

// Сменить язык
i18n.switchLanguage('ru');

// Текущий язык
const lang = i18n.getCurrentLanguage(); // 'en' или 'ru'
```

---

## 📁 Структура переводов

### Формат: `/translate/en.json`
```json
{
  "app_title": "Universal Quote Editor",
  "buttons": {
    "save": "Save",
    "download": "Download"
  },
  "messages": {
    "success": "Success!"
  }
}
```

### Обращение
```javascript
i18n.t('app_title')           // "Universal Quote Editor"
i18n.t('buttons.save')        // "Save"
i18n.t('messages.success')    // "Success!"
```

---

## 🔄 Переключение языка

### Вариант 1: Селект (по умолчанию)
```html
<select id="languageSelector">
    <option value="en">English</option>
    <option value="ru">Русский</option>
</select>
```

### Вариант 2: Ссылки
```html
<a href="#" data-lang-link="en">English</a>
<a href="#" data-lang-link="ru">Русский</a>
```

### Вариант 3: Программно
```javascript
document.getElementById('myBtn').onclick = () => {
    i18n.switchLanguage('ru');
};
```

---

## ⚡ Примеры

### Кнопка с переводом
```html
<button class="btn"
        id="downloadBtn"
        data-i18n="buttons.download">
    Download
</button>
```

### Уведомление
```javascript
function showSuccess() {
    const message = i18n.t('messages.success_saved');
    alert(message);
}
```

### Форма
```html
<form>
    <input type="text"
           data-i18n-placeholder="fields.author"
           placeholder="Author">

    <button data-i18n="buttons.submit">Submit</button>
</form>
```

### Динамический контент
```javascript
// После загрузки нового контента
document.getElementById('container').innerHTML = newHTML;
i18n.applyTranslations(); // Применить переводы
```

---

## 🎯 Добавить новый язык

1. **Создайте** `/translate/de.json`
2. **Добавьте** в конфиг:
   ```javascript
   // /js/i18n.js
   availableLangs: ['en', 'ru', 'de']
   ```
3. **Обновите** переключатель:
   ```html
   <option value="de">Deutsch</option>
   ```

---

## 🐛 Отладка

```javascript
// В консоли браузера:
console.log('Язык:', i18n.getCurrentLanguage());
console.log('Доступные:', i18n.getAvailableLanguages());
console.log('Перевод:', i18n.t('app_title'));
```

---

## 📚 Полная документация

Смотрите `/docs/i18n_guide.md` для:
- Подробных примеров
- API Reference
- Лучших практик
- Продвинутых техник

---

## ✨ Особенности

- **Автоопределение**: Система сама определит язык браузера
- **Запоминание**: Выбор сохраняется между сеансами
- **Fallback**: Если перевод отсутствует, показывается английский
- **Легковесность**: ~7KB минифицированного кода
- **Без зависимостей**: Чистый JavaScript
- **Поддержка событий**: `languageChanged` для кастомной логики

---

## 🎓 Шпаргалка

| Действие | Код |
|----------|-----|
| Перевести текст | `data-i18n="key"` |
| Перевести placeholder | `data-i18n-placeholder="key"` |
| Перевести title | `data-i18n-title="key"` |
| Получить перевод в JS | `i18n.t('key')` |
| Сменить язык | `i18n.switchLanguage('ru')` |
| Текущий язык | `i18n.getCurrentLanguage()` |
| Применить переводы | `i18n.applyTranslations()` |

---

**Вопросы?** Смотрите `/docs/i18n_guide.md` 📖
