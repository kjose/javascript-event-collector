// ==UserScript==
// @name         EventElements Collector
// @version      0.1
// @description  Register all events of an element in a collection
// @author       Kévin José
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Set filters for sepcific elements
    // ex: var filterSelector = '.exlink';
    // ex: var filterType = 'mouseover';
    var filterSelector = '#menu_main .menu_item .exlink';
    var filterType = 'mouseover';
    // True if you want to prevent the adding of the listener to the filtered element
    var disableListenerForElementsCatched = true;
    // True if you want to launch the debugger when an event listener is added to filtered element
    var debugMode = true;

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
                    if (el.className) {
                        names.unshift('.'+el.className.replace(' ', '.'));
                    } else if (fullpath) {
                        for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
                        names.unshift(el.tagName+":nth-child("+c+")");
                    }
                }
                el=el.parentNode;
            }
        }
        var separator = fullpath ? " > " : " ";
        return names.join(separator);
    }

    window.EventCollectorElements = [];
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
            window.EventCollectorElements.push(data);
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

})();
