/**
 * i18n - Internationalization Module
 * Система мультиязычности для редактора цитат
 */

const i18n = (function() {
    'use strict';

    const CONFIG = {
        defaultLang: 'en',
        availableLangs: ['en', 'ru'],
        storageKey: 'quote_editor_lang',
        translationsPath: '/translate/'
    };

    let currentLang = CONFIG.defaultLang;
    let translations = {};
    let fallbackTranslations = {};

    /**
     * Определяет язык браузера пользователя
     */
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];

        return CONFIG.availableLangs.includes(langCode) ? langCode : CONFIG.defaultLang;
    }

    /**
     * Получает сохраненный язык из localStorage
     */
    function getSavedLanguage() {
        try {
            return localStorage.getItem(CONFIG.storageKey);
        } catch (e) {
            console.warn('localStorage недоступен:', e);
            return null;
        }
    }

    /**
     * Сохраняет выбранный язык в localStorage
     */
    function saveLanguage(lang) {
        try {
            localStorage.setItem(CONFIG.storageKey, lang);
        } catch (e) {
            console.warn('Не удалось сохранить язык:', e);
        }
    }

    /**
     * Загружает файл переводов
     */
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`${CONFIG.translationsPath}${lang}.json`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Ошибка загрузки переводов для ${lang}:`, error);
            return null;
        }
    }

    /**
     * Получает перевод по ключу с поддержкой вложенных объектов
     * Примеры:
     *   t('app_title') -> "Universal Quote Editor"
     *   t('tabs.movies') -> "Movies"
     *   t('search.placeholder_movie') -> "Enter movie or series name..."
     */
    function translate(key, defaultValue = null) {
        const keys = key.split('.');
        let value = translations;

        // Ищем в текущих переводах
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                value = null;
                break;
            }
        }

        // Если не нашли, ищем в fallback (английский)
        if (value === null && currentLang !== CONFIG.defaultLang) {
            let fallbackValue = fallbackTranslations;
            for (const k of keys) {
                if (fallbackValue && typeof fallbackValue === 'object' && k in fallbackValue) {
                    fallbackValue = fallbackValue[k];
                } else {
                    fallbackValue = null;
                    break;
                }
            }
            value = fallbackValue;
        }

        // Возвращаем значение, defaultValue или сам ключ
        return value !== null ? value : (defaultValue || key);
    }

    /**
     * Применяет переводы ко всем элементам с атрибутом data-i18n
     */
    function applyTranslations() {
        // Переводы для элементов с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translate(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Для полей ввода переводим placeholder
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                }
            } else if (element.tagName === 'OPTION') {
                // Для option переводим textContent
                element.textContent = translation;
            } else {
                // Для остальных элементов
                element.textContent = translation;
            }
        });

        // Переводы для атрибутов title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = translate(key);
        });

        // Переводы для placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = translate(key);
        });

        // Переводы для атрибута value
        document.querySelectorAll('[data-i18n-value]').forEach(element => {
            const key = element.getAttribute('data-i18n-value');
            element.value = translate(key);
        });

        // Обновляем заголовок страницы
        const titleKey = document.documentElement.getAttribute('data-i18n-page-title');
        if (titleKey) {
            document.title = translate(titleKey);
        }
    }

    /**
     * Переключает язык интерфейса
     */
    async function switchLanguage(lang) {
        if (!CONFIG.availableLangs.includes(lang)) {
            console.error(`Язык ${lang} не поддерживается`);
            return false;
        }

        if (lang === currentLang) {
            return true; // Язык уже активен
        }

        // Показываем индикатор загрузки
        showLoadingIndicator();

        try {
            const newTranslations = await loadTranslations(lang);

            if (!newTranslations) {
                throw new Error('Не удалось загрузить переводы');
            }

            currentLang = lang;
            translations = newTranslations;

            // Сохраняем выбор
            saveLanguage(lang);

            // Применяем переводы
            applyTranslations();

            // Обновляем селектор языка
            updateLanguageSelector();

            // Обновляем атрибут lang в HTML
            document.documentElement.lang = lang;

            // Вызываем событие смены языка (для кастомных обработчиков)
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: lang }
            }));

            console.log(`✅ Язык изменен на: ${lang}`);
            return true;

        } catch (error) {
            console.error('Ошибка смены языка:', error);
            return false;
        } finally {
            hideLoadingIndicator();
        }
    }

    /**
     * Показывает индикатор загрузки
     */
    function showLoadingIndicator() {
        const indicator = document.getElementById('langLoadingIndicator');
        if (indicator) {
            indicator.style.display = 'inline-block';
        }
    }

    /**
     * Скрывает индикатор загрузки
     */
    function hideLoadingIndicator() {
        const indicator = document.getElementById('langLoadingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    /**
     * Обновляет состояние селектора языка
     */
    function updateLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (selector && selector.value !== currentLang) {
            selector.value = currentLang;
        }

        // Обновляем активные классы для ссылок
        document.querySelectorAll('[data-lang-link]').forEach(link => {
            const linkLang = link.getAttribute('data-lang-link');
            if (linkLang === currentLang) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Инициализация системы переводов
     */
    async function init() {
        console.log('🌍 Инициализация i18n...');

        // Определяем язык: сохраненный > браузера > по умолчанию
        const savedLang = getSavedLanguage();
        const detectedLang = detectBrowserLanguage();
        const initialLang = savedLang || detectedLang;

        console.log(`📌 Язык браузера: ${detectedLang}`);
        console.log(`💾 Сохраненный язык: ${savedLang || 'нет'}`);
        console.log(`🎯 Выбранный язык: ${initialLang}`);

        try {
            // Загружаем английский как fallback
            fallbackTranslations = await loadTranslations(CONFIG.defaultLang);

            if (!fallbackTranslations) {
                throw new Error('Не удалось загрузить fallback переводы');
            }

            // Загружаем выбранный язык
            if (initialLang === CONFIG.defaultLang) {
                translations = fallbackTranslations;
                currentLang = CONFIG.defaultLang;
            } else {
                const langTranslations = await loadTranslations(initialLang);

                if (langTranslations) {
                    translations = langTranslations;
                    currentLang = initialLang;
                } else {
                    // Если не удалось загрузить, используем английский
                    translations = fallbackTranslations;
                    currentLang = CONFIG.defaultLang;
                    console.warn(`Не удалось загрузить ${initialLang}, используется ${CONFIG.defaultLang}`);
                }
            }

            // Устанавливаем атрибут lang
            document.documentElement.lang = currentLang;

            // Применяем переводы
            applyTranslations();

            // Обновляем селектор
            updateLanguageSelector();

            // Инициализируем обработчики событий
            initEventHandlers();

            console.log(`✅ i18n инициализирован. Текущий язык: ${currentLang}`);

        } catch (error) {
            console.error('❌ Критическая ошибка инициализации i18n:', error);
        }
    }

    /**
     * Инициализирует обработчики событий для переключения языка
     */
    function initEventHandlers() {
        // Обработчик для select
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.addEventListener('change', function() {
                switchLanguage(this.value);
            });
        }

        // Обработчики для ссылок
        document.querySelectorAll('[data-lang-link]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang-link');
                switchLanguage(lang);
            });
        });
    }

    /**
     * Получает текущий язык
     */
    function getCurrentLanguage() {
        return currentLang;
    }

    /**
     * Получает список доступных языков
     */
    function getAvailableLanguages() {
        return CONFIG.availableLangs;
    }

    // Публичный API
    return {
        init,
        t: translate,
        switchLanguage,
        getCurrentLanguage,
        getAvailableLanguages,
        applyTranslations
    };
})();

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Экспортируем для использования в других скриптах
window.i18n = i18n;
