/**
 * Quote Editor Wrapper - изолированная версия
 * Обеспечивает инкапсуляцию приложения через Shadow DOM
 */

class QuoteEditorIsolated {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            stylesPath: options.stylesPath || './css/quote-editor.css',
            templatePath: options.templatePath || './templates/quote-editor.html',
            autoInit: options.autoInit !== false,
            ...options
        };

        this.shadowRoot = null;
        this.QE = null; // Главный объект приложения

        if (this.options.autoInit) {
            this.init();
        }
    }

    /**
     * Инициализация приложения
     */
    async init() {
        try {
            console.log('🚀 Initializing Quote Editor (isolated)...');

            // 1. Создаем Shadow DOM
            this.createShadowDOM();

            // 2. Загружаем стили
            await this.loadStyles();

            // 3. Загружаем HTML шаблон
            await this.loadTemplate();

            // 4. Инициализируем приложение
            this.initQuoteEditor();

            console.log('✅ Quote Editor initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Quote Editor:', error);
            throw error;
        }
    }

    /**
     * Создание Shadow DOM
     */
    createShadowDOM() {
        const container = document.getElementById(this.containerId);

        if (!container) {
            throw new Error(`Container #${this.containerId} not found`);
        }

        this.shadowRoot = container.attachShadow({ mode: 'open' });
    }

    /**
     * Загрузка стилей
     */
    async loadStyles() {
        if (this.options.inlineStyles) {
            // Если стили встроенные
            this.addStyles(this.options.inlineStyles);
        } else {
            // Загружаем из файла
            const response = await fetch(this.options.stylesPath);
            const cssText = await response.text();
            this.addStyles(cssText);
        }
    }

    /**
     * Добавление стилей в Shadow DOM
     */
    addStyles(cssText) {
        const style = document.createElement('style');
        style.textContent = cssText;
        this.shadowRoot.appendChild(style);
    }

    /**
     * Загрузка HTML шаблона
     */
    async loadTemplate() {
        if (this.options.inlineTemplate) {
            // Если HTML встроенный
            const wrapper = document.createElement('div');
            wrapper.innerHTML = this.options.inlineTemplate;
            this.shadowRoot.appendChild(wrapper);
        } else {
            // Загружаем из файла
            const response = await fetch(this.options.templatePath);
            const html = await response.text();
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            this.shadowRoot.appendChild(wrapper);
        }
    }

    /**
     * Инициализация Quote Editor приложения
     */
    initQuoteEditor() {
        // Создаем адаптированную версию QE для Shadow DOM
        this.QE = this.createQEInstance();

        // Инициализируем приложение
        this.QE.init();

        // Экспортируем в window для внешнего доступа
        window.QuoteEditorInstance = this;
    }

    /**
     * Создание экземпляра QE с адаптацией под Shadow DOM
     */
    createQEInstance() {
        const shadowRoot = this.shadowRoot;

        // Объект QE (Quote Editor)
        const QE = {};

        // Адаптированные селекторы для Shadow DOM
        QE.get = (id) => shadowRoot.getElementById(id);
        QE.qs = (selector) => shadowRoot.querySelector(selector);
        QE.qsAll = (selector) => shadowRoot.querySelectorAll(selector);

        // Состояние приложения
        QE.state = {
            bgImg: null,
            origBgImg: null,
            isDragging: false,
            isResizing: false,
            draggedEl: null,
            dragOffset: { x: 0, y: 0 },
            resizeDir: null,
            startCoords: { x: 0, y: 0 },
            activeBgTab: 'color',
            selectedGradient: null,
            genImgTimeout: null,
            animFrameId: null,
            intMode: false,
            isAutoScale: true,
            isLayoutFixed: false,
            txtBox: {
                x: 200,
                y: 200,
                width: 400,
                height: 200
            },
            cropMode: false,
            isSelectingCrop: false,
            cropSel: {
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0,
                active: false
            },
            cropBox: {
                x: 0,
                y: 0,
                width: 800,
                height: 600
            },
            imgTransform: {
                zoom: 1,
                rotation: 0,
                flipH: false,
                flipV: false,
                offsetX: 0,
                offsetY: 0
            },
            isDraggingCrop: false,
            isResizingCrop: false,
            cropResizeHandle: null,
            currentAspectRatio: 'free',
            aspectRatioLocked: false,
            compMode: false,
            compSet: {
                type: 'percent',
                percent: 100,
                maxWidth: 800,
                maxHeight: 600,
                originalWidth: 0,
                originalHeight: 0
            },
            txtPos: {
                quote: { x: null, y: null },
                writer: { x: null, y: null },
                source: { x: null, y: null },
                date: { x: null, y: null }
            },
            txtAreas: {
                quote: { x: 0, y: 0, width: 0, height: 0 },
                writer: { x: 0, y: 0, width: 0, height: 0 },
                source: { x: 0, y: 0, width: 0, height: 0 },
                date: { x: 0, y: 0, width: 0, height: 0 }
            },
            txtFmt: {
                bold: false,
                italic: false,
                fontFamily: 'Georgia',
                fontSize: 40,
                rotation: 0
            },
            editingTouchStartHandler: null,
            editingTouchMoveHandler: null,
            mobileDragTarget: null,
            filtersEnabled: false,
            stickers: [],
            selectedStickerId: null,
            isResizingSticker: false,
            stickerGallery: {
                currentPage: 1,
                totalPages: 1,
                currentCategory: 'all',
                currentSearch: ''
            },
            disableMobileDragBlock: false
        };

        // Фильтры
        QE.filters = {
            brightness: 100,
            contrast: 100,
            blur: 0,
            saturation: 100,

            apply: function(ctx, canvas) {
                ctx.filter = `brightness(${this.brightness}%) contrast(${this.contrast}%) blur(${this.blur}px) saturate(${this.saturation}%)`;
            }
        };

        // Метод инициализации
        QE.init = function() {
            console.log('🎨 Initializing Quote Editor core...');

            // Здесь будет вся логика инициализации из вашего DOMContentLoaded
            // Пока заглушка
            const canvas = QE.get('qcanvas');
            if (canvas) {
                console.log('✅ Canvas found:', canvas.width, 'x', canvas.height);
            } else {
                console.error('❌ Canvas not found');
            }

            // TODO: Добавить всю логику инициализации
        };

        return QE;
    }

    /**
     * Получить экземпляр QE для внешнего использования
     */
    getQE() {
        return this.QE;
    }

    /**
     * Получить Shadow Root
     */
    getShadowRoot() {
        return this.shadowRoot;
    }
}

// Экспортируем класс
window.QuoteEditorIsolated = QuoteEditorIsolated;
