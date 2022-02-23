(function() {
    // .matches() Polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || 
        Element.prototype.webkitMatchesSelector;
    }
    
    // .closest Polyfill
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1); 
        return null;
        };
    }

    // BEGIN MICRO EVENT LIBRARY
    var eventHandlers = {};
    window.clickFxHandlers = eventHandlers;
    function decorateHandler(fn, selector) {
        return function(e) {
        e = e || window.event;
        if (selector && !e.target.matches(selector)) {
            return;
        }
        fn(e);
        };
    }

    function bind(el, eventsOrSelector, eventsOrFn, fnOrUndefined) {
        var selector = false;
        var events = eventsOrSelector;
        var fn = eventsOrFn;
        if (arguments.length === 4) {
            selector = eventsOrSelector;
            events = eventsOrFn;
            fn = fnOrUndefined;
        }
        var eventList = events.split(' ');
        var handler = decorateHandler(fn, selector);
        for (var i in eventList) {
            var event = eventList[i];;
            eventHandlers[event] = eventHandlers[event] || [];
            eventHandlers[event].push({
                'original': fn,
                'decorated': handler,
                'el': el,
                'selector': selector 
            });
            el.addEventListener(event, handler);
        }
    }

    function unbind(el, eventsOrSelector, eventsOrFn, fnOrUndefined) {
        var selector = false;
        var events = eventsOrSelector;
        var fn = eventsOrFn;
        if (arguments.length === 4) {
            selector = eventsOrSelector;
            events = eventsOrFn;
            fn = fnOrUndefined;
        }
        var eventList = events.split(' ');
        for (var i in eventList) {
            var event = eventList[i];
            if ('undefined' !== typeof eventHandlers[event]) {
                var handlers = eventHandlers[event];
                var hIndex = handlers.findIndex(function(handler) {
                    return handler.original === fn && 
                    handler.selector === selector && 
                    handler.el === el;
                });
                if (-1 !== hIndex) {
                    el.removeEventListener(event, handlers[hIndex].decorated);
                    handlers.splice(hIndex, 1);
                }
            }
        }
    }

    function bindOnce(el, eventsOrSelector, eventsOrFn, fnOrUndefined) {
        var selector = false;
        var events = eventsOrSelector;
        var fn = eventsOrFn;
        if (arguments.length === 4) {
            selector = eventsOrSelector;
            events = eventsOrFn;
            fn = fnOrUndefined;
        }
        bind(el, selector, events, fn);
        bind(el, selector, events, function oneFn() {
            unbind(el, selector, events, fn);
            unbind(el, selector, events, oneFn); 
        });
    }

    // Detect css animations
    function hasCssAnimation(el) {
        // get a collection of all children including self
        var items = [el].concat(Array.prototype.slice.call(el.getElementsByTagName("*")))
        // go through each item in reverse (faster)
        for (var i = items.length; i--;) {
            // get the applied styles
            var style = window.getComputedStyle(items[i], null);
            // read the animation duration - defaults to 0
            var animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
            // if we have any duration greater than 0, an animation exists
            if (animDuration > 0) {
                return true;
            }
        }
        return false;
    }

    // Calculate and apply click-fx
    function applyClickFx(el, clickCoords) {
        if ('string' === typeof el) {
            document.querySelectorAll(el).forEach(function (oneEl) {
            applyClickFx(oneEl, clickCoords);
            });
            
            return;
        }
        if (el.classList.contains('click-fx') || el.classList.contains('pre-click-fx') || el.classList.contains('no-click-fx')) {
            return;
        }
        var cssVars = {};
        if (clickCoords) {
            let elOffset = el.getBoundingClientRect();
            let clickOffset = {
            x: Math.round(clickCoords.x - elOffset.left),
            y: Math.round(clickCoords.y - elOffset.top)
            };
            cssVars['--click-offset-x'] = clickOffset.x + 'px';
            cssVars['--click-offset-y'] = clickOffset.y + 'px';
            cssVars['--click-max-r'] = Math.round(Math.sqrt(
            Math.pow(Math.max(clickOffset.x, el.offsetWidth - clickOffset.x), 2) + 
            Math.pow(Math.max(clickOffset.y, el.offsetHeight - clickOffset.y), 2)
            )) + 'px';
            cssVars['--click-el-w'] = el.offsetWidth + 'px';
            cssVars['--click-el-h'] = el.offsetHeight + 'px';
        }
        for (var cssVar in cssVars) {
            el.style.setProperty(cssVar, cssVars[cssVar]);
        }
        el.classList.add('pre-click-fx');
        requestAnimationFrame(function(){
            // If its ignoring reset, exit early
            if (hasCssAnimation(el)) {
            el.classList.remove('pre-click-fx');
            return;   
            }
            el.classList.add('click-fx');
            el.classList.remove('pre-click-fx');
            bindOnce(el, 'animationend webkitAnimationEnd oAnimationEnd animationcancel webkitAnimationCancel oAnimationCancel', function(e) {
            el.classList.remove('click-fx');
            for (var cssVar in cssVars) {
                el.style.removeProperty(cssVar);
            }
            if (el.matches('input:not([type=submit]):not([type=button]):not([type=reset]), textarea, select') && el === document.activeElement) {
                el.classList.add('post-click-fx');
                bind(document.querySelector('body'), 'mouseup touchend keyup', function longBlurHandler(e) {
                setTimeout(function() {
                    if (el !== document.activeElement) {
                    // No longer focused
                    el.classList.remove('post-click-fx');
                    unbind(document.querySelector('body'), 'mouseup touchend keyup', longBlurHandler);
                    }
                }, 0);
                });
            }
            });
        });
    }
    window.clickFx = function (selector) {
        var lastEvent = null;
        bind(document.querySelector('body'), selector + ',' + selector.replace(/,/g, ' *,'), 'mousedown touchstart touchend focusin', function(e) {
            var ignoreEvent = false;
            if (
                lastEvent &&
                'mousedown' === e.type && 'touchend' === lastEvent.type && 
                e.target === lastEvent.target
            ) {
                // This is a mousedown fired automatically after a touchend on same target
                ignoreEvent = true;
            } else if ('touchend' === e.type) {
                ignoreEvent = true;
            }
            lastEvent = e;
            if (ignoreEvent) {
                return;
            }
            var el = e.target;
            if (!el.matches(selector)) {
                el = el.closest(selector);
            }
            var clickCoords = false;
            if ('focusin' !== e.type) {
                // This is a click event
                
                clickCoords = {
                    x: e.clientX,
                    y: e.clientY
                };
                if (e.changedTouches && e.changedTouches[0]) {
                    clickCoords.x = e.changedTouches[0].clientX;
                    clickCoords.y = e.changedTouches[0].clientY;
                }
            }
            // Apply actual effect
            applyClickFx(el, clickCoords);
        });
    };
    bind(document, 'DOMContentLoaded', function() {
        clickFx('a, button, .btn');
    });
})();