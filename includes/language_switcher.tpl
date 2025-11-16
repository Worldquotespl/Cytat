<!-- Language Switcher Component -->
<div class="language-switcher-container">
    <!-- Вариант 1: Выпадающий список -->
    <div class="lang-selector-wrapper">
        <label for="languageSelector" class="lang-label">
            <span class="lang-icon">🌍</span>
            <span data-i18n="language">Language</span>:
        </label>
        <select id="languageSelector" class="lang-select">
            <option value="en">English</option>
            <option value="ru">Русский</option>
        </select>
        <span id="langLoadingIndicator" class="lang-loading" style="display: none;">⏳</span>
    </div>

    <!-- Вариант 2: Ссылки (альтернативный вариант) -->
    <div class="lang-links-wrapper" style="display: none;">
        <a href="#" data-lang-link="en" class="lang-link">
            <span class="lang-flag">🇬🇧</span>
            <span class="lang-name">EN</span>
        </a>
        <span class="lang-separator">|</span>
        <a href="#" data-lang-link="ru" class="lang-link">
            <span class="lang-flag">🇷🇺</span>
            <span class="lang-name">RU</span>
        </a>
    </div>
</div>

<style>
/* Language Switcher Styles */
.language-switcher-container {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
}

.lang-selector-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.lang-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 600;
    color: #333;
    font-size: 14px;
    margin: 0;
}

.lang-icon {
    font-size: 18px;
}

.lang-select {
    flex: 1;
    max-width: 200px;
    padding: 8px 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.lang-select:hover {
    border-color: #2196F3;
}

.lang-select:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.lang-loading {
    font-size: 16px;
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Стили для ссылок (альтернативный вариант) */
.lang-links-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.lang-link {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    text-decoration: none;
    color: #666;
    font-weight: 500;
    font-size: 14px;
    border-radius: 6px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.lang-link:hover {
    background: #f5f5f5;
    color: #2196F3;
}

.lang-link.active {
    background: #2196F3;
    color: white;
    border-color: #2196F3;
}

.lang-flag {
    font-size: 18px;
}

.lang-name {
    font-weight: 600;
}

.lang-separator {
    color: #ddd;
    font-weight: 300;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
    .language-switcher-container {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }

    .lang-selector-wrapper {
        flex-direction: column;
        align-items: stretch;
    }

    .lang-label {
        justify-content: center;
    }

    .lang-select {
        max-width: 100%;
    }

    .lang-links-wrapper {
        justify-content: center;
    }
}

/* Компактный вариант для хедера */
.language-switcher-compact {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.language-switcher-compact .lang-select {
    max-width: 120px;
    padding: 5px 8px;
    font-size: 13px;
    border-radius: 15px;
}
</style>

<script>
// Дополнительные обработчики для кастомных событий смены языка
document.addEventListener('languageChanged', function(e) {
    console.log('🌍 Язык изменен на:', e.detail.language);

    // Здесь можно добавить дополнительную логику:
    // - Обновление динамически загруженного контента
    // - Изменение направления текста (RTL/LTR)
    // - Перезагрузка определенных компонентов

    // Пример: обновление заголовка документа
    if (e.detail.language === 'ru') {
        // Дополнительные действия для русского языка
    } else if (e.detail.language === 'en') {
        // Дополнительные действия для английского языка
    }
});
</script>
