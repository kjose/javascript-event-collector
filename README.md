# Javascript X Collector

This script adds 4 variables in the global window object : 

- EventDocumentCollector : collect all event listeners attached on document or window
- IntervalCollector, TimeoutCollector : collect all the triggers attached with setTimeout, setInterval functions
- XHRCollector : collect all the ajax request sent

Trusted for Google Chrome !

## Definition

The EventDocumentCollector events collected are a json like this : 

```
{
  elem        : 'span',               // window or document
  type        : 'click',              // the type of the event (mouseover, click, etc)
  listener    : function(a, b) {},    // the function attached to the element
}
```

The IntervalCollector|TimeoutCollector events collected are a json like this : 

```
{
  trigger       : 'span',               // the trigger registed
  fn            : 'click',              // the function attached to the trigger
  delay         : function(a, b) {},    // the delay or interval configured
}
```


The XHRCollector collected are a json like this : 

```
{
  XMLHttpRequest       : object         // The javascript object sent (with its native methods like abort())
}
```

## Installation

Install a plugin like tampermonkey 
(https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=fr).

OR 

Add the script.js at the top of your head tag.  
Be sure to configure your script in order it loads at the BEGINNING of the document loading.
  
## Methods

- window.cleanAllEvents       : clean all events of all document elements and window, document.
- window.cleanAllTimeout      : clean all setTimeout events in the page
- window.cleanAllInterval     : clean all setInterval events in the page
- window.cleanAllXHR          : abort all XHR request sent

- window.clearAll             : RESET, ABORT, CLEAN everything in the page


## How to reset the page completely

```
window.cleanAll();
document.headinnerHTML = '';
document.body.innerHTML = '';
```


## Test it ! 

```
setInterval(function() {
    console.log('Interval here :P');
}, 100);
setTimeout(function() {
    console.log('Timeout after 600ms');
}, 600);
setTimeout(function() {
    console.log('Timeout after 6000ms');
}, 6000);

setTimeout(function() {
    window.cleanAll();
}, 5000);
```


## Use case

You can use theese scripts for examples : 
- debugging
- remove all the event listeners in the page
- remove all the set intervals / set timeout
- remove all the ajax requests in the page
- remove the listeners of a specific element

## Thanks

@author Kévin José <hello@kevinjose.fr>
