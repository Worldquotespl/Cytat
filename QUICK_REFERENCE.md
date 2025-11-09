# 📖 Быстрая справка по CSS

## 🎨 CSS Переменные

### Основные цвета
```css
--color-primary: #4CAF50
--color-secondary: #667eea
--color-accent: #2196F3
--color-error: #ff6b6b
--color-success: #28a745
--color-warning: #ff9800
```

### Размеры
```css
--border-radius: 5px
--border-radius-lg: 10px
--spacing-sm: 10px
--spacing-md: 15px
```

### Переходы
```css
--transition-fast: 0.2s ease
--transition-base: 0.3s ease
```

---

## 🧩 Утилиты

### Flexbox
```html
<div class="flex-center">     <!-- По центру -->
<div class="flex-between">    <!-- По краям -->
<div class="flex-gap">         <!-- С отступами -->
<div class="flex-wrap">        <!-- С переносом -->
```

---

## 🔘 Кнопки

```html
<button class="btn-auto">Основная</button>
<button class="btn-fmt">Форматирование</button>
<button class="btn-crop">Обрезка</button>
```

### Стили кнопок
```css
/* Основная */
.btn-auto { background: var(--color-primary); }

/* Активная */
.btn-fmt.active { background: var(--color-primary); color: white; }

/* Неактивная */
.btn-auto.inactive { background: var(--color-error); }
```

---

## 👁️ Показ/Скрытие

### HTML
```html
<div class="int-ctrls" id="myControl">
    Содержимое
</div>
```

### JavaScript
```javascript
// Показать
document.getElementById('myControl').classList.add('active');

// Скрыть
document.getElementById('myControl').classList.remove('active');

// Переключить
document.getElementById('myControl').classList.toggle('active');
```

---

## 📝 Вкладки

### HTML
```html
<div class="text-effects-tabs">
    <button class="text-tab active" data-tab="tab1">Вкладка 1</button>
    <button class="text-tab" data-tab="tab2">Вкладка 2</button>
</div>

<div id="tab1Content" class="text-content active">...</div>
<div id="tab2Content" class="text-content">...</div>
```

### JavaScript
```javascript
tabs.forEach((tab, index) => {
    tab.addEventListener('click', function() {
        // Убрать active со всех
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Добавить к текущим
        this.classList.add('active');
        contents[index].classList.add('active');
    });
});
```

---

## 🎚️ Ползунки (Range)

### HTML
```html
<div class="slider-container">
    <div class="slider-header">
        <span class="slider-label">Яркость:</span>
        <span class="slider-value" id="brightnessVal">100%</span>
    </div>
    <input type="range" id="brightness" min="0" max="200" value="100">
</div>
```

### JavaScript
```javascript
const slider = document.getElementById('brightness');
const value = document.getElementById('brightnessVal');

slider.addEventListener('input', function() {
    value.textContent = this.value + '%';
});
```

---

## 💬 Сообщения

### HTML
```html
<div class="error" id="errorMsg"></div>
<div class="success" id="successMsg"></div>
```

### JavaScript
```javascript
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.classList.add('show');

    setTimeout(() => {
        errorMsg.classList.remove('show');
    }, 3000);
}

function showSuccess(message) {
    const successMsg = document.getElementById('successMsg');
    successMsg.textContent = message;
    successMsg.classList.add('show');

    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}
```

---

## 📦 Модальные окна

### HTML
```html
<div class="modal-overlay" id="myModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Заголовок</h3>
            <span class="modal-close" id="closeModal">&times;</span>
        </div>
        <!-- Содержимое -->
    </div>
</div>
```

### JavaScript
```javascript
// Показать модальное окно
document.getElementById('myModal').classList.add('active');

// Скрыть модальное окно
document.getElementById('myModal').classList.remove('active');

// Закрыть по клику вне модального окна
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});
```

---

## 🎛️ Чекбоксы с контролами

### HTML
```html
<div class="mode-ctrl">
    <label>
        <input type="checkbox" id="myMode" class="checkbox-control">
        🎯 Режим
    </label>
    <div class="int-ctrls" id="myCtrls">
        <!-- Контролы -->
    </div>
</div>
```

### JavaScript
```javascript
const checkbox = document.getElementById('myMode');
const controls = document.getElementById('myCtrls');

checkbox.addEventListener('change', function() {
    controls.classList.toggle('active', this.checked);
});
```

---

## 🎨 Кастомизация темы

### Создайте файл custom-theme.css
```css
:root {
    --color-primary: #FF5722;
    --color-secondary: #E91E63;
    --border-radius: 10px;
}
```

### Подключите после основных стилей
```html
<link rel="stylesheet" href="css/quote-editor.css">
<link rel="stylesheet" href="css/custom-theme.css">
```

---

## 📱 Адаптивность

### Точка перелома
```css
@media (max-width: 768px) {
    /* Мобильные стили */
}
```

### Тестирование
- Chrome DevTools (F12 → Toggle Device Toolbar)
- Firefox Responsive Design Mode (Ctrl+Shift+M)
- Реальные устройства

---

## ⚡ Performance Tips

### DO ✅
```css
/* Использовать переменные */
color: var(--color-primary);

/* Использовать visibility для анимаций */
.element {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s;
}

/* Группировать свойства */
.btn {
    padding: 10px;
    border-radius: 5px;
    background: var(--color-primary);
}
```

### DON'T ❌
```css
/* Не дублировать значения */
color: #4CAF50; /* Плохо */

/* Не использовать display для анимаций */
.element {
    display: none; /* Плохо, вызывает reflow */
}

/* Не создавать излишнюю специфичность */
div.main-ctr .quote-gen input[type="text"] { } /* Слишком специфично */
```

---

## 🐛 Типичные ошибки

### 1. Элемент не показывается
```javascript
// ❌ Неправильно
element.style.display = 'block';

// ✅ Правильно
element.classList.add('active');
```

### 2. Анимация не работает
```css
/* ❌ Неправильно - нет transition */
.element.active {
    opacity: 1;
}

/* ✅ Правильно */
.element {
    opacity: 0;
    transition: opacity 0.3s;
}
.element.active {
    opacity: 1;
}
```

### 3. Стили не применяются
```html
<!-- ❌ Неправильно - порядок важен -->
<link rel="stylesheet" href="custom-theme.css">
<link rel="stylesheet" href="quote-editor.css">

<!-- ✅ Правильно -->
<link rel="stylesheet" href="quote-editor.css">
<link rel="stylesheet" href="custom-theme.css">
```

---

## 🔍 Отладка

### Chrome DevTools
```
1. F12 → Elements
2. Найти элемент
3. Посмотреть Computed стили
4. Проверить, какие переменные применились
```

### Firefox DevTools
```
1. F12 → Inspector
2. Найти элемент
3. Вкладка "Computed"
4. Поиск по переменной (--color-primary)
```

---

## 📋 Чеклист перед запуском

- [ ] CSS файл подключен
- [ ] Порядок подключения правильный
- [ ] Все `.active` классы работают
- [ ] Проверено на мобильных
- [ ] Проверена клавиатурная навигация
- [ ] Нет ошибок в консоли
- [ ] Анимации плавные

---

## 🎓 Полезные ссылки

- [Полная документация](CSS_OPTIMIZATION_GUIDE.md)
- [Примеры использования](example.html)
- [Кастомные темы](css/custom-theme.css)

---

**Version:** 2.0
**Last Updated:** 2025-11-09
