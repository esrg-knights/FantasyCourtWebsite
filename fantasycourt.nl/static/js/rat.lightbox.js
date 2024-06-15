/*!
|  @rat.md/bs-lightbox - A simple Bootstrap 4 and Bootstrap 5 Lightbox system using the native Carousel and Modal components.
|  @file       dist/js/rat.lightbox.js
|  @version    1.1.0
|  @author     Sam <sam@rat.md> (https://rat.md)
|
|  @website    https://github.com/RatMD/bs-lightbox
|  @license    MIT License
|  @copyright  Copyright © 2021 - 2023 rat.md <info@rat.md>
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('rat.Lightbox', factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.rat = global.rat || {}, global.rat.Lightbox = factory()));
})(this, (function () {
    "use strict";

    class Lightbox {
        static get NAME() {
            return 'lightbox';
        }
        static get VERSION() {
            return '1.1.0';
        }
        static get DEFAULTS() {
            return {
                carousel: {
                    id: null,
                    controls: true,
                    indicators: false,
                    interval: 5000,
                    keyboard: true,
                    pause: 'hover',
                    ride: false,
                    touch: true,
                    wrap: true,
                    // FC change start
                    classes: "carousel-fade",
                    // end
                },
                lightbox: {
                    loader: false,
                    replacePictures: false
                },
                modal: {
                    id: null,
                    backdrop: true,
                    focus: true,
                    keyboard: true,
                    size: 'xl'
                }
            };
        }
        static get $() {
            let jquery = Lightbox._jquery || window['$'] || window['jQuery'];
            if (!jquery) {
                throw new Error('No jQuery object found, please use Lightbox.$ = <jQuery>.');
            }
            return jquery;
        }
        static set $(jQuery) {
            Lightbox._jquery = jQuery;
        }
        static get CAROUSEL() {
            let carousel = Lightbox._carousel || (window['bootstrap'] || window['Bootstrap'] || {}).Carousel;
            if (!carousel) {
                throw new Error('No Bootstrap Carousel prototype found, please use Lightbox.CAROUSEL = <Bootstrap.Carousel>.');
            }
            return carousel;
        }
        static set CAROUSEL(object) {
            Lightbox._carousel = object;
        }
        static get MODAL() {
            let modal = Lightbox._modal || (window['bootstrap'] || window['Bootstrap'] || {}).Modal;
            if (!modal) {
                throw new Error('No Bootstrap Modal prototype found, please use Lightbox.MODAL = <Bootstrap.Modal>.');
            }
            return modal;
        }
        static set MODAL(object) {
            Lightbox._modal = object;
        }
        static get SELECTOR() {
            return '[data-toggle="lightbox"],' +
                '[data-bs-toggle="lightbox"],' +
                '[data-rat-lightbox]';
        }
        static invoke(selector = null, config = {}) {
            selector = typeof selector !== 'string' ? this.SELECTOR : selector;
            return Array.from(document.querySelectorAll(selector), (el) => {
                return this.getOrCreateInstance(el, config);
            });
        }
        static hasInstance(source) {
            if (typeof source === 'string') {
                return this.instances.has(source);
            }
            else {
                let key = source.hasAttribute('data-bs-gallery') ? source.dataset.bsGallery : source;
                return this.instances.has(key);
            }
        }
        static getInstance(source) {
            if (typeof source === 'string') {
                return this.instances.has(source) ? this.instances.get(source) : null;
            }
            else {
                let key = source.dataset.bsGallery || source.dataset.gallery || source;
                return this.instances.has(key) ? this.instances.get(key) : null;
            }
        }
        static getOrCreateInstance(element, config = {}) {
            let instance = this.getInstance(element);
            if (instance === null) {
                instance = new this(element, config);
            }
            else {
                instance.append(element);
            }
            return instance;
        }
        constructor(element, config = {}) {
            this.items = new Map;
            this.events = new Map;
            let key = element.dataset.bsGallery || element.dataset.gallery || element;
            if (Lightbox.instances.has(key)) {
                throw new Error('An instance with the passed element or gallery has already been created.');
            }
            Lightbox.instances.set(key, this);
            this.legacy = Lightbox.CAROUSEL.VERSION[0] === '4';
            let defaults = Lightbox.DEFAULTS;
            this.config = {
                carousel: Object.assign({}, defaults.carousel, config.carousel || {}),
                lightbox: Object.assign({}, defaults.lightbox, config.lightbox || {}),
                modal: Object.assign({}, defaults.modal, config.modal || {})
            };
            this.append(element);
            this.onKeyUpListener = this._onKeyUp.bind(this);
        }
        _onKeyUp(event) {
            if (event.key === 'ArrowRight') {
                this.next();
            }
            else if (event.key === 'ArrowLeft') {
                this.prev();
            }
        }
        _createLightbox() {
            let controls = '';
            if (this.config.carousel.controls && this.items.size > 1) {
                controls = `
                <button class="carousel-control-prev" type="button" data-${this.legacy ? '' : 'bs-'}target="#${this.config.carousel.id || 'lightboxCarousel'}" data-${this.legacy ? '' : 'bs-'}slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="${this.legacy ? 'sr-only' : 'visually-hidden'}">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-${this.legacy ? '' : 'bs-'}target="#${this.config.carousel.id || 'lightboxCarousel'}" data-${this.legacy ? '' : 'bs-'}slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="${this.legacy ? 'sr-only' : 'visually-hidden'}">Next</span>
                </button>
            `;
            }
            let indicators = '';
            if (this.config.carousel.indicators && this.items.size > 1) {
                indicators = `
                <div class="carousel-indicators">
                    ${[...Array(this.items.size)].map((_, idx) => {
                return `<button type="button" data-${this.legacy ? '' : 'bs-'}target="#${this.config.carousel.id || 'lightboxCarousel'}" data-${this.legacy ? '' : 'bs-'}slide-to="${idx}" class="${idx === 0 ? 'active' : ''}" aria-current="${idx === 0 ? 'true' : 'false'}"></button>`;
            }).join('\n')}
                </div>
            `;
            }
            let lightbox = document.createElement('DIV');
            lightbox.className = 'modal modal-lightbox fade';
            lightbox.tabIndex = -1;
            lightbox.innerHTML = `
            <div id="${this.config.modal.id || 'lightboxModal'}" class="modal-dialog${this.config.modal.size !== null ? (' modal-' + this.config.modal.size) : ' '} modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body p-0">
                        <div id="${this.config.carousel.id || 'lightboxCarousel'}" class="carousel ${this.config.carousel.classes } slide">
                            ${indicators}

                            <div class="carousel-inner">
                                ${Array.from(this.items.values()).map((item, idx) => {
            let source = item.image instanceof HTMLImageElement ? item.image.src : item.image.querySelector('img').src;
            return `
                                        <div class="carousel-item${idx === 0 ? ' active' : ''}">
                                            ${this.config.lightbox.loader ? `
                                                <div class="${this.legacy ? 'embed-responsive embed-responsive-16by9' : 'ratio ratio-16x9'}" data-img-src="${source}">
                                                    <div class="d-flex justify-content-center align-items-center embed-responsive-item">
                                                        <div class="spinner-border" role="status">
                                                            <span class="${this.legacy ? 'sr-only' : 'visually-hidden'}">Loading...</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ` : `
                                                ${item.image.outerHTML}
                                            `}

                                            ${item.caption || item.title || item.copyright ? `
                                                <div class="carousel-caption d-block">
                                                    ${item.title ? `<div class="h5">${item.title}</div>` : ''}
                                                    ${item.caption ? `<p>${item.caption}</p>` : ''}
                                                    ${item.copyright ? `<p><small>© ${item.copyright}</small></p>` : ''}
                                                </div>
                                            ` : ''}
                                        </div>
                                    `;
        }).join('\n')}
                            </div>

                            ${controls}
                        </div>
                    </div>
                </div>
            </div>
        `;
            this.lightbox = lightbox;
        }
        _createModal() {
            if (this.lightbox === null) {
                return;
            }
            if (this.legacy) {
                let config = Object.assign({}, this.config.modal, { show: false });
                this.modal = Lightbox.$(this.lightbox).modal(config);
            }
            else {
                this.modal = Lightbox.MODAL.getOrCreateInstance(this.lightbox, this.config.modal);
            }
        }
        _createCarousel() {
            if (this.lightbox === null) {
                return;
            }
            if (this.legacy) {
                let config = Object.assign({}, this.config.carousel);
                if (!config.ride) {
                    config.interval = false;
                }
                this.carousel = Lightbox.$(this.lightbox.querySelector('.carousel')).carousel(config);
            }
            else {
                this.carousel = Lightbox.CAROUSEL.getOrCreateInstance(this.lightbox.querySelector('.carousel'), this.config.carousel);
            }
        }
        dispose() {
            document.removeEventListener('keyup', this.onKeyUpListener);
            if (this.carousel) {
                if (this.legacy) {
                    this.carousel.carousel('dispose');
                }
                else {
                    this.carousel.dispose();
                }
                this.carousel = null;
            }
            if (this.modal) {
                if (this.legacy) {
                    this.modal.modal('dispose');
                }
                else {
                    this.modal.dispose();
                }
                this.modal = null;
            }
            if (this.lightbox && this.lightbox.parentElement) {
                this.lightbox.remove();
            }
            this.lightbox = null;
            return this;
        }
        _getImage(source) {
            if (source instanceof HTMLImageElement || source instanceof HTMLPictureElement) {
                return source;
            }
            else {
                let temp = source.querySelector('picture,img');
                return temp;
            }
        }
        _getTitle(source, image) {
            let title = source.dataset.bsTitle || source.dataset.title || source.title || null;
            if (!title && source !== image) {
                title = image.dataset.bsTitle || image.dataset.title || null;
            }
            return title;
        }
        _getCaption(source, image) {
            if (source.tagName.toUpperCase() === 'FIGURE') {
                let temp = source.querySelector('FIGCAPTION');
                if (temp && temp.innerText.trim().length > 0) {
                    return temp.innerText.trim();
                }
            }
            else {
                let caption = source.dataset.bsCaption || source.dataset.caption || null;
                if (!caption) {
                    caption = image.dataset.bsCaption || image.dataset.caption || null;
                }
                return caption;
            }
        }
        // FC start
        _getCopyright(source, image) {
            let copyright = source.dataset.bsCopyright || source.dataset.copyright || source.copyright || null;
            if (!copyright && source !== image) {
                copyright = image.dataset.bsCopyright || image.dataset.copyright || null;
            }
            return copyright;
        }
        // FC end
        append(source) {
            if (this.items.has(source)) {
                return this;
            }
            let original = this._getImage(source);
            if (original === null) {
                throw new Error(`The passed element is not nor contains a supported image source. Element HTML: ${source.outerHTML}.`);
            }
            let image = original.cloneNode(true);
            // FC start
            image.style = ""
            // FC end
            image.className = 'w-100';
            if (source instanceof HTMLAnchorElement && source.href.length > 0) {
                if (image instanceof HTMLImageElement) {
                    image.src = source.href;
                }
                else if (image instanceof HTMLPictureElement && this.config.lightbox.replacePictures) {
                    image.querySelector('img').src = source.href;
                    Array.from(image.querySelectorAll('source'), (e) => e.remove());
                }
            }
            this.items.set(source, {
                source,
                image,
                title: this._getTitle(source, image),
                caption: this._getCaption(source, image),
                // FC start
                copyright: this._getCopyright(source, image),
                // FC end
            });
            source.setAttribute(this.legacy ? 'data-slide-to' : 'data-bs-slide-to', (this.items.size - 1).toString());
            source.addEventListener('click', (ev) => {
                ev.preventDefault();
                this.show(source);
            });
            return this;
        }
        toggle() {
            if (this.lightbox) {
                return this.hide();
            }
            else {
                return this.show();
            }
        }
        show(source = null) {
            if (this.lightbox) {
                return this;
            }
            this._createLightbox();
            this._createModal();
            this._createCarousel();
            if (this.legacy) {
                let events = [
                    'slid.bs.carousel', 'slide.bs.carousel', 'hide.bs.modal', 'hidden.bs.modal', 'hidePrevented.bs.modal', 'show.bs.modal', 'shown.bs.modal'
                ];
                for (let id of events) {
                    (id.endsWith('modal') ? this.modal : this.carousel).on(id, (ev) => {
                        (id.endsWith('modal') ? this.lightbox : this.lightbox.querySelector('.carousel')).dispatchEvent(new Event(id, {
                            bubbles: ev.bubbles,
                            cancelable: ev.cancelable,
                            composed: ev.composed
                        }));
                    });
                }
            }
            if (source instanceof HTMLElement && (source.dataset.bsSlideTo || source.dataset.slideTo)) {
                this.lightbox.addEventListener('show.bs.modal', (ev) => {
                    let number = parseInt(source.dataset.bsSlideTo || source.dataset.slideTo, 10);
                    if (this.legacy) {
                        this.carousel.carousel(number);
                    }
                    else {
                        this.carousel.to(number);
                    }
                });
            }
            if (this.config.lightbox.loader) {
                this.lightbox.addEventListener('show.bs.modal', (ev) => {
                    Array.from(this.lightbox.querySelectorAll('[data-img-src]'), (el) => {
                        let image = document.createElement('IMG');
                        image.className = 'w-100';
                        image.onload = (ev) => {
                            el.replaceWith(image);
                        };
                        image.src = el.dataset.imgSrc;
                    });
                });
            }
            let carousel = this.lightbox.querySelector('.carousel');
            for (let [event, set] of this.events.entries()) {
                if (event.endsWith('modal')) {
                    set.forEach(c => this.lightbox.addEventListener(event, c));
                }
                if (event.endsWith('carousel')) {
                    set.forEach(c => carousel.addEventListener(event, c));
                }
            }
            if (this.config.carousel.keyboard) {
                document.addEventListener('keyup', this.onKeyUpListener);
            }
            this.lightbox.addEventListener('hidden.bs.modal', this.dispose.bind(this));
            if (this.legacy) {
                this.modal.modal('show');
            }
            else {
                this.modal.show();
            }
            return this;
        }
        hide() {
            if (this.modal) {
                if (this.legacy) {
                    this.modal.modal('hide');
                }
                else {
                    this.modal.hide();
                }
            }
            return this;
        }
        cycle() {
            if (this.carousel) {
                if (this.legacy) {
                    this.carousel.carousel('cycle');
                }
                else {
                    this.carousel.cycle();
                }
            }
            return this;
        }
        next() {
            if (this.carousel) {
                if (this.legacy) {
                    this.carousel.carousel('next');
                }
                else {
                    this.carousel.next();
                }
            }
            return this;
        }
        prev() {
            if (this.carousel) {
                if (this.legacy) {
                    this.carousel.carousel('prev');
                }
                else {
                    this.carousel.prev();
                }
            }
            return this;
        }
        to(direction) {
            if (!this.carousel) {
                return this;
            }
            if (direction === 'prev' || direction === 'previous') {
                this.prev();
            }
            else if (direction === 'next') {
                this.next();
            }
            else {
                if (this.legacy) {
                    this.carousel.carousel(direction);
                }
                else {
                    this.carousel.to(direction);
                }
            }
            return this;
        }
        on(event, caller) {
            if (!this.events.has(event)) {
                this.events.set(event, new Set);
            }
            this.events.get(event).add(caller);
            return this;
        }
        off(event, caller) {
            if (this.events.has(event)) {
                this.events.get(event).delete(caller);
            }
            if (this.lightbox && event.endsWith('modal')) {
                this.lightbox.removeEventListener(event, caller);
            }
            if (this.lightbox && event.endsWith('carousel')) {
                this.lightbox.querySelector('.carousel').removeEventListener(event, caller);
            }
            return this;
        }
    }
    Lightbox._jquery = null;
    Lightbox._carousel = null;
    Lightbox._modal = null;
    Lightbox.instances = new Map;

    return Lightbox;

}));
// FC start
//# XXX-sourceMappingURL=rat.lightbox.js.map
// FC end
