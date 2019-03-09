import { Component, ElementRef, EventEmitter, HostListener, Input, NgModule, Output } from '@angular/core';
/**
 * @param {?} pdfJsViewer
 * @return {?}
 */
function _createEventBus(pdfJsViewer) {
    var /** @type {?} */ globalEventBus = new pdfJsViewer.EventBus(true);
    attachDOMEventsToEventBus(globalEventBus);
    return globalEventBus;
}
/**
 * @param {?} eventBus
 * @return {?}
 */
function attachDOMEventsToEventBus(eventBus) {
    eventBus.on('documentload', function () {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('documentload', true, true, {});
        window.dispatchEvent(event);
    });
    eventBus.on('pagerendered', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('pagerendered', true, true, {
            pageNumber: evt.pageNumber,
            cssTransform: evt.cssTransform
        });
        evt.source.div.dispatchEvent(event);
    });
    eventBus.on('textlayerrendered', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('textlayerrendered', true, true, {
            pageNumber: evt.pageNumber
        });
        evt.source.textLayerDiv.dispatchEvent(event);
    });
    eventBus.on('pagechange', function (evt) {
        var /** @type {?} */ event = document.createEvent('UIEvents');
        event.initUIEvent('pagechange', true, true, window, 0);
        event['pageNumber'] = evt.pageNumber;
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('pagesinit', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('pagesinit', true, true, null);
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('pagesloaded', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('pagesloaded', true, true, {
            pagesCount: evt.pagesCount
        });
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('scalechange', function (evt) {
        var /** @type {?} */ event = document.createEvent('UIEvents');
        event.initUIEvent('scalechange', true, true, window, 0);
        event['scale'] = evt.scale;
        event['presetValue'] = evt.presetValue;
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('updateviewarea', function (evt) {
        var /** @type {?} */ event = document.createEvent('UIEvents');
        event.initUIEvent('updateviewarea', true, true, window, 0);
        event['location'] = evt.location;
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('find', function (evt) {
        if (evt.source === window) {
            return; // event comes from FirefoxCom, no need to replicate
        }
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('find' + evt.type, true, true, {
            query: evt.query,
            phraseSearch: evt.phraseSearch,
            caseSensitive: evt.caseSensitive,
            highlightAll: evt.highlightAll,
            findPrevious: evt.findPrevious
        });
        window.dispatchEvent(event);
    });
    eventBus.on('attachmentsloaded', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('attachmentsloaded', true, true, {
            attachmentsCount: evt.attachmentsCount
        });
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('sidebarviewchanged', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('sidebarviewchanged', true, true, {
            view: evt.view
        });
        evt.source.outerContainer.dispatchEvent(event);
    });
    eventBus.on('pagemode', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('pagemode', true, true, {
            mode: evt.mode
        });
        evt.source.pdfViewer.container.dispatchEvent(event);
    });
    eventBus.on('namedaction', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('namedaction', true, true, {
            action: evt.action
        });
        evt.source.pdfViewer.container.dispatchEvent(event);
    });
    eventBus.on('presentationmodechanged', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('presentationmodechanged', true, true, {
            active: evt.active,
            switchInProgress: evt.switchInProgress
        });
        window.dispatchEvent(event);
    });
    eventBus.on('outlineloaded', function (evt) {
        var /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('outlineloaded', true, true, {
            outlineCount: evt.outlineCount
        });
        evt.source.container.dispatchEvent(event);
    });
}
var createEventBus = _createEventBus;
/**
 * Created by vadimdez on 21/06/16.
 */
var PDFJS;
var PDFJSViewer;
/**
 * @return {?}
 */
function isSSR() {
    return typeof window === 'undefined';
}
if (!isSSR()) {
    PDFJS = require('pdfjs-dist/build/pdf');
    PDFJSViewer = require('pdfjs-dist/web/pdf_viewer');
    PDFJS.verbosity = PDFJS.VerbosityLevel.ERRORS;
}
var RenderTextMode = {};
RenderTextMode.DISABLED = 0;
RenderTextMode.ENABLED = 1;
RenderTextMode.ENHANCED = 2;
RenderTextMode[RenderTextMode.DISABLED] = "DISABLED";
RenderTextMode[RenderTextMode.ENABLED] = "ENABLED";
RenderTextMode[RenderTextMode.ENHANCED] = "ENHANCED";
var PdfViewerComponent = /** @class */ (function () {
    /**
     * @param {?} element
     */
    function PdfViewerComponent(element) {
        this.element = element;
        this._cMapsUrl = typeof PDFJS !== 'undefined' ? "https://unpkg.com/pdfjs-dist@" + ((PDFJS)).version + "/cmaps/" : null;
        this._renderText = true;
        this._renderTextMode = RenderTextMode.ENABLED;
        this._stickToPage = false;
        this._originalSize = true;
        this._page = 1;
        this._zoom = 1;
        this._rotation = 0;
        this._showAll = true;
        this._canAutoResize = true;
        this._fitToPage = false;
        this._externalLinkTarget = 'blank';
        this.afterLoadComplete = new EventEmitter();
        this.pageRendered = new EventEmitter();
        this.textLayerRendered = new EventEmitter();
        this.onError = new EventEmitter();
        this.onProgress = new EventEmitter();
        this.pageChange = new EventEmitter(true);
        if (isSSR()) {
            return;
        }
        var pdfWorkerSrc;
        if (window.hasOwnProperty('pdfWorkerSrc') && typeof window.pdfWorkerSrc === 'string' && window.pdfWorkerSrc) {
            pdfWorkerSrc = window.pdfWorkerSrc;
        }
        else {
            pdfWorkerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + PDFJS.version + "/pdf.worker.min.js";
        }
        PDFJS.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
    }
    Object.defineProperty(PdfViewerComponent.prototype, "cMapsUrl", {
        /**
         * @param {?} cMapsUrl
         * @return {?}
         */
        set: function (cMapsUrl) {
            this._cMapsUrl = cMapsUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "page", {
        /**
         * @param {?} _page
         * @return {?}
         */
        set: function (_page) {
            _page = parseInt(_page, 10) || 1;
            if (this._pdf) {
                _page = this.getValidPageNumber(_page);
            }
            this._page = _page;
            this.pageChange.emit(_page);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "renderText", {
        /**
         * @param {?} renderText
         * @return {?}
         */
        set: function (renderText) {
            this._renderText = renderText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "renderTextMode", {
        /**
         * @param {?} renderTextMode
         * @return {?}
         */
        set: function (renderTextMode) {
            this._renderTextMode = renderTextMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "originalSize", {
        /**
         * @param {?} originalSize
         * @return {?}
         */
        set: function (originalSize) {
            this._originalSize = originalSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "showAll", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._showAll = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "stickToPage", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._stickToPage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "zoom", {
        /**
         * @return {?}
         */
        get: function () {
            return this._zoom;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (value <= 0) {
                return;
            }
            this._zoom = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "rotation", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (!(typeof value === 'number' && value % 90 === 0)) {
                console.warn('Invalid pages rotation angle.');
                return;
            }
            this._rotation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "externalLinkTarget", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._externalLinkTarget = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "autoresize", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._canAutoResize = Boolean(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "fitToPage", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._fitToPage = Boolean(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} type
     * @return {?}
     */
    PdfViewerComponent.getLinkTarget = function (type) {
        switch (type) {
            case 'blank':
                return ((PDFJS)).LinkTarget.BLANK;
            case 'none':
                return ((PDFJS)).LinkTarget.NONE;
            case 'self':
                return ((PDFJS)).LinkTarget.SELF;
            case 'parent':
                return ((PDFJS)).LinkTarget.PARENT;
            case 'top':
                return ((PDFJS)).LinkTarget.TOP;
        }
        return null;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    PdfViewerComponent.setExternalLinkTarget = function (type) {
        var /** @type {?} */ linkTarget = PdfViewerComponent.getLinkTarget(type);
        if (linkTarget !== null) {
            ((PDFJS)).externalLinkTarget = linkTarget;
        }
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.ngOnInit = function () {
        if (!isSSR()) {
            this.setupMultiPageViewer();
            this.setupSinglePageViewer();
        }
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.ngOnDestroy = function () {
        if (this._pdf) {
            this._pdf.destroy();
        }
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.onPageResize = function () {
        var _this = this;
        if (!this._canAutoResize || !this._pdf) {
            return;
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(function () {
            _this.updateSize();
        }, 100);
    };
    /**
     * @param {?} e
     * @return {?}
     */
    PdfViewerComponent.prototype.onPageRendered = function (e) {
        this.pageRendered.emit(e);
    };
    /**
     * @param {?} e
     * @return {?}
     */
    PdfViewerComponent.prototype.onTextLayerRendered = function (e) {
        this.textLayerRendered.emit(e);
    };
    Object.defineProperty(PdfViewerComponent.prototype, "pdfLinkService", {
        /**
         * @return {?}
         */
        get: function () {
            return this._showAll ? this.pdfMultiPageLinkService : this.pdfSinglePageLinkService;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "pdfViewer", {
        /**
         * @return {?}
         */
        get: function () {
            return this.getCurrentViewer();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfViewerComponent.prototype, "pdfFindController", {
        /**
         * @return {?}
         */
        get: function () {
            return this._showAll ? this.pdfMultiPageFindController : this.pdfSinglePageFindController;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    PdfViewerComponent.prototype.ngOnChanges = function (changes) {
        if (isSSR()) {
            return;
        }
        if ('src' in changes) {
            this.loadPDF();
        }
        else if (this._pdf) {
            if ('renderText' in changes) {
                this.getCurrentViewer().textLayerMode = this._renderText ? this._renderTextMode : RenderTextMode.DISABLED;
                this.resetPdfDocument();
            }
            else if ('showAll' in changes) {
                this.resetPdfDocument();
            }
            if ('page' in changes) {
                // New form of page changing: The viewer will now jump to the specified page when it is changed.
                // This behavior is introducedby using the PDFSinglePageViewer
                this.getCurrentViewer().scrollPageIntoView({ pageNumber: this._page });
            }
            this.update();
        }
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.updateSize = function () {
        var _this = this;
        var /** @type {?} */ currentViewer = this.getCurrentViewer();
        this._pdf.getPage(currentViewer.currentPageNumber).then(function (page) {
            var /** @type {?} */ viewport = page.getViewport(_this._zoom, _this._rotation);
            var /** @type {?} */ scale = _this._zoom;
            var /** @type {?} */ stickToPage = true;
            // Scale the document when it shouldn't be in original size or doesn't fit into the viewport
            if (!_this._originalSize || (_this._fitToPage && viewport.width > _this.element.nativeElement.offsetWidth)) {
                scale = _this.getScale(page.getViewport(1).width);
                stickToPage = !_this._stickToPage;
            }
            currentViewer._setScale(scale, stickToPage);
        });
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.setupMultiPageViewer = function () {
        ((PDFJS)).disableTextLayer = !this._renderText;
        PdfViewerComponent.setExternalLinkTarget(this._externalLinkTarget);
        var /** @type {?} */ eventBus = createEventBus(PDFJSViewer);
        this.pdfMultiPageLinkService = new PDFJSViewer.PDFLinkService({ eventBus: eventBus });
        this.pdfMultiPageFindController = new PDFJSViewer.PDFFindController({ linkService: this.pdfMultiPageLinkService, eventBus: eventBus });
        var /** @type {?} */ pdfOptions = {
            eventBus: eventBus,
            container: this.element.nativeElement.querySelector('div'),
            removePageBorders: true,
            linkService: this.pdfMultiPageLinkService,
            textLayerMode: this._renderText ? this._renderTextMode : RenderTextMode.DISABLED,
            findController: this.pdfMultiPageFindController,
        };
        this.pdfMultiPageViewer = new PDFJSViewer.PDFViewer(pdfOptions);
        this.pdfMultiPageLinkService.setViewer(this.pdfMultiPageViewer);
        this.pdfMultiPageFindController.setDocument(this._pdf);
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.setupSinglePageViewer = function () {
        ((PDFJS)).disableTextLayer = !this._renderText;
        PdfViewerComponent.setExternalLinkTarget(this._externalLinkTarget);
        var /** @type {?} */ eventBus = createEventBus(PDFJSViewer);
        this.pdfSinglePageLinkService = new PDFJSViewer.PDFLinkService({ eventBus: eventBus });
        this.pdfSinglePageFindController = new PDFJSViewer.PDFFindController({ linkService: this.pdfSinglePageLinkService, eventBus: eventBus });
        var /** @type {?} */ pdfOptions = {
            eventBus: eventBus,
            container: this.element.nativeElement.querySelector('div'),
            removePageBorders: true,
            linkService: this.pdfSinglePageLinkService,
            textLayerMode: this._renderText ? this._renderTextMode : RenderTextMode.DISABLED,
            findController: this.pdfSinglePageFindController,
        };
        this.pdfSinglePageViewer = new PDFJSViewer.PDFSinglePageViewer(pdfOptions);
        this.pdfSinglePageLinkService.setViewer(this.pdfSinglePageViewer);
        this.pdfSinglePageFindController.setDocument(this._pdf);
        this.pdfSinglePageViewer._currentPageNumber = this._page;
    };
    /**
     * @param {?} page
     * @return {?}
     */
    PdfViewerComponent.prototype.getValidPageNumber = function (page) {
        if (page < 1) {
            return 1;
        }
        if (page > this._pdf.numPages) {
            return this._pdf.numPages;
        }
        return page;
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.getDocumentParams = function () {
        var /** @type {?} */ srcType = typeof (this.src);
        if (!this._cMapsUrl) {
            return this.src;
        }
        var /** @type {?} */ params = {
            cMapUrl: this._cMapsUrl,
            cMapPacked: true
        };
        if (srcType === 'string') {
            params.url = this.src;
        }
        else if (srcType === 'object') {
            if (((this.src)).byteLength !== undefined) {
                params.data = this.src;
            }
            else {
                Object.assign(params, this.src);
            }
        }
        return params;
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.loadPDF = function () {
        var _this = this;
        if (!this.src) {
            return;
        }
        if (this.lastLoaded === this.src) {
            this.update();
            return;
        }
        var /** @type {?} */ loadingTask = ((PDFJS)).getDocument(this.getDocumentParams());
        loadingTask.onProgress = function (progressData) {
            _this.onProgress.emit(progressData);
        };
        var /** @type {?} */ src = this.src;
        ((loadingTask.promise))
            .then(function (pdf) {
            if (_this._pdf) {
                _this._pdf.destroy();
            }
            _this._pdf = pdf;
            _this.lastLoaded = src;
            _this.afterLoadComplete.emit(pdf);
            if (!_this.pdfMultiPageViewer) {
                _this.setupMultiPageViewer();
                _this.setupSinglePageViewer();
            }
            _this.resetPdfDocument();
            _this.update();
        }, function (error) {
            _this.onError.emit(error);
        });
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.update = function () {
        this.page = this._page;
        this.render();
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.render = function () {
        var _this = this;
        this._page = this.getValidPageNumber(this._page);
        var /** @type {?} */ currentViewer = this.getCurrentViewer();
        if (this._rotation !== 0 || currentViewer.pagesRotation !== this._rotation) {
            setTimeout(function () {
                currentViewer.pagesRotation = _this._rotation;
            });
        }
        if (this._stickToPage) {
            setTimeout(function () {
                currentViewer.currentPageNumber = _this._page;
            });
        }
        this.updateSize();
    };
    /**
     * @param {?} viewportWidth
     * @return {?}
     */
    PdfViewerComponent.prototype.getScale = function (viewportWidth) {
        var /** @type {?} */ offsetWidth = this.element.nativeElement.offsetWidth;
        if (offsetWidth === 0) {
            return 1;
        }
        return this._zoom * (offsetWidth / viewportWidth) / PdfViewerComponent.CSS_UNITS;
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.getCurrentViewer = function () {
        return this._showAll ? this.pdfMultiPageViewer : this.pdfSinglePageViewer;
    };
    /**
     * @return {?}
     */
    PdfViewerComponent.prototype.resetPdfDocument = function () {
        this.pdfFindController.setDocument(this._pdf);
        if (this._showAll) {
            this.pdfSinglePageViewer.setDocument(null);
            this.pdfSinglePageLinkService.setDocument(null);
            this.pdfMultiPageViewer.setDocument(this._pdf);
            this.pdfMultiPageLinkService.setDocument(this._pdf, null);
        }
        else {
            this.pdfMultiPageViewer.setDocument(null);
            this.pdfMultiPageLinkService.setDocument(null);
            this.pdfSinglePageViewer.setDocument(this._pdf);
            this.pdfSinglePageLinkService.setDocument(this._pdf, null);
        }
    };
    return PdfViewerComponent;
}());
PdfViewerComponent.CSS_UNITS = 96.0 / 72.0;
PdfViewerComponent.decorators = [
    { type: Component, args: [{
                selector: 'pdf-viewer',
                template: "\n    <div class=\"ng2-pdf-viewer-container\">\n      <div class=\"pdfViewer\"></div>\n    </div>",
                styles: ["\n    .ng2-pdf-viewer-container {\n      overflow-x: auto; }\n\n    :host /deep/ .textLayer {\n      position: absolute;\n      left: 0;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      overflow: hidden;\n      opacity: 0.2;\n      line-height: 1.0; }\n      :host /deep/ .textLayer > div {\n        color: transparent;\n        position: absolute;\n        white-space: pre;\n        cursor: text;\n        -webkit-transform-origin: 0% 0%;\n        transform-origin: 0% 0%; }\n      :host /deep/ .textLayer .highlight {\n        margin: -1px;\n        padding: 1px;\n        background-color: #002bff;\n        border-radius: 4px; }\n        :host /deep/ .textLayer .highlight.begin {\n          border-radius: 4px 0px 0px 4px; }\n        :host /deep/ .textLayer .highlight.end {\n          border-radius: 0px 4px 4px 0px; }\n        :host /deep/ .textLayer .highlight.middle {\n          border-radius: 0px; }\n        :host /deep/ .textLayer .highlight.selected {\n          background-color: darkgreen; }\n      :host /deep/ .textLayer ::-moz-selection {\n        background: #002bff; }\n      :host /deep/ .textLayer ::selection {\n        background: #002bff; }\n      :host /deep/ .textLayer ::-moz-selection {\n        background: #002bff; }\n      :host /deep/ .textLayer .endOfContent {\n        display: block;\n        position: absolute;\n        left: 0px;\n        top: 100%;\n        right: 0px;\n        bottom: 0px;\n        z-index: -1;\n        cursor: default;\n        -webkit-user-select: none;\n        -ms-user-select: none;\n        -moz-user-select: none; }\n        :host /deep/ .textLayer .endOfContent.active {\n          top: 0px; }\n\n    :host /deep/ .annotationLayer section {\n      position: absolute; }\n\n    :host /deep/ .annotationLayer .linkAnnotation > a {\n      position: absolute;\n      font-size: 1em;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background: url(\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\") 0 0 repeat;\n      /* -ms-a */ }\n      :host /deep/ .annotationLayer .linkAnnotation > a:hover {\n        opacity: 0.2;\n        background: #002bff;\n        -webkit-box-shadow: 0px 2px 10px #002bff;\n                box-shadow: 0px 2px 10px #002bff; }\n\n    :host /deep/ .annotationLayer .textAnnotation img {\n      position: absolute;\n      cursor: pointer; }\n\n    :host /deep/ .annotationLayer .textWidgetAnnotation input,\n    :host /deep/ .annotationLayer .textWidgetAnnotation textarea,\n    :host /deep/ .annotationLayer .choiceWidgetAnnotation select,\n    :host /deep/ .annotationLayer .buttonWidgetAnnotation.checkBox input,\n    :host /deep/ .annotationLayer .buttonWidgetAnnotation.radioButton input {\n      background-color: #002bff;\n      border: 1px solid transparent;\n      -webkit-box-sizing: border-box;\n              box-sizing: border-box;\n      font-size: 9px;\n      height: 100%;\n      padding: 0 3px;\n      vertical-align: top;\n      width: 100%; }\n\n    :host /deep/ .annotationLayer .textWidgetAnnotation textarea {\n      font: message-box;\n      font-size: 9px;\n      resize: none; }\n\n    :host /deep/ .annotationLayer .textWidgetAnnotation input[disabled],\n    :host /deep/ .annotationLayer .textWidgetAnnotation textarea[disabled],\n    :host /deep/ .annotationLayer .choiceWidgetAnnotation select[disabled],\n    :host /deep/ .annotationLayer .buttonWidgetAnnotation.checkBox input[disabled],\n    :host /deep/ .annotationLayer .buttonWidgetAnnotation.radioButton input[disabled] {\n      background: none;\n      border: 1px solid transparent;\n      cursor: not-allowed; }\n\n    :host /deep/ .annotationLayer .textWidgetAnnotation input:hover,\n    :host /deep/ .annotationLayer .textWidgetAnnotation textarea:hover,\n    :host /deep/ .annotationLayer .choiceWidgetAnnotation select:hover,\n    :host /deep/ .annotationLayer .buttonWidgetAnnotation.checkBox input:hover,\n    :host /deep/ .annotationLayer .buttonWidgetAnnotation.radioButton input:hover {\n      border: 1px solid #000; }\n\n    :host /deep/ .annotationLayer .textWidgetAnnotation input:focus,\n    :host /deep/ .annotationLayer .textWidgetAnnotation textarea:focus,\n    :host /deep/ .annotationLayer .choiceWidgetAnnotation select:focus {\n      background: none;\n      border: 1px solid transparent; }\n\n    :host /deep/ .annotationLayer .textWidgetAnnotation input.comb {\n      font-family: monospace;\n      padding-left: 2px;\n      padding-right: 0; }\n      :host /deep/ .annotationLayer .textWidgetAnnotation input.comb:focus {\n        width: 115%; }\n\n    :host /deep/ .annotationLayer .buttonWidgetAnnotation.checkBox input,\n    :host /deep/ .annotationLayer .buttonWidgetAnnotation.radioButton input {\n      -webkit-appearance: none;\n      -moz-appearance: none;\n      -ms-appearance: none;\n      appearance: none; }\n\n    :host /deep/ .annotationLayer .popupWrapper {\n      position: absolute;\n      width: 20em; }\n\n    :host /deep/ .annotationLayer .popup {\n      position: absolute;\n      z-index: 200;\n      max-width: 20em;\n      background-color: #FFFF99;\n      -webkit-box-shadow: 0px 2px 5px #333;\n              box-shadow: 0px 2px 5px #333;\n      border-radius: 2px;\n      padding: 0.6em;\n      margin-left: 5px;\n      cursor: pointer;\n      word-wrap: break-word; }\n      :host /deep/ .annotationLayer .popup h1 {\n        font-size: 1em;\n        border-bottom: 1px solid #000000;\n        padding-bottom: 0.2em; }\n      :host /deep/ .annotationLayer .popup p {\n        padding-top: 0.2em; }\n\n    :host /deep/ .annotationLayer .highlightAnnotation,\n    :host /deep/ .annotationLayer .underlineAnnotation,\n    :host /deep/ .annotationLayer .squigglyAnnotation,\n    :host /deep/ .annotationLayer .strikeoutAnnotation,\n    :host /deep/ .annotationLayer .fileAttachmentAnnotation {\n      cursor: pointer; }\n\n    :host /deep/ .pdfViewer .canvasWrapper {\n      overflow: hidden; }\n\n    :host /deep/ .pdfViewer .page {\n      direction: ltr;\n      width: 816px;\n      height: 1056px;\n      margin: 1px auto -8px auto;\n      position: relative;\n      overflow: visible;\n      border: 9px solid transparent;\n      background-clip: content-box;\n      -o-border-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAAA6UlEQVR4Xl2Pi2rEMAwE16fm1f7/r14v7w4rI0IzLAF7hLxNevBSEMEF5+OilNCsRd8ZMyn+a4NmsOT8WJw1lFbSYgGFzF2bLFoLjTClWjKKGRWpDYAGXUnZ4uhbBUzF3Oe/GG/ue2fn4GgsyXhNgysV2JnrhKEMg4fEZcALmiKbNhBBRFpSyDOj1G4QOVly6O1FV54ZZq8OVygrciDt6JazRgi1ljTPH0gbrPmHPXAbCiDd4GawIjip1TPh9tt2sz24qaCjr/jAb/GBFTbq9KZ7Ke/Cqt8nayUikZKsWZK7Fe6bg5dOUt8fZHWG2BHc+6EAAAAASUVORK5CYII=\") 9 9 repeat;\n         border-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAAA6UlEQVR4Xl2Pi2rEMAwE16fm1f7/r14v7w4rI0IzLAF7hLxNevBSEMEF5+OilNCsRd8ZMyn+a4NmsOT8WJw1lFbSYgGFzF2bLFoLjTClWjKKGRWpDYAGXUnZ4uhbBUzF3Oe/GG/ue2fn4GgsyXhNgysV2JnrhKEMg4fEZcALmiKbNhBBRFpSyDOj1G4QOVly6O1FV54ZZq8OVygrciDt6JazRgi1ljTPH0gbrPmHPXAbCiDd4GawIjip1TPh9tt2sz24qaCjr/jAb/GBFTbq9KZ7Ke/Cqt8nayUikZKsWZK7Fe6bg5dOUt8fZHWG2BHc+6EAAAAASUVORK5CYII=\") 9 9 repeat;\n      background-color: white; }\n      :host /deep/ .pdfViewer .page canvas {\n        margin: 0;\n        display: block; }\n      :host /deep/ .pdfViewer .page .loadingIcon {\n        position: absolute;\n        display: block;\n        left: 0;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        background: url(\"data:image/gif;base64,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\") center no-repeat; }\n\n    :host /deep/ .pdfViewer.removePageBorders .page {\n      margin: 0px auto 10px auto;\n      border: none; }\n\n    :host /deep/ .pdfViewer.singlePageView {\n      display: inline-block; }\n      :host /deep/ .pdfViewer.singlePageView .page {\n        margin: 0;\n        border: none; }\n  "]
            },] },
];
/**
 * @nocollapse
 */
PdfViewerComponent.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
PdfViewerComponent.propDecorators = {
    'afterLoadComplete': [{ type: Output, args: ['after-load-complete',] },],
    'pageRendered': [{ type: Output, args: ['page-rendered',] },],
    'textLayerRendered': [{ type: Output, args: ['text-layer-rendered',] },],
    'onError': [{ type: Output, args: ['error',] },],
    'onProgress': [{ type: Output, args: ['on-progress',] },],
    'pageChange': [{ type: Output },],
    'src': [{ type: Input },],
    'cMapsUrl': [{ type: Input, args: ['c-maps-url',] },],
    'page': [{ type: Input, args: ['page',] },],
    'renderText': [{ type: Input, args: ['render-text',] },],
    'renderTextMode': [{ type: Input, args: ['render-text-mode',] },],
    'originalSize': [{ type: Input, args: ['original-size',] },],
    'showAll': [{ type: Input, args: ['show-all',] },],
    'stickToPage': [{ type: Input, args: ['stick-to-page',] },],
    'zoom': [{ type: Input, args: ['zoom',] },],
    'rotation': [{ type: Input, args: ['rotation',] },],
    'externalLinkTarget': [{ type: Input, args: ['external-link-target',] },],
    'autoresize': [{ type: Input, args: ['autoresize',] },],
    'fitToPage': [{ type: Input, args: ['fit-to-page',] },],
    'onPageResize': [{ type: HostListener, args: ['window:resize', [],] },],
    'onPageRendered': [{ type: HostListener, args: ['pagerendered', ['$event'],] },],
    'onTextLayerRendered': [{ type: HostListener, args: ['textlayerrendered', ['$event'],] },],
};
/**
 * Created by vadimdez on 01/11/2016.
 */
var PdfViewerModule = /** @class */ (function () {
    function PdfViewerModule() {
    }
    return PdfViewerModule;
}());
PdfViewerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PdfViewerComponent],
                exports: [PdfViewerComponent]
            },] },
];
/**
 * @nocollapse
 */
PdfViewerModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { PdfViewerModule, RenderTextMode, PdfViewerComponent };
//# sourceMappingURL=ng2-pdf-viewer.es5.js.map
