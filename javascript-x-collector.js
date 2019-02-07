// ==UserScript==
// @name         Javascript X Collector
// @version      1.1
// @description  Register all events in a collection
// @author       Kévin José
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {

    /**
     * LIBRARY window
     */

    // Init widnow extends objects
    window.EventDocumentCollector = [];
    window.XHRCollector = [];
    window.TimeoutCollector = [];
    window.IntervalCollector = [];

    window.cleanAllEvents = function() {
        var i;
        for(i=0; i<EventDocumentCollector.length; i++) EventDocumentCollector[i].element.removeEventListener(EventDocumentCollector[i].type, EventDocumentCollector[i].listener, EventDocumentCollector[i].useCapture);
        window.EventDocumentCollector = [];
    };

    window.cleanAllTimeout = function() {
        for(var i=0; i<TimeoutCollector.length; i++) clearTimeout(TimeoutCollector[i].trigger);
        window.TimeoutCollector = [];
    };

    window.cleanAllInterval = function() {
        for(var i=0; i<IntervalCollector.length; i++) clearInterval(IntervalCollector[i].trigger);
        window.IntervalCollector = [];
    };

    window.cleanAllXHR = function() {
        for(var i=0; i<XHRCollector.length; i++) XHRCollector[i].abort();
        window.XHRCollector = [];
    };

    window.cleanAll = window.abtastyCleanAll = function() {
        window.cleanAllEvents();
        window.cleanAllTimeout();
        window.cleanAllInterval();
        window.cleanAllXHR();
        Function.prototype.bind = Function.prototype.bindOriginal;
        Function.prototype.apply = Function.prototype.applyOriginal;
        String.prototype.replace = String.prototype.replaceOriginal;
        XMLHttpRequest.prototype.open = XMLHttpRequest.prototype.openOriginal;
        XMLHttpRequest.prototype.send = XMLHttpRequest.prototype.sendOriginal;
        EventTarget.prototype.addEventListener = EventTarget.prototype.addEventListenerOriginal;
        Object.keys = Object.keysOriginal;
        // Object.prototype.hasOwnProperty = Object.prototype.hasOwnPropertyOriginal;
        window.Promise = window.PromiseOriginal;
        window.Event = window.EventOriginal;
        window.setTimeout = window.setTimeoutOriginal;
        window.setInterval = window.setIntervalOriginal;
        window.console = window.consoleOriginal;
    };

    /**
     * CORE
     */

    // This code must be loaded before all js code of website
    console.log('JS starting collecting events ...');

    // Replace method setTimeout
    var oldAddSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay) {
        var tid = oldAddSetTimeout.apply(this, arguments);
        window.TimeoutCollector.push({
            trigger: tid,
            fn: fn,
            delay: delay
        });
        return tid;
    };

    // Replace method setTimeout
    var oldAddSetInterval = window.setInterval;
    window.setInterval = function(fn, delay) {
        var iid = oldAddSetInterval.apply(this, arguments);
        window.IntervalCollector.push({
            trigger: iid,
            fn: fn,
            delay: delay
        });
        return iid;
    };

    // Replace method for sending XmlHttpRequest
    var oldXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        XHRCollector.push(this);
        oldXHRSend.apply(this, arguments);
    };

    // Replace method addEventListener for Window | Document elements
    function resetEventListenerMethod(el) {
        var oldFn = el.addEventListener;
        el.addEventListener = function(type, listener, options, wantsUntrusted) {
            window.EventDocumentCollector.push({
                element: el,
                type: type,
                listener: listener,
                options: options,
                wantsUntrusted: wantsUntrusted
            });
            return oldFn.call(el, type, listener, options, wantsUntrusted);
        };
    }
    resetEventListenerMethod(window);
    resetEventListenerMethod(document);
    resetEventListenerMethod(document.documentElement);

    // Keep base javascript functions
    Function.prototype.bindOriginal = Function.prototype.bind;
    Function.prototype.applyOriginal = Function.prototype.apply;
    String.prototype.replaceOriginal = String.prototype.replace;
    XMLHttpRequest.prototype.openOriginal = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.sendOriginal = XMLHttpRequest.prototype.send;
    EventTarget.prototype.addEventListenerOriginal = EventTarget.prototype.addEventListener;
    Object.keysOriginal = Object.keys;
    // Object.prototype.hasOwnPropertyOriginal = Object.prototype.hasOwnProperty;
    window.PromiseOriginal = window.Promise;
    window.EventOriginal = window.Event;
    window.consoleOriginal = window.console;
    window.setIntervalOriginal = window.setInterval;
    window.setTimeoutOriginal = window.setTimeout;

})();
