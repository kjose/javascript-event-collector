// ==UserScript==
// @name         Javascript X Collector
// @version      0.1
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
    window.EventCollector = [];
    window.XHRCollector = [];
    window.TimeoutCollector = [];
    window.IntervalCollector = [];

    window.cleanAllEvents = function() {
        var i;
        for(i=0; i<EventCollector.length; i++) EventCollector[i].element.removeEventListener(EventCollector[i].type, EventCollector[i].listener, EventCollector[i].useCapture);
        for(i=0; i<EventDocumentCollector.length; i++) EventDocumentCollector[i].element.removeEventListener(EventDocumentCollector[i].type, EventDocumentCollector[i].listener, EventDocumentCollector[i].useCapture);
        window.EventCollector = window.EventDocumentCollector = [];
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

    window.cleanAll = function() {
        window.cleanAllEvents();
        window.cleanAllTimeout();
        window.cleanAllInterval();
        window.cleanAllXHR();
    };

    /**
     * CORE
     */

    // This code must be loaded before all js code of website
    console.log('JS starting collecting events ...');

    // Parameters
    var filterSelector = '';
    var filterType = '';
    var debugMode = false; // option to enable debug mode (will open debugger when listener attached)
    var disableListenerForElementsCatched = false; // option to disable the listener for elements matching with filterSelector and filterType

    // Replace method setTimeout
    var oldAddSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay) {
        window.TimeoutCollector.push({
            trigger: oldAddSetTimeout.apply(this, arguments),
            fn: fn,
            delay: delay
        });
    };

    // Replace method setTimeout
    var oldAddSetInterval = window.setInterval;
    window.setInterval = function(fn, delay) {
        window.IntervalCollector.push({
            trigger: oldAddSetInterval.apply(this, arguments),
            fn: fn,
            delay: delay
        });
    };

    // Replace method for sending XmlHttpRequest
    var oldXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        XHRCollector.push(this);
        oldXHRSend.apply(this, arguments);
    };

    // Replace method addEventListener for DOM elements
    var oldAddEventListener = Element.prototype.addEventListener;
    Element.prototype.addEventListener = function(type, listener, useCapture) {
        var selector = path(this);
        var error = new Error();
        var data = {
            selector: selector,
            element: this,
            type: type,
            listener: listener,
            useCapture: useCapture
        };
        if (selector.indexOf(filterSelector) !== -1 && type.indexOf(filterType) !== -1) {
            window.EventCollector.push(data);
            if (debugMode) {
                debugger;
            }
            if (!disableListenerForElementsCatched) {
                oldAddEventListener.apply(this, arguments);
            }
        } else {
            oldAddEventListener.apply(this, arguments);
        }
    };

    // Replace method addEventListener for Window | Document elements
    function resetEventListenerMethod(el) {
        var oldFn = el.addEventListener;
        el.addEventListener = function(type, listener, useCapture) {
            window.EventDocumentCollector.push({
                element: el,
                type: type,
                listener: listener,
                useCapture: useCapture
            });
            oldFn.call(el, type, listener, useCapture);
        };
    }
    resetEventListenerMethod(window);
    resetEventListenerMethod(document);


    // Function
    function path(el, fullpath){
        var names = [];
        fullpath = fullpath || false;
        while (el.parentNode){
            if (el.id){
                names.unshift('#'+el.id);
                break;
            }else{
                if (el==el.ownerDocument.documentElement) names.unshift(el.tagName);
                else{
                    var c = 1;
                    var s = el.previousElementSibling;
                    while (s){
                        // if (s.className == el.className) c++;
                        c++;
                        s = s.previousElementSibling;
                    }
                    if (el.className) {
                        names.unshift('.'+el.className.replace(' ', '.')+":nth-child("+c+")");
                    } else if (fullpath) {
                        names.unshift(el.tagName+":nth-child("+c+")");
                    }
                }
                el=el.parentNode;
            }
        }
        var separator = fullpath ? " > " : " ";
        return names.join(separator);
    }


})();
