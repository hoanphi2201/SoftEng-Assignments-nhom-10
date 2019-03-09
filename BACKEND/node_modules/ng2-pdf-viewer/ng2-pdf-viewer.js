import { Component, ElementRef, EventEmitter, HostListener, Input, NgModule, Output } from '@angular/core';

/**
 * @param {?} pdfJsViewer
 * @return {?}
 */
function _createEventBus(pdfJsViewer) {
    const /** @type {?} */ globalEventBus = new pdfJsViewer.EventBus(true);
    attachDOMEventsToEventBus(globalEventBus);
    return globalEventBus;
}
/**
 * @param {?} eventBus
 * @return {?}
 */
function attachDOMEventsToEventBus(eventBus) {
    eventBus.on('documentload', function () {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('documentload', true, true, {});
        window.dispatchEvent(event);
    });
    eventBus.on('pagerendered', function (evt) {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('pagerendered', true, true, {
            pageNumber: evt.pageNumber,
            cssTransform: evt.cssTransform
        });
        evt.source.div.dispatchEvent(event);
    });
    eventBus.on('textlayerrendered', function (evt) {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('textlayerrendered', true, true, {
            pageNumber: evt.pageNumber
        });
        evt.source.textLayerDiv.dispatchEvent(event);
    });
    eventBus.on('pagechange', function (evt) {
        const /** @type {?} */ event = document.createEvent('UIEvents');
        event.initUIEvent('pagechange', true, true, window, 0);
        event['pageNumber'] = evt.pageNumber;
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('pagesinit', function (evt) {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('pagesinit', true, true, null);
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('pagesloaded', function (evt) {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('pagesloaded', true, true, {
            pagesCount: evt.pagesCount
        });
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('scalechange', function (evt) {
        const /** @type {?} */ event = document.createEvent('UIEvents');
        event.initUIEvent('scalechange', true, true, window, 0);
        event['scale'] = evt.scale;
        event['presetValue'] = evt.presetValue;
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('updateviewarea', function (evt) {
        const /** @type {?} */ event = document.createEvent('UIEvents');
        event.initUIEvent('updateviewarea', true, true, window, 0);
        event['location'] = evt.location;
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('find', function (evt) {
        if (evt.source === window) {
            return; // event comes from FirefoxCom, no need to replicate
        }
        const /** @type {?} */ event = document.createEvent('CustomEvent');
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
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('attachmentsloaded', true, true, {
            attachmentsCount: evt.attachmentsCount
        });
        evt.source.container.dispatchEvent(event);
    });
    eventBus.on('sidebarviewchanged', function (evt) {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('sidebarviewchanged', true, true, {
            view: evt.view
        });
        evt.source.outerContainer.dispatchEvent(event);
    });
    eventBus.on('pagemode', function (evt) {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('pagemode', true, true, {
            mode: evt.mode
        });
        evt.source.pdfViewer.container.dispatchEvent(event);
    });
    eventBus.on('namedaction', function (evt) {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('namedaction', true, true, {
            action: evt.action
        });
        evt.source.pdfViewer.container.dispatchEvent(event);
    });
    eventBus.on('presentationmodechanged', function (evt) {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('presentationmodechanged', true, true, {
            active: evt.active,
            switchInProgress: evt.switchInProgress
        });
        window.dispatchEvent(event);
    });
    eventBus.on('outlineloaded', function (evt) {
        const /** @type {?} */ event = document.createEvent('CustomEvent');
        event.initCustomEvent('outlineloaded', true, true, {
            outlineCount: evt.outlineCount
        });
        evt.source.container.dispatchEvent(event);
    });
}
const createEventBus = _createEventBus;

/**
 * Created by vadimdez on 21/06/16.
 */
let PDFJS;
let PDFJSViewer;
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
let RenderTextMode = {};
RenderTextMode.DISABLED = 0;
RenderTextMode.ENABLED = 1;
RenderTextMode.ENHANCED = 2;
RenderTextMode[RenderTextMode.DISABLED] = "DISABLED";
RenderTextMode[RenderTextMode.ENABLED] = "ENABLED";
RenderTextMode[RenderTextMode.ENHANCED] = "ENHANCED";
class PdfViewerComponent {
    /**
     * @param {?} element
     */
    constructor(element) {
        this.element = element;
        this._cMapsUrl = typeof PDFJS !== 'undefined' ? `https://unpkg.com/pdfjs-dist@${((PDFJS)).version}/cmaps/` : null;
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
        let pdfWorkerSrc;
        if (window.hasOwnProperty('pdfWorkerSrc') && typeof window.pdfWorkerSrc === 'string' && window.pdfWorkerSrc) {
            pdfWorkerSrc = window.pdfWorkerSrc;
        }
        else {
            pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
        }
        PDFJS.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
    }
    /**
     * @param {?} cMapsUrl
     * @return {?}
     */
    set cMapsUrl(cMapsUrl) {
        this._cMapsUrl = cMapsUrl;
    }
    /**
     * @param {?} _page
     * @return {?}
     */
    set page(_page) {
        _page = parseInt(_page, 10) || 1;
        if (this._pdf) {
            _page = this.getValidPageNumber(_page);
        }
        this._page = _page;
        this.pageChange.emit(_page);
    }
    /**
     * @param {?} renderText
     * @return {?}
     */
    set renderText(renderText) {
        this._renderText = renderText;
    }
    /**
     * @param {?} renderTextMode
     * @return {?}
     */
    set renderTextMode(renderTextMode) {
        this._renderTextMode = renderTextMode;
    }
    /**
     * @param {?} originalSize
     * @return {?}
     */
    set originalSize(originalSize) {
        this._originalSize = originalSize;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set showAll(value) {
        this._showAll = value;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set stickToPage(value) {
        this._stickToPage = value;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set zoom(value) {
        if (value <= 0) {
            return;
        }
        this._zoom = value;
    }
    /**
     * @return {?}
     */
    get zoom() {
        return this._zoom;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set rotation(value) {
        if (!(typeof value === 'number' && value % 90 === 0)) {
            console.warn('Invalid pages rotation angle.');
            return;
        }
        this._rotation = value;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set externalLinkTarget(value) {
        this._externalLinkTarget = value;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set autoresize(value) {
        this._canAutoResize = Boolean(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set fitToPage(value) {
        this._fitToPage = Boolean(value);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    static getLinkTarget(type) {
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
    }
    /**
     * @param {?} type
     * @return {?}
     */
    static setExternalLinkTarget(type) {
        const /** @type {?} */ linkTarget = PdfViewerComponent.getLinkTarget(type);
        if (linkTarget !== null) {
            ((PDFJS)).externalLinkTarget = linkTarget;
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!isSSR()) {
            this.setupMultiPageViewer();
            this.setupSinglePageViewer();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._pdf) {
            this._pdf.destroy();
        }
    }
    /**
     * @return {?}
     */
    onPageResize() {
        if (!this._canAutoResize || !this._pdf) {
            return;
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            this.updateSize();
        }, 100);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onPageRendered(e) {
        this.pageRendered.emit(e);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onTextLayerRendered(e) {
        this.textLayerRendered.emit(e);
    }
    /**
     * @return {?}
     */
    get pdfLinkService() {
        return this._showAll ? this.pdfMultiPageLinkService : this.pdfSinglePageLinkService;
    }
    /**
     * @return {?}
     */
    get pdfViewer() {
        return this.getCurrentViewer();
    }
    /**
     * @return {?}
     */
    get pdfFindController() {
        return this._showAll ? this.pdfMultiPageFindController : this.pdfSinglePageFindController;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
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
    }
    /**
     * @return {?}
     */
    updateSize() {
        const /** @type {?} */ currentViewer = this.getCurrentViewer();
        this._pdf.getPage(currentViewer.currentPageNumber).then((page) => {
            const /** @type {?} */ viewport = page.getViewport(this._zoom, this._rotation);
            let /** @type {?} */ scale = this._zoom;
            let /** @type {?} */ stickToPage = true;
            // Scale the document when it shouldn't be in original size or doesn't fit into the viewport
            if (!this._originalSize || (this._fitToPage && viewport.width > this.element.nativeElement.offsetWidth)) {
                scale = this.getScale(page.getViewport(1).width);
                stickToPage = !this._stickToPage;
            }
            currentViewer._setScale(scale, stickToPage);
        });
    }
    /**
     * @return {?}
     */
    setupMultiPageViewer() {
        ((PDFJS)).disableTextLayer = !this._renderText;
        PdfViewerComponent.setExternalLinkTarget(this._externalLinkTarget);
        const /** @type {?} */ eventBus = createEventBus(PDFJSViewer);
        this.pdfMultiPageLinkService = new PDFJSViewer.PDFLinkService({ eventBus });
        this.pdfMultiPageFindController = new PDFJSViewer.PDFFindController({ linkService: this.pdfMultiPageLinkService, eventBus });
        const /** @type {?} */ pdfOptions = {
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
    }
    /**
     * @return {?}
     */
    setupSinglePageViewer() {
        ((PDFJS)).disableTextLayer = !this._renderText;
        PdfViewerComponent.setExternalLinkTarget(this._externalLinkTarget);
        const /** @type {?} */ eventBus = createEventBus(PDFJSViewer);
        this.pdfSinglePageLinkService = new PDFJSViewer.PDFLinkService({ eventBus });
        this.pdfSinglePageFindController = new PDFJSViewer.PDFFindController({ linkService: this.pdfSinglePageLinkService, eventBus });
        const /** @type {?} */ pdfOptions = {
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
    }
    /**
     * @param {?} page
     * @return {?}
     */
    getValidPageNumber(page) {
        if (page < 1) {
            return 1;
        }
        if (page > this._pdf.numPages) {
            return this._pdf.numPages;
        }
        return page;
    }
    /**
     * @return {?}
     */
    getDocumentParams() {
        const /** @type {?} */ srcType = typeof (this.src);
        if (!this._cMapsUrl) {
            return this.src;
        }
        const /** @type {?} */ params = {
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
    }
    /**
     * @return {?}
     */
    loadPDF() {
        if (!this.src) {
            return;
        }
        if (this.lastLoaded === this.src) {
            this.update();
            return;
        }
        const /** @type {?} */ loadingTask = ((PDFJS)).getDocument(this.getDocumentParams());
        loadingTask.onProgress = (progressData) => {
            this.onProgress.emit(progressData);
        };
        const /** @type {?} */ src = this.src;
        ((loadingTask.promise))
            .then((pdf) => {
            if (this._pdf) {
                this._pdf.destroy();
            }
            this._pdf = pdf;
            this.lastLoaded = src;
            this.afterLoadComplete.emit(pdf);
            if (!this.pdfMultiPageViewer) {
                this.setupMultiPageViewer();
                this.setupSinglePageViewer();
            }
            this.resetPdfDocument();
            this.update();
        }, (error) => {
            this.onError.emit(error);
        });
    }
    /**
     * @return {?}
     */
    update() {
        this.page = this._page;
        this.render();
    }
    /**
     * @return {?}
     */
    render() {
        this._page = this.getValidPageNumber(this._page);
        const /** @type {?} */ currentViewer = this.getCurrentViewer();
        if (this._rotation !== 0 || currentViewer.pagesRotation !== this._rotation) {
            setTimeout(() => {
                currentViewer.pagesRotation = this._rotation;
            });
        }
        if (this._stickToPage) {
            setTimeout(() => {
                currentViewer.currentPageNumber = this._page;
            });
        }
        this.updateSize();
    }
    /**
     * @param {?} viewportWidth
     * @return {?}
     */
    getScale(viewportWidth) {
        const /** @type {?} */ offsetWidth = this.element.nativeElement.offsetWidth;
        if (offsetWidth === 0) {
            return 1;
        }
        return this._zoom * (offsetWidth / viewportWidth) / PdfViewerComponent.CSS_UNITS;
    }
    /**
     * @return {?}
     */
    getCurrentViewer() {
        return this._showAll ? this.pdfMultiPageViewer : this.pdfSinglePageViewer;
    }
    /**
     * @return {?}
     */
    resetPdfDocument() {
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
    }
}
PdfViewerComponent.CSS_UNITS = 96.0 / 72.0;
PdfViewerComponent.decorators = [
    { type: Component, args: [{
                selector: 'pdf-viewer',
                template: `
    <div class="ng2-pdf-viewer-container">
      <div class="pdfViewer"></div>
    </div>`,
                styles: [`
    .ng2-pdf-viewer-container {
      overflow-x: auto; }

    :host /deep/ .textLayer {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      opacity: 0.2;
      line-height: 1.0; }
      :host /deep/ .textLayer > div {
        color: transparent;
        position: absolute;
        white-space: pre;
        cursor: text;
        -webkit-transform-origin: 0% 0%;
        transform-origin: 0% 0%; }
      :host /deep/ .textLayer .highlight {
        margin: -1px;
        padding: 1px;
        background-color: #002bff;
        border-radius: 4px; }
        :host /deep/ .textLayer .highlight.begin {
          border-radius: 4px 0px 0px 4px; }
        :host /deep/ .textLayer .highlight.end {
          border-radius: 0px 4px 4px 0px; }
        :host /deep/ .textLayer .highlight.middle {
          border-radius: 0px; }
        :host /deep/ .textLayer .highlight.selected {
          background-color: darkgreen; }
      :host /deep/ .textLayer ::-moz-selection {
        background: #002bff; }
      :host /deep/ .textLayer ::selection {
        background: #002bff; }
      :host /deep/ .textLayer ::-moz-selection {
        background: #002bff; }
      :host /deep/ .textLayer .endOfContent {
        display: block;
        position: absolute;
        left: 0px;
        top: 100%;
        right: 0px;
        bottom: 0px;
        z-index: -1;
        cursor: default;
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: none; }
        :host /deep/ .textLayer .endOfContent.active {
          top: 0px; }

    :host /deep/ .annotationLayer section {
      position: absolute; }

    :host /deep/ .annotationLayer .linkAnnotation > a {
      position: absolute;
      font-size: 1em;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") 0 0 repeat;
      /* -ms-a */ }
      :host /deep/ .annotationLayer .linkAnnotation > a:hover {
        opacity: 0.2;
        background: #002bff;
        -webkit-box-shadow: 0px 2px 10px #002bff;
                box-shadow: 0px 2px 10px #002bff; }

    :host /deep/ .annotationLayer .textAnnotation img {
      position: absolute;
      cursor: pointer; }

    :host /deep/ .annotationLayer .textWidgetAnnotation input,
    :host /deep/ .annotationLayer .textWidgetAnnotation textarea,
    :host /deep/ .annotationLayer .choiceWidgetAnnotation select,
    :host /deep/ .annotationLayer .buttonWidgetAnnotation.checkBox input,
    :host /deep/ .annotationLayer .buttonWidgetAnnotation.radioButton input {
      background-color: #002bff;
      border: 1px solid transparent;
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      font-size: 9px;
      height: 100%;
      padding: 0 3px;
      vertical-align: top;
      width: 100%; }

    :host /deep/ .annotationLayer .textWidgetAnnotation textarea {
      font: message-box;
      font-size: 9px;
      resize: none; }

    :host /deep/ .annotationLayer .textWidgetAnnotation input[disabled],
    :host /deep/ .annotationLayer .textWidgetAnnotation textarea[disabled],
    :host /deep/ .annotationLayer .choiceWidgetAnnotation select[disabled],
    :host /deep/ .annotationLayer .buttonWidgetAnnotation.checkBox input[disabled],
    :host /deep/ .annotationLayer .buttonWidgetAnnotation.radioButton input[disabled] {
      background: none;
      border: 1px solid transparent;
      cursor: not-allowed; }

    :host /deep/ .annotationLayer .textWidgetAnnotation input:hover,
    :host /deep/ .annotationLayer .textWidgetAnnotation textarea:hover,
    :host /deep/ .annotationLayer .choiceWidgetAnnotation select:hover,
    :host /deep/ .annotationLayer .buttonWidgetAnnotation.checkBox input:hover,
    :host /deep/ .annotationLayer .buttonWidgetAnnotation.radioButton input:hover {
      border: 1px solid #000; }

    :host /deep/ .annotationLayer .textWidgetAnnotation input:focus,
    :host /deep/ .annotationLayer .textWidgetAnnotation textarea:focus,
    :host /deep/ .annotationLayer .choiceWidgetAnnotation select:focus {
      background: none;
      border: 1px solid transparent; }

    :host /deep/ .annotationLayer .textWidgetAnnotation input.comb {
      font-family: monospace;
      padding-left: 2px;
      padding-right: 0; }
      :host /deep/ .annotationLayer .textWidgetAnnotation input.comb:focus {
        width: 115%; }

    :host /deep/ .annotationLayer .buttonWidgetAnnotation.checkBox input,
    :host /deep/ .annotationLayer .buttonWidgetAnnotation.radioButton input {
      -webkit-appearance: none;
      -moz-appearance: none;
      -ms-appearance: none;
      appearance: none; }

    :host /deep/ .annotationLayer .popupWrapper {
      position: absolute;
      width: 20em; }

    :host /deep/ .annotationLayer .popup {
      position: absolute;
      z-index: 200;
      max-width: 20em;
      background-color: #FFFF99;
      -webkit-box-shadow: 0px 2px 5px #333;
              box-shadow: 0px 2px 5px #333;
      border-radius: 2px;
      padding: 0.6em;
      margin-left: 5px;
      cursor: pointer;
      word-wrap: break-word; }
      :host /deep/ .annotationLayer .popup h1 {
        font-size: 1em;
        border-bottom: 1px solid #000000;
        padding-bottom: 0.2em; }
      :host /deep/ .annotationLayer .popup p {
        padding-top: 0.2em; }

    :host /deep/ .annotationLayer .highlightAnnotation,
    :host /deep/ .annotationLayer .underlineAnnotation,
    :host /deep/ .annotationLayer .squigglyAnnotation,
    :host /deep/ .annotationLayer .strikeoutAnnotation,
    :host /deep/ .annotationLayer .fileAttachmentAnnotation {
      cursor: pointer; }

    :host /deep/ .pdfViewer .canvasWrapper {
      overflow: hidden; }

    :host /deep/ .pdfViewer .page {
      direction: ltr;
      width: 816px;
      height: 1056px;
      margin: 1px auto -8px auto;
      position: relative;
      overflow: visible;
      border: 9px solid transparent;
      background-clip: content-box;
      -o-border-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAAA6UlEQVR4Xl2Pi2rEMAwE16fm1f7/r14v7w4rI0IzLAF7hLxNevBSEMEF5+OilNCsRd8ZMyn+a4NmsOT8WJw1lFbSYgGFzF2bLFoLjTClWjKKGRWpDYAGXUnZ4uhbBUzF3Oe/GG/ue2fn4GgsyXhNgysV2JnrhKEMg4fEZcALmiKbNhBBRFpSyDOj1G4QOVly6O1FV54ZZq8OVygrciDt6JazRgi1ljTPH0gbrPmHPXAbCiDd4GawIjip1TPh9tt2sz24qaCjr/jAb/GBFTbq9KZ7Ke/Cqt8nayUikZKsWZK7Fe6bg5dOUt8fZHWG2BHc+6EAAAAASUVORK5CYII=") 9 9 repeat;
         border-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAAA6UlEQVR4Xl2Pi2rEMAwE16fm1f7/r14v7w4rI0IzLAF7hLxNevBSEMEF5+OilNCsRd8ZMyn+a4NmsOT8WJw1lFbSYgGFzF2bLFoLjTClWjKKGRWpDYAGXUnZ4uhbBUzF3Oe/GG/ue2fn4GgsyXhNgysV2JnrhKEMg4fEZcALmiKbNhBBRFpSyDOj1G4QOVly6O1FV54ZZq8OVygrciDt6JazRgi1ljTPH0gbrPmHPXAbCiDd4GawIjip1TPh9tt2sz24qaCjr/jAb/GBFTbq9KZ7Ke/Cqt8nayUikZKsWZK7Fe6bg5dOUt8fZHWG2BHc+6EAAAAASUVORK5CYII=") 9 9 repeat;
      background-color: white; }
      :host /deep/ .pdfViewer .page canvas {
        margin: 0;
        display: block; }
      :host /deep/ .pdfViewer .page .loadingIcon {
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/gif;base64,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") center no-repeat; }

    :host /deep/ .pdfViewer.removePageBorders .page {
      margin: 0px auto 10px auto;
      border: none; }

    :host /deep/ .pdfViewer.singlePageView {
      display: inline-block; }
      :host /deep/ .pdfViewer.singlePageView .page {
        margin: 0;
        border: none; }
  `]
            },] },
];
/**
 * @nocollapse
 */
PdfViewerComponent.ctorParameters = () => [
    { type: ElementRef, },
];
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
class PdfViewerModule {
}
PdfViewerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PdfViewerComponent],
                exports: [PdfViewerComponent]
            },] },
];
/**
 * @nocollapse
 */
PdfViewerModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { PdfViewerModule, RenderTextMode, PdfViewerComponent };
//# sourceMappingURL=ng2-pdf-viewer.js.map
