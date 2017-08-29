// ==UserScript==
// @name         Events Collector
// @version      0.1
// @description  Register all events in a collection
// @author       Kévin José
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // this code must be loaded before all js code of website
    console.log('JS starting collecting events ...');

    window.EventCollector = [];
    function resetEventListenerMethod(el) {
        var oldFn = el.addEventListener;
        el.addEventListener = function(type, listener, useCapture) {
            window.EventCollector.push({
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

})();
