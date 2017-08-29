# Event Collector Elements

Theese two scripts add a variable called EventCollector or EventCollectorElements in the window global object.

Trusted for Google Chrome !

The events collected are a json like this : 

```
{
  selector    : '#selector',          // the css selector path to the element
  elem        : 'span',               // the dom element
  type        : 'click',              // the type of the event (mouseover, click, etc)
  listener    : function(a, b) {},    // the function attached to the element
}
```

## Installation

Install a plugin like tampermonkey 
(https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=fr).

Add a script of your choice script.js or script.win.doc.js.

- script.js collects ALL the event listeners of all elements in the website.
- script.win.doc.js collects ALL the event listeners attached to window and document.

Be sure to configure your script in order it loads at the BEGINNING of the document loading.


## Settings

You can configure the elements you want to target in the script.js : 

```
// Set filters for sepcific elements
// ex: var filterSelector = '.exlink';
// ex: var filterType = 'mouseover';

var filterSelector = '#menu_main .menu_item .exlink';
var filterType = 'mouseover';

// True if you want to prevent the adding of the listener to the filtered element
var disableListenerForElementsCatched = true;

// True if you want to launch the debugger when an event listener is added to filtered element (the console has to be opened)
var debugMode = true;
```

## Use case

You can use theese scripts for examples : 
- debugging
- remove all the event listeners in the page
- remove the listeners of a specific element

## Thanks

@author Kévin José <hello@kevinjose.fr>
