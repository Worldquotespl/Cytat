// =========================================================================
// ПРИМЕРЫ ВНЕДРЕНИЯ i18n В JAVASCRIPT КОД РЕДАКТОРА ЦИТАТ
// =========================================================================

// ======================= ПРИМЕР 1: ОБНОВЛЕНИЕ ФУНКЦИЙ УВЕДОМЛЕНИЙ =======================

// ❌ БЫЛО:
QE.showErr = function(msg) {
    const errDiv = QE.get('errMsg');
    if (msg) {
        errDiv.textContent = msg;
        errDiv.classList.add('show');
        setTimeout(() => errDiv.classList.remove('show'), 5000);
    } else {
        errDiv.classList.remove('show');
    }
};

QE.showSuccess = function(msg) {
    const successDiv = QE.get('successMsg');
    if (msg) {
        successDiv.textContent = msg;
        successDiv.classList.add('show');
        setTimeout(() => successDiv.classList.remove('show'), 3000);
    } else {
        successDiv.classList.remove('show');
    }
};

// ✅ СТАЛО:
QE.showErr = function(msgKeyOrText) {
    const errDiv = QE.get('errMsg');
    if (msgKeyOrText) {
        // Пытаемся перевести как ключ, если не получается - используем как текст
        const message = window.i18n ? i18n.t(msgKeyOrText, msgKeyOrText) : msgKeyOrText;
        errDiv.textContent = message;
        errDiv.classList.add('show');
        setTimeout(() => errDiv.classList.remove('show'), 5000);
    } else {
        errDiv.classList.remove('show');
    }
};

QE.showSuccess = function(msgKeyOrText) {
    const successDiv = QE.get('successMsg');
    if (msgKeyOrText) {
        const message = window.i18n ? i18n.t(msgKeyOrText, msgKeyOrText) : msgKeyOrText;
        successDiv.textContent = message;
        successDiv.classList.add('show');
        setTimeout(() => successDiv.classList.remove('show'), 3000);
    } else {
        successDiv.classList.remove('show');
    }
};

// ИСПОЛЬЗОВАНИЕ:
// QE.showErr('messages.error_no_quote');          // Использует ключ перевода
// QE.showErr('Custom error message');             // Использует текст напрямую
// QE.showSuccess('messages.success_downloaded');  // Использует ключ перевода


// ======================= ПРИМЕР 2: ЗАГРУЗКА ИЗОБРАЖЕНИЯ =======================

// ❌ БЫЛО:
QE.loadImgFromUrl = async function(url) {
    if (!url || !url.trim()) {
        QE.showErr('Введите URL изображения');
        return;
    }

    QE.showSuccess('🔗 Загружаю через прокси...');

    try {
        // ... код загрузки ...
        QE.showSuccess(`✅ Загружено! (${sizeKB} KB)`);
    } catch (error) {
        QE.showErr('❌ ' + error.message);
    }
};

// ✅ СТАЛО:
QE.loadImgFromUrl = async function(url) {
    if (!url || !url.trim()) {
        QE.showErr('messages.error_enter_url');
        return;
    }

    QE.showSuccess('messages.info_loading_image');

    try {
        // ... код загрузки ...
        const message = i18n.t('messages.success_image_loaded').replace('{size}', sizeKB);
        QE.showSuccess(message);
    } catch (error) {
        QE.showErr('messages.error_loading');
    }
};


// ======================= ПРИМЕР 3: ГЕНЕРАЦИЯ СЛУЧАЙНОЙ ЦИТАТЫ =======================

// ❌ БЫЛО:
QE.generateRandomQuote = async function() {
    try {
        btn.disabled = true;
        btn.textContent = '🤖 Генерирую...';

        QE.showSuccess('🤖 Генерирую цитату через ИИ...');

        // ... логика генерации ...

        QE.showSuccess(`✅ Цитата "${category}" готова!`);
    } catch (error) {
        QE.showErr(`❌ Ошибка: ${error.message}`);
    } finally {
        btn.textContent = '🤖 Сгенерировать(ИИ)';
    }
};

// ✅ СТАЛО:
QE.generateRandomQuote = async function() {
    const btn = QE.get('randomQuoteBtn');
    const originalText = btn.textContent;

    try {
        btn.disabled = true;
        btn.textContent = i18n.t('buttons.generating');

        QE.showSuccess('messages.info_generating_ai');

        // ... логика генерации ...

        const successMsg = i18n.t('messages.success_quote_ready')
            .replace('{category}', i18n.t(`categories.${finalCategory}`));
        QE.showSuccess(successMsg);
    } catch (error) {
        const errorMsg = i18n.t('messages.error_generation')
            .replace('{error}', error.message);
        QE.showErr(errorMsg);
    } finally {
        btn.textContent = i18n.t('buttons.generate_ai');
    }
};


// ======================= ПРИМЕР 4: ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ПОИСКА =======================

// ❌ БЫЛО:
QE.displayPexelsResults = function(photos, clearExisting = true) {
    const resultsContainer = QE.get('apiPexelsResults');

    if (clearExisting) {
        resultsContainer.innerHTML = '';
    }

    if (!photos || photos.length === 0) {
        if (clearExisting) {
            resultsContainer.innerHTML = '<p style="text-align: center;">Ничего не найдено.</p>';
        }
        return;
    }

    // ... отображение результатов ...
};

// ✅ СТАЛО:
QE.displayPexelsResults = function(photos, clearExisting = true) {
    const resultsContainer = QE.get('apiPexelsResults');

    if (clearExisting) {
        resultsContainer.innerHTML = '';
    }

    if (!photos || photos.length === 0) {
        if (clearExisting) {
            const noResults = i18n.t('search.no_results');
            resultsContainer.innerHTML = `<p style="text-align: center;">${noResults}</p>`;
        }
        return;
    }

    // ... отображение результатов ...
};


// ======================= ПРИМЕР 5: ПОИСК PEXELS =======================

// ❌ БЫЛО:
QE.searchPexels = async function(query, orientation = '', perPage = 15, page = 1) {
    if (!query.trim()) {
        QE.showErr('Введите поисковый запрос для Pexels.');
        return;
    }

    if (page === 1) {
        QE.showSuccess('🔍 Ищу фото на Pexels...');
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.textContent = '⏳ Загружаю...';
        loadMoreBtn.disabled = true;
    }

    // ... код поиска ...
};

// ✅ СТАЛО:
QE.searchPexels = async function(query, orientation = '', perPage = 15, page = 1) {
    if (!query.trim()) {
        QE.showErr('messages.error_enter_search_query');
        return;
    }

    if (page === 1) {
        QE.showSuccess('messages.info_searching_pexels');
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.textContent = i18n.t('buttons.loading');
        loadMoreBtn.disabled = true;
    }

    // ... код поиска ...

    // После успешного поиска:
    if (page < QE.pexelsState.totalPages && data.photos.length > 0) {
        loadMoreBtn.style.display = 'inline-block';
        const loadMoreText = i18n.t('buttons.load_more')
            .replace('{current}', page)
            .replace('{total}', QE.pexelsState.totalPages);
        loadMoreBtn.textContent = loadMoreText;
        loadMoreBtn.disabled = false;
    }
};


// ======================= ПРИМЕР 6: МУЛЬТИЭКСПОРТ =======================

// ❌ БЫЛО:
QE.multiExport.start = async function() {
    const selected = getSelectedPlatforms();

    if (selected.length === 0) {
        QE.showErr('Выберите хотя бы одну платформу');
        return;
    }

    const quote = QE.get('txtQuote').value.trim();
    if (!quote) {
        QE.showErr('Введите текст цитаты');
        return;
    }

    btn.textContent = '⏳ Создаю пакет...';

    // ... код экспорта ...

    QE.showSuccess(`✅ Готово! Создано ${platforms.length} изображений`);
};

// ✅ СТАЛО:
QE.multiExport.start = async function() {
    const selected = getSelectedPlatforms();

    if (selected.length === 0) {
        QE.showErr('messages.error_select_platform');
        return;
    }

    const quote = QE.get('txtQuote').value.trim();
    if (!quote) {
        QE.showErr('messages.error_no_quote');
        return;
    }

    btn.textContent = i18n.t('buttons.creating_package');

    // ... код экспорта ...

    const successMsg = i18n.t('messages.success_package_created')
        .replace('{count}', platforms.length)
        .replace('{size}', sizeMB);
    QE.showSuccess(successMsg);
};


// ======================= ПРИМЕР 7: ОБНОВЛЕНИЕ ПРОГРЕССА =======================

// ❌ БЫЛО:
QE.multiExport.updateProgress = function(current, total, status) {
    const percent = Math.round((current / total) * 100);
    statusEl.textContent = status;
    percentEl.textContent = percent + '%';
    currentEl.textContent = `Прогресс: ${current} из ${total}`;
};

// ✅ СТАЛО:
QE.multiExport.updateProgress = function(current, total, statusKey) {
    const percent = Math.round((current / total) * 100);

    // statusKey может быть строкой или ключом перевода
    const status = i18n.t(statusKey, statusKey);
    statusEl.textContent = status;

    percentEl.textContent = percent + '%';

    const progressText = i18n.t('multi_export.progress_count')
        .replace('{current}', current)
        .replace('{total}', total);
    currentEl.textContent = progressText;
};

// ИСПОЛЬЗОВАНИЕ:
// QE.multiExport.updateProgress(1, 5, 'multi_export.creating_instagram');
// QE.multiExport.updateProgress(2, 5, 'multi_export.creating_facebook');


// ======================= ПРИМЕР 8: ПРИМЕНЕНИЕ ОБРЕЗКИ =======================

// ❌ БЫЛО:
QE.applyCrop = function() {
    // ... код обрезки ...

    QE.showSuccess('✅ Обрезка применена успешно. Позиции текста и стикеров пересчитаны.');
};

// ✅ СТАЛО:
QE.applyCrop = function() {
    // ... код обрезки ...

    QE.showSuccess('messages.success_crop_applied');
};


// ======================= ПРИМЕР 9: СБРОС ТЕКСТА =======================

// ❌ БЫЛО:
QE.repositionText = function() {
    // ... код сброса ...
    QE.showSuccess('✅ Позиции текста сброшены к значениям по умолчанию');
};

// ✅ СТАЛО:
QE.repositionText = function() {
    // ... код сброса ...
    QE.showSuccess('messages.success_text_reset');
};


// ======================= ПРИМЕР 10: СТИКЕРЫ =======================

// ❌ БЫЛО:
QE.addSticker = function(url, initialW = 100, initialH = 100) {
    const img = new Image();
    img.onload = function() {
        // ... добавление стикера ...
        QE.showSuccess('✅ Стикер добавлен!');
    };
    img.onerror = () => QE.showErr('❌ Не удалось загрузить стикер.');
    img.src = url;
};

QE.clearAllStickers = function() {
    if (confirm('Вы уверены, что хотите удалить все стикеры?')) {
        QE.state.stickers = [];
        QE.showSuccess('✅ Все стикеры удалены');
    }
};

// ✅ СТАЛО:
QE.addSticker = function(url, initialW = 100, initialH = 100) {
    const img = new Image();
    img.onload = function() {
        // ... добавление стикера ...
        QE.showSuccess('messages.success_sticker_added');
    };
    img.onerror = () => QE.showErr('messages.error_sticker_load');
    img.src = url;
};

QE.clearAllStickers = function() {
    const confirmMsg = i18n.t('messages.confirm_delete_stickers');
    if (confirm(confirmMsg)) {
        QE.state.stickers = [];
        QE.showSuccess('messages.success_stickers_cleared');
    }
};


// ======================= ПРИМЕР 11: ДИНАМИЧЕСКОЕ СОЗДАНИЕ ЭЛЕМЕНТОВ =======================

// ❌ БЫЛО:
QE.displayMovieResults = function(results) {
    const resultsContainer = QE.get('apiMovieResults');
    resultsContainer.innerHTML = '';

    if (validResults.length === 0) {
        resultsContainer.innerHTML = '<p>Ничего не найдено.</p>';
        return;
    }

    validResults.forEach(result => {
        const item = document.createElement('div');
        const type = result.media_type === 'movie' ? 'Фильм' : 'Сериал';
        item.innerHTML = `<strong>${result.title}</strong> <p>${type}</p>`;
        resultsContainer.appendChild(item);
    });
};

// ✅ СТАЛО (Метод 1: data-i18n с applyTranslations):
QE.displayMovieResults = function(results) {
    const resultsContainer = QE.get('apiMovieResults');
    resultsContainer.innerHTML = '';

    if (validResults.length === 0) {
        resultsContainer.innerHTML = '<p data-i18n="search.no_results">Ничего не найдено.</p>';
        i18n.applyTranslations(); // ВАЖНО!
        return;
    }

    validResults.forEach(result => {
        const item = document.createElement('div');
        const typeKey = result.media_type === 'movie' ? 'media_types.movie' : 'media_types.series';
        item.innerHTML = `
            <strong>${result.title}</strong>
            <p data-i18n="${typeKey}">${result.media_type === 'movie' ? 'Фильм' : 'Сериал'}</p>
        `;
        resultsContainer.appendChild(item);
    });

    i18n.applyTranslations(); // ВАЖНО!
};

// ✅ СТАЛО (Метод 2: i18n.t() напрямую - предпочтительнее):
QE.displayMovieResults = function(results) {
    const resultsContainer = QE.get('apiMovieResults');
    resultsContainer.innerHTML = '';

    if (validResults.length === 0) {
        resultsContainer.innerHTML = `<p>${i18n.t('search.no_results')}</p>`;
        return;
    }

    validResults.forEach(result => {
        const item = document.createElement('div');
        const typeKey = result.media_type === 'movie' ? 'media_types.movie' : 'media_types.series';
        const typeText = i18n.t(typeKey);
        item.innerHTML = `<strong>${result.title}</strong> <p>${typeText}</p>`;
        resultsContainer.appendChild(item);
    });
};


// ======================= ПРИМЕР 12: ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =======================

// Если нужно обновить placeholder при переключении вкладок:

document.getElementById('tabMovies').addEventListener('click', function() {
    const searchInput = document.getElementById('apiSearchQuery');
    searchInput.setAttribute('data-i18n-placeholder', 'search.placeholder_movie');
    i18n.applyTranslations(); // Применяет новый placeholder
});

document.getElementById('tabMusic').addEventListener('click', function() {
    const searchInput = document.getElementById('apiSearchQuery');
    searchInput.setAttribute('data-i18n-placeholder', 'search.placeholder_music');
    i18n.applyTranslations();
});


// ======================= ПРИМЕР 13: ОБРАБОТЧИК СМЕНЫ ЯЗЫКА =======================

// Добавьте в DOMContentLoaded:
document.addEventListener('languageChanged', function(e) {
    console.log('Язык изменен на:', e.detail.language);

    // 1. Перегенерировать холст/изображение
    if (typeof QE !== 'undefined' && QE.genImg) {
        QE.genImg();
    }

    // 2. Обновить динамический контент
    if (QE.currentSearchResults && QE.currentSearchResults.length > 0) {
        QE.displayMovieResults(QE.currentSearchResults);
    }

    // 3. Обновить теги
    if (typeof renderPexelsTags === 'function') {
        renderPexelsTags();
    }

    // 4. Обновить текст кнопок (если они были изменены динамически)
    const btn = QE.get('randomQuoteBtn');
    if (btn && !btn.disabled) {
        btn.textContent = i18n.t('buttons.generate_ai');
    }
});


// ======================= ПРИМЕР 14: ВАЛИДАЦИЯ =======================

// ❌ БЫЛО:
function validateForm() {
    if (!txtQuote.value.trim()) {
        QE.showErr('Введите текст цитаты');
        return false;
    }
    if (!writer.value.trim()) {
        QE.showErr('Заполните поле Автор');
        return false;
    }
    if (!QE.state.bgImg) {
        QE.showErr('Выберите фоновое изображение');
        return false;
    }
    return true;
}

// ✅ СТАЛО:
function validateForm() {
    if (!txtQuote.value.trim()) {
        QE.showErr('messages.error_no_quote');
        return false;
    }
    if (!writer.value.trim()) {
        QE.showErr('messages.error_no_author');
        return false;
    }
    if (!QE.state.bgImg) {
        QE.showErr('messages.error_no_image');
        return false;
    }
    return true;
}


// ======================= ПРИМЕР 15: КЭШИРОВАНИЕ ПЕРЕВОДОВ (ОПТИМИЗАЦИЯ) =======================

// Для часто используемых сообщений можно кэшировать переводы:

const TRANSLATION_CACHE = {
    loading: null,
    noResults: null,
    error: null
};

function initTranslationCache() {
    TRANSLATION_CACHE.loading = i18n.t('search.loading');
    TRANSLATION_CACHE.noResults = i18n.t('search.no_results');
    TRANSLATION_CACHE.error = i18n.t('messages.error_loading');
}

// Вызвать при загрузке страницы:
document.addEventListener('DOMContentLoaded', initTranslationCache);

// Обновить при смене языка:
document.addEventListener('languageChanged', initTranslationCache);

// Использование:
function showLoading() {
    statusDiv.textContent = TRANSLATION_CACHE.loading; // Быстрее, чем i18n.t()
}


// =========================================================================
// ВАЖНЫЕ ЗАМЕЧАНИЯ
// =========================================================================

/*
1. ВСЕГДА используйте i18n.applyTranslations() после динамического создания HTML
2. Для кнопок с изменяющимся текстом храните оригинальный текст и восстанавливайте через i18n.t()
3. При использовании шаблонных строк с переменными используйте .replace():
   i18n.t('key').replace('{var}', value)
4. Для confirm/alert также используйте i18n.t():
   if (confirm(i18n.t('messages.confirm_delete'))) { ... }
5. Проверяйте наличие i18n перед использованием:
   const message = window.i18n ? i18n.t('key') : 'fallback';
*/
