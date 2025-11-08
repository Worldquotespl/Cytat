/**
 * Shadow DOM Adapter для Quote Editor
 * Обеспечивает изоляцию стилей и DOM от остальной страницы
 */

class ShadowDOMAdapter {
    constructor() {
        this.shadowRoot = null;
        this.initialized = false;
    }

    /**
     * Инициализация Shadow DOM
     * @param {string} containerId - ID элемента-контейнера
     * @returns {ShadowRoot}
     */
    init(containerId) {
        const container = document.getElementById(containerId);

        if (!container) {
            throw new Error(`Container #${containerId} not found`);
        }

        this.shadowRoot = container.attachShadow({ mode: 'open' });
        this.initialized = true;

        console.log('✅ Shadow DOM initialized');
        return this.shadowRoot;
    }

    /**
     * Аналог document.getElementById для Shadow DOM
     */
    getElementById(id) {
        if (!this.initialized) {
            throw new Error('ShadowDOMAdapter not initialized');
        }
        return this.shadowRoot.getElementById(id);
    }

    /**
     * Аналог document.querySelector для Shadow DOM
     */
    querySelector(selector) {
        if (!this.initialized) {
            throw new Error('ShadowDOMAdapter not initialized');
        }
        return this.shadowRoot.querySelector(selector);
    }

    /**
     * Аналог document.querySelectorAll для Shadow DOM
     */
    querySelectorAll(selector) {
        if (!this.initialized) {
            throw new Error('ShadowDOMAdapter not initialized');
        }
        return this.shadowRoot.querySelectorAll(selector);
    }

    /**
     * Вставка HTML в Shadow DOM
     */
    setHTML(html) {
        if (!this.initialized) {
            throw new Error('ShadowDOMAdapter not initialized');
        }
        this.shadowRoot.innerHTML = html;
    }

    /**
     * Добавление стилей в Shadow DOM
     */
    addStyles(cssText) {
        if (!this.initialized) {
            throw new Error('ShadowDOMAdapter not initialized');
        }

        const style = document.createElement('style');
        style.textContent = cssText;
        this.shadowRoot.appendChild(style);
    }

    /**
     * Загрузка внешнего CSS файла
     */
    async loadExternalCSS(url) {
        const response = await fetch(url);
        const cssText = await response.text();
        this.addStyles(cssText);
    }

    /**
     * Получение корневого элемента Shadow DOM
     */
    getRoot() {
        return this.shadowRoot;
    }
}

// Экспортируем синглтон
window.ShadowAdapter = new ShadowDOMAdapter();
