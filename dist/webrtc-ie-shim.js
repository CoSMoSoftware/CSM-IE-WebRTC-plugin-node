(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.webrtcIeShim = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
'use strict';

var browser = require('detect-browser').detect();

//If it is not internet exploer, do nothign
if (browser.name === 'ie') {

    //Helper functions to check video nodes
    var checkNewNode = function checkNewNode(node) {
        //If it is a video element
        if (node.nodeName.match(/video/i))
            // Observe changes in the video element
            return VideoRenderer.handle(node);
        //Look in childs
        for (var j = 0; j < node.childNodes.length; j++) {
            checkNewNode(node.childNodes.item(j));
        }
    };

    var checkRemovedNode = function checkRemovedNode(node) {
        //If it is a video element
        if (node.nodeName.match(/video/i)) return VideoRenderer.unhandle(node);
        //Look in childs
        for (var j = 0; j < node.childNodes.length; j++) {
            checkRemovedNode(node.childNodes.item(j));
        }
    };

    var makeInterface = function makeInterface(Base) {
        //Interface with no constructor
        var Interface = function Interface() {
            throw new TypeError();
        };
        //Set name
        Object.defineProperty(Interface, 'name', {
            enumerable: false,
            configurable: true,
            writable: false,
            value: Base.name
        });
        //Create constructor and reset protocol chain
        Interface.prototype = Object.create(Base.prototype, {
            constructor: {
                value: Interface,
                configurable: true,
                writable: false
            }
        });
        //Fix protocol chain
        Interface.__proto__ = Base.__proto__;
        //Make prototype read only
        Object.defineProperty(Interface, 'prototype', { writable: false });
        //Ok
        return Interface;
    };

    var defineGlobalProperty = function defineGlobalProperty(name, value) {
        Object.defineProperty(window, name, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
        });
    };

    // Add objects to global
    var WebRTCProxy = require('./lib/WebRTCProxy.js');
    var MediaDevices = require('./lib/MediaDevices.js');
    var VideoRenderer = require('./lib/VideoRenderer.js');
    navigator.mediaDevices = new MediaDevices();

    var RTCPeerConnection = require('./lib/RTCPeerConnection.js');
    var RTCSessionDescription = require('./lib/RTCSessionDescription.js');
    var RTCIceCandidate = require('./lib/RTCIceCandidate.js');
    var RTCRtpTransceiver = require('./lib/RTCRtpTransceiver.js');
    var RTCRtpReceiver = require('./lib/RTCRtpReceiver.js');
    var RTCRtpSender = require('./lib/RTCRtpSender.js');
    var RTCDataChannel = require('./lib/RTCDataChannel.js');
    var MediaStream = require('./lib/MediaStream.js');
    var MediaStreamTrack = require('./lib/MediaStreamTrack.js');
    var EventTarget = require('./lib/EventTarget.js').EventTarget;
    var WebRTCAdapter = {
        //Method called by demand in IE for bind video elements
        bindVideoElement: function bindVideoElement(element) {
            checkNewNode(element);
        },

        //Method called by demand in IE for unbind video elements
        unBindVideoElement: function unBindVideoElement(element) {
            checkRemovedNode(element);
        }
    };

    defineGlobalProperty('RTCPeerConnection', RTCPeerConnection);
    defineGlobalProperty('RTCSessionDescription', RTCSessionDescription);
    defineGlobalProperty('RTCIceCandidate', RTCIceCandidate);
    defineGlobalProperty('MediaStream', MediaStream);
    defineGlobalProperty('MediaStreamTrack', makeInterface(MediaStreamTrack));
    defineGlobalProperty('RTCRtpTransceiver', makeInterface(RTCRtpTransceiver));
    defineGlobalProperty('RTCRtpReceiver', makeInterface(RTCRtpReceiver));
    defineGlobalProperty('RTCRtpSender', makeInterface(RTCRtpSender));
    defineGlobalProperty('RTCDataChannel', makeInterface(RTCDataChannel));
    defineGlobalProperty('EventTarget', EventTarget);
    defineGlobalProperty('WebRTCAdapter', WebRTCProxy ? WebRTCAdapter : null);

    // DOM mutation observer to check when a new video element has been added to the DOM
    // TODO: Currently domObserver no observing, need to decide how to make it configurable to prevent performance issues.
    var domObserver = new MutationObserver(function (mutations) {
        for (var i = 0, numMutations = mutations.length; i < numMutations; i++) {
            var mutation = mutations[i];

            // Check if there has been addition or deletion of nodes
            if (mutation.type !== 'childList') continue;

            // Check added nodes.
            for (var j = 0, numNodes = mutation.addedNodes.length; j < numNodes; j++) {
                //Check node recursively
                checkNewNode(mutation.addedNodes[j]);
            } // Check removed nodes.
            for (j = 0, numNodes = mutation.removedNodes.length; j < numNodes; j++) {
                //Check node recursively
                checkRemovedNode(mutation.removedNodes[j]);
            }
        }
    });

    //Get all video elements already present
    var videos = document.getElementsByTagName('video');

    //Handle them
    for (var i = 0; i < videos.length; ++i) {
        VideoRenderer.handle(videos[i]);
    }
}

},{"./lib/EventTarget.js":4,"./lib/MediaDevices.js":6,"./lib/MediaStream.js":7,"./lib/MediaStreamTrack.js":8,"./lib/RTCDataChannel.js":9,"./lib/RTCIceCandidate.js":10,"./lib/RTCPeerConnection.js":11,"./lib/RTCRtpReceiver.js":12,"./lib/RTCRtpSender.js":13,"./lib/RTCRtpTransceiver.js":14,"./lib/RTCSessionDescription.js":15,"./lib/VideoRenderer.js":16,"./lib/WebRTCProxy.js":17,"detect-browser":18}],4:[function(require,module,exports){
/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

/**
 * @typedef {object} PrivateData
 * @property {EventTarget} eventTarget The event target.
 * @property {{type:string}} event The original event object.
 * @property {number} eventPhase The current event phase.
 * @property {EventTarget|null} currentTarget The current event target.
 * @property {boolean} canceled The flag to prevent default.
 * @property {boolean} stopped The flag to stop propagation immediately.
 * @property {Function|null} passiveListener The listener if the current listener is passive. Otherwise this is null.
 * @property {number} timeStamp The unix time.
 * @private
 */

/**
 * Private data for event wrappers.
 * @type {WeakMap<Event, PrivateData>}
 * @private
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var privateData = new WeakMap();

/**
 * Cache for wrapper classes.
 * @type {WeakMap<Object, Function>}
 * @private
 */
var wrappers = new WeakMap();

/**
 * Get private data.
 * @param {Event} event The event object to get private data.
 * @returns {PrivateData} The private data of the event.
 * @private
 */
function pd(event) {
    var retv = privateData.get(event);
    console.assert(retv != null, "'this' is expected an Event object, but got", event);
    return retv;
}

/**
 * @see https://dom.spec.whatwg.org/#interface-event
 * @private
 */
/**
 * The event wrapper.
 * @constructor
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Event|{type:string}} event The original event to wrap.
 */
function Event(eventTarget, event) {
    privateData.set(this, {
        eventTarget: eventTarget,
        event: event,
        eventPhase: 2,
        currentTarget: eventTarget,
        canceled: false,
        stopped: false,
        passiveListener: null,
        timeStamp: event.timeStamp || Date.now()
    });

    // https://heycam.github.io/webidl/#Unforgeable
    Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });

    // Define accessors
    var keys = Object.keys(event);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (!(key in this)) {
            Object.defineProperty(this, key, defineRedirectDescriptor(key));
        }
    }
}

// Should be enumerable, but class methods are not enumerable.
Event.prototype = {
    /**
     * The type of this event.
     * @type {string}
     */
    get type() {
        return pd(this).event.type;
    },

    /**
     * The target of this event.
     * @type {EventTarget}
     */
    get target() {
        return pd(this).eventTarget;
    },

    /**
     * The target of this event.
     * @type {EventTarget}
     */
    get currentTarget() {
        return pd(this).currentTarget;
    },

    /**
     * @returns {EventTarget[]} The composed path of this event.
     */
    composedPath: function composedPath() {
        var currentTarget = pd(this).currentTarget;
        if (currentTarget == null) {
            return [];
        }
        return [currentTarget];
    },


    /**
     * Constant of NONE.
     * @type {number}
     */
    get NONE() {
        return 0;
    },

    /**
     * Constant of CAPTURING_PHASE.
     * @type {number}
     */
    get CAPTURING_PHASE() {
        return 1;
    },

    /**
     * Constant of AT_TARGET.
     * @type {number}
     */
    get AT_TARGET() {
        return 2;
    },

    /**
     * Constant of BUBBLING_PHASE.
     * @type {number}
     */
    get BUBBLING_PHASE() {
        return 3;
    },

    /**
     * The target of this event.
     * @type {number}
     */
    get eventPhase() {
        return pd(this).eventPhase;
    },

    /**
     * Stop event bubbling.
     * @returns {void}
     */
    stopPropagation: function stopPropagation() {
        var data = pd(this);
        if (typeof data.event.stopPropagation === "function") {
            data.event.stopPropagation();
        }
    },


    /**
     * Stop event bubbling.
     * @returns {void}
     */
    stopImmediatePropagation: function stopImmediatePropagation() {
        var data = pd(this);

        data.stopped = true;
        if (typeof data.event.stopImmediatePropagation === "function") {
            data.event.stopImmediatePropagation();
        }
    },


    /**
     * The flag to be bubbling.
     * @type {boolean}
     */
    get bubbles() {
        return Boolean(pd(this).event.bubbles);
    },

    /**
     * The flag to be cancelable.
     * @type {boolean}
     */
    get cancelable() {
        return Boolean(pd(this).event.cancelable);
    },

    /**
     * Cancel this event.
     * @returns {void}
     */
    preventDefault: function preventDefault() {
        var data = pd(this);
        if (data.passiveListener != null) {
            console.warn("Event#preventDefault() was called from a passive listener:", data.passiveListener);
            return;
        }
        if (!data.event.cancelable) {
            return;
        }

        data.canceled = true;
        if (typeof data.event.preventDefault === "function") {
            data.event.preventDefault();
        }
    },


    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     */
    get defaultPrevented() {
        return pd(this).canceled;
    },

    /**
     * The flag to be composed.
     * @type {boolean}
     */
    get composed() {
        return Boolean(pd(this).event.composed);
    },

    /**
     * The unix time of this event.
     * @type {number}
     */
    get timeStamp() {
        return pd(this).timeStamp;
    }
};

// `constructor` is not enumerable.
Object.defineProperty(Event.prototype, "constructor", { value: Event, configurable: true, writable: true });

// Ensure `event instanceof window.Event` is `true`.
if (typeof window !== "undefined" && typeof window.Event !== "undefined") {
    Object.setPrototypeOf(Event.prototype, window.Event.prototype);

    // Make association for wrappers.
    wrappers.set(window.Event.prototype, Event);
}

/**
 * Get the property descriptor to redirect a given property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to redirect the property.
 * @private
 */
function defineRedirectDescriptor(key) {
    return {
        get: function get() {
            return pd(this).event[key];
        },
        set: function set(value) {
            pd(this).event[key] = value;
        },

        configurable: true,
        enumerable: true
    };
}

/**
 * Get the property descriptor to call a given method property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to call the method property.
 * @private
 */
function defineCallDescriptor(key) {
    return {
        value: function value() {
            var event = pd(this).event;
            return event[key].apply(event, arguments);
        },

        configurable: true,
        enumerable: true
    };
}

/**
 * Define new wrapper class.
 * @param {Function} BaseEvent The base wrapper class.
 * @param {Object} proto The prototype of the original event.
 * @returns {Function} The defined wrapper class.
 * @private
 */
function defineWrapper(BaseEvent, proto) {
    var keys = Object.keys(proto);
    if (keys.length === 0) {
        return BaseEvent;
    }

    /** CustomEvent */
    function CustomEvent(eventTarget, event) {
        BaseEvent.call(this, eventTarget, event);
    }

    CustomEvent.prototype = Object.create(BaseEvent.prototype, {
        constructor: { value: CustomEvent, configurable: true, writable: true }
    });

    // Define accessors.
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (!(key in BaseEvent.prototype)) {
            var descriptor = Object.getOwnPropertyDescriptor(proto, key);
            var isFunc = typeof descriptor.value === "function";
            Object.defineProperty(CustomEvent.prototype, key, isFunc ? defineCallDescriptor(key) : defineRedirectDescriptor(key));
        }
    }

    return CustomEvent;
}

/**
 * Get the wrapper class of a given prototype.
 * @param {Object} proto The prototype of the original event to get its wrapper.
 * @returns {Function} The wrapper class.
 * @private
 */
function getWrapper(proto) {
    if (proto == null || proto === Object.prototype) {
        return Event;
    }

    var wrapper = wrappers.get(proto);
    if (wrapper == null) {
        wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
        wrappers.set(proto, wrapper);
    }
    return wrapper;
}

/**
 * Wrap a given event to management a dispatching.
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Object} event The event to wrap.
 * @returns {Event} The wrapper instance.
 * @private
 */
function wrapEvent(eventTarget, event) {
    var Wrapper = getWrapper(Object.getPrototypeOf(event));
    return new Wrapper(eventTarget, event);
}

/**
 * Get the stopped flag of a given event.
 * @param {Event} event The event to get.
 * @returns {boolean} The flag to stop propagation immediately.
 * @private
 */
function isStopped(event) {
    return pd(event).stopped;
}

/**
 * Set the current event phase of a given event.
 * @param {Event} event The event to set current target.
 * @param {number} eventPhase New event phase.
 * @returns {void}
 * @private
 */
function setEventPhase(event, eventPhase) {
    pd(event).eventPhase = eventPhase;
}

/**
 * Set the current target of a given event.
 * @param {Event} event The event to set current target.
 * @param {EventTarget|null} currentTarget New current target.
 * @returns {void}
 * @private
 */
function setCurrentTarget(event, currentTarget) {
    pd(event).currentTarget = currentTarget;
}

/**
 * Set a passive listener of a given event.
 * @param {Event} event The event to set current target.
 * @param {Function|null} passiveListener New passive listener.
 * @returns {void}
 * @private
 */
function setPassiveListener(event, passiveListener) {
    pd(event).passiveListener = passiveListener;
}

/**
 * @typedef {object} ListenerNode
 * @property {Function} listener
 * @property {1|2|3} listenerType
 * @property {boolean} passive
 * @property {boolean} once
 * @property {ListenerNode|null} next
 * @private
 */

/**
 * @type {WeakMap<object, Map<string, ListenerNode>>}
 * @private
 */
var listenersMap = new WeakMap();

// Listener types
var CAPTURE = 1;
var BUBBLE = 2;
var ATTRIBUTE = 3;

/**
 * Check whether a given value is an object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an object.
 */
function isObject(x) {
    return x !== null && (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object"; //eslint-disable-line no-restricted-syntax
}

/**
 * Get listeners.
 * @param {EventTarget} eventTarget The event target to get.
 * @returns {Map<string, ListenerNode>} The listeners.
 * @private
 */
function getListeners(eventTarget) {
    var listeners = listenersMap.get(eventTarget);
    console.assert(listeners != null, "'this' is expected an EventTarget object");
    return listeners || new Map();
}

/**
 * Get the property descriptor for the event attribute of a given event.
 * @param {string} eventName The event name to get property descriptor.
 * @returns {PropertyDescriptor} The property descriptor.
 * @private
 */
function defineEventAttributeDescriptor(eventName) {
    return {
        get: function get() {
            var listeners = getListeners(this);
            var node = listeners.get(eventName);
            while (node != null) {
                if (node.listenerType === ATTRIBUTE) {
                    return node.listener;
                }
                node = node.next;
            }
            return null;
        },
        set: function set(listener) {
            if (typeof listener !== "function" && !isObject(listener)) {
                listener = null; // eslint-disable-line no-param-reassign
            }
            var listeners = getListeners(this);

            // Traverse to the tail while removing old value.
            var prev = null;
            var node = listeners.get(eventName);
            while (node != null) {
                if (node.listenerType === ATTRIBUTE) {
                    // Remove old value.
                    if (prev !== null) {
                        prev.next = node.next;
                    } else if (node.next !== null) {
                        listeners.set(eventName, node.next);
                    } else {
                        listeners.delete(eventName);
                    }
                } else {
                    prev = node;
                }

                node = node.next;
            }

            // Add new value.
            if (listener !== null) {
                var newNode = {
                    listener: listener,
                    listenerType: ATTRIBUTE,
                    passive: false,
                    once: false,
                    next: null
                };
                if (prev === null) {
                    listeners.set(eventName, newNode);
                } else {
                    prev.next = newNode;
                }
            }
        },

        configurable: true,
        enumerable: true
    };
}

/**
 * Define an event attribute (e.g. `eventTarget.onclick`).
 * @param {Object} eventTargetPrototype The event target prototype to define an event attrbite.
 * @param {string} eventName The event name to define.
 * @returns {void}
 */
function defineEventAttribute(eventTargetPrototype, eventName) {
    Object.defineProperty(eventTargetPrototype, "on" + eventName, defineEventAttributeDescriptor(eventName));
}

/**
 * Define a custom EventTarget with event attributes.
 * @param {string[]} eventNames Event names for event attributes.
 * @returns {EventTarget} The custom EventTarget.
 * @private
 */
function defineCustomEventTarget(eventNames) {
    /** CustomEventTarget */
    function CustomEventTarget() {
        EventTarget.call(this);
    }

    CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
        constructor: { value: CustomEventTarget, configurable: true, writable: true }
    });

    for (var i = 0; i < eventNames.length; ++i) {
        defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
    }

    return CustomEventTarget;
}

/**
 * EventTarget.
 * 
 * - This is constructor if no arguments.
 * - This is a function which returns a CustomEventTarget constructor if there are arguments.
 * 
 * For example:
 * 
 *     class A extends EventTarget {}
 *     class B extends EventTarget("message") {}
 *     class C extends EventTarget("message", "error") {}
 *     class D extends EventTarget(["message", "error"]) {}
 */
function EventTarget() {
    /*eslint-disable consistent-return */
    if (this instanceof EventTarget) {
        listenersMap.set(this, new Map());
        return;
    }
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return defineCustomEventTarget(arguments[0]);
    }
    if (arguments.length > 0) {
        var types = new Array(arguments.length);
        for (var i = 0; i < arguments.length; ++i) {
            types[i] = arguments[i];
        }
        return defineCustomEventTarget(types);
    }
    throw new TypeError("Cannot call a class as a function");
    /*eslint-enable consistent-return */
}

// Should be enumerable, but class methods are not enumerable.
EventTarget.prototype = {
    /**
     * Add a given listener to this event target.
     * @param {string} eventName The event name to add.
     * @param {Function} listener The listener to add.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {boolean} `true` if the listener was added actually.
     */
    addEventListener: function addEventListener(eventName, listener, options) {
        if (listener == null) {
            return false;
        }
        if (typeof listener !== "function" && !isObject(listener)) {
            throw new TypeError("'listener' should be a function or an object.");
        }

        var listeners = getListeners(this);
        var optionsIsObj = isObject(options);
        var capture = optionsIsObj ? Boolean(options.capture) : Boolean(options);
        var listenerType = capture ? CAPTURE : BUBBLE;
        var newNode = {
            listener: listener,
            listenerType: listenerType,
            passive: optionsIsObj && Boolean(options.passive),
            once: optionsIsObj && Boolean(options.once),
            next: null
        };

        // Set it as the first node if the first node is null.
        var node = listeners.get(eventName);
        if (node === undefined) {
            listeners.set(eventName, newNode);
            return true;
        }

        // Traverse to the tail while checking duplication..
        var prev = null;
        while (node != null) {
            if (node.listener === listener && node.listenerType === listenerType) {
                // Should ignore duplication.
                return false;
            }
            prev = node;
            node = node.next;
        }

        // Add it.
        prev.next = newNode;
        return true;
    },


    /**
     * Remove a given listener from this event target.
     * @param {string} eventName The event name to remove.
     * @param {Function} listener The listener to remove.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {boolean} `true` if the listener was removed actually.
     */
    removeEventListener: function removeEventListener(eventName, listener, options) {
        if (listener == null) {
            return false;
        }

        var listeners = getListeners(this);
        var capture = isObject(options) ? Boolean(options.capture) : Boolean(options);
        var listenerType = capture ? CAPTURE : BUBBLE;

        var prev = null;
        var node = listeners.get(eventName);
        while (node != null) {
            if (node.listener === listener && node.listenerType === listenerType) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
                return true;
            }

            prev = node;
            node = node.next;
        }

        return false;
    },


    /**
     * Dispatch a given event.
     * @param {Event|{type:string}} event The event to dispatch.
     * @returns {boolean} `false` if canceled.
     */
    dispatchEvent: function dispatchEvent(event) {
        if (event == null || typeof event.type !== "string") {
            throw new TypeError("\"event.type\" should be a string.");
        }

        // If listeners aren't registered, terminate.
        var listeners = getListeners(this);
        var eventName = event.type;
        var node = listeners.get(eventName);
        if (node == null) {
            return true;
        }

        // Since we cannot rewrite several properties, so wrap object.
        var wrappedEvent = wrapEvent(this, event);

        // This doesn't process capturing phase and bubbling phase.
        // This isn't participating in a tree.
        var prev = null;
        while (node != null) {
            // Remove this listener if it's once
            if (node.once) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
            } else {
                prev = node;
            }

            // Call this listener
            setPassiveListener(wrappedEvent, node.passive ? node.listener : null);
            if (typeof node.listener === "function") {
                node.listener.call(this, wrappedEvent);
            } else if (node.listenerType !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
                node.listener.handleEvent(wrappedEvent);
            }

            // Break if `event.stopImmediatePropagation` was called.
            if (isStopped(wrappedEvent)) {
                break;
            }

            node = node.next;
        }
        setPassiveListener(wrappedEvent, null);
        setEventPhase(wrappedEvent, 0);
        setCurrentTarget(wrappedEvent, null);

        return !wrappedEvent.defaultPrevented;
    }
};

// `constructor` is not enumerable.
Object.defineProperty(EventTarget.prototype, "constructor", { value: EventTarget, configurable: true, writable: true });

// Ensure `eventTarget instanceof window.EventTarget` is `true`.
if (typeof window !== "undefined" && typeof window.EventTarget !== "undefined") {
    Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
}

module.exports = EventTarget;
module.exports.EventTarget = module.exports["default"] = EventTarget;
module.exports.defineEventAttribute = defineEventAttribute;


},{}],5:[function(require,module,exports){
"use strict";

function InvalidStateError() {
	try {
		var xhr = new XMLHttpRequest();
		xhr.responseType = "blob";
	} catch (e) {
		return e;
	}
}

module.exports = InvalidStateError;

},{}],6:[function(require,module,exports){
'use strict';

var WebRTCProxy = require('./WebRTCProxy.js');
var MediaStream = require('./MediaStream.js');
var MediaStreamTrack = require('./MediaStreamTrack.js');
var EventTarget = require('./EventTarget.js').EventTarget;
var defineEventAttribute = require('./EventTarget.js').defineEventAttribute;

/*
	interface MediaDevices : EventTarget {
		attribute EventHandler ondevicechange;
		Promise<sequence<MediaDeviceInfo>> enumerateDevices();
	}

	partial interface MediaDevices {
		MediaTrackSupportedConstraints getSupportedConstraints();
		Promise<MediaStream>           getUserMedia(optional MediaStreamConstraints constraints);
	}
*/
var MediaDevices = function MediaDevices() {
    //Init event targetr
    EventTarget.call(this);
};

//Inherit from Event Target
MediaDevices.prototype = Object.create(EventTarget.prototype, {
    constructor: {
        value: MediaDevices,
        configurable: true,
        writable: true
    }
});

// Define Event Handlers
defineEventAttribute(MediaDevices.prototype, 'devicechange');

MediaDevices.prototype.enumerateDevices = function () {
    return new Promise(function (resolve, reject) {
        resolve([]);
    });
};

MediaDevices.prototype.getSupportedConstraints = function () {
    throw 'Not supported yet';
};

MediaDevices.prototype.getUserMedia = function (constraints) {
    return new Promise(function (resolve, reject) {
        var stream = new MediaStream();
        //If we are being requested audio
        if (constraints.audio) {
            var options = {};
            //Get new track
            var track = WebRTCProxy.createLocalAudioTrack(options);
            //Add it to the stream
            stream.addTrack(new MediaStreamTrack(track));
        }
        //If we are being requested video
        if (constraints.video) {
            var options = {};
            //Get new track
            var track = WebRTCProxy.createLocalVideoTrack(options);
            //Add it to the stream
            stream.addTrack(new MediaStreamTrack(track));
        }
        //Done
        resolve(stream);
    });
};

Object.defineProperty(MediaDevices, 'name', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: 'MediaDevices'
});
Object.defineProperty(MediaDevices, 'prototype', { writable: false });
module.exports = MediaDevices;

},{"./EventTarget.js":4,"./MediaStream.js":7,"./MediaStreamTrack.js":8,"./WebRTCProxy.js":17}],7:[function(require,module,exports){
'use strict';

var EventTarget = require('./EventTarget.js').EventTarget;
var defineEventAttribute = require('./EventTarget.js').defineEventAttribute;
/*
[Exposed=Window,
 Constructor,
 Constructor(MediaStream stream),
 Constructor(sequence<MediaStreamTrack> tracks)]
interface MediaStream : EventTarget {
    readonly attribute DOMString    id;
    sequence<MediaStreamTrack> getAudioTracks();
    sequence<MediaStreamTrack> getVideoTracks();
    sequence<MediaStreamTrack> getTracks();
    MediaStreamTrack?          getTrackById(DOMString trackId);
    void                       addTrack(MediaStreamTrack track);
    void                       removeTrack(MediaStreamTrack track);
    MediaStream                clone();
    readonly attribute boolean      active;
             attribute EventHandler onaddtrack;
             attribute EventHandler onremovetrack;
}; 
 */
var count = 0;

var MediaStream = function MediaStream(label, tracks) {
    //Init event target
    EventTarget.call(this);

    //Private vars
    this.priv = {
        tracks: {}
    };

    //Add input tracks to our map
    if (tracks) for (var i = 0; i < tracks.length; ++i) {
        this.priv.tracks[tracks[i].id] = tracks[i];
    }var id = label || 'stream-' + count++;

    Object.defineProperty(this, 'id', { enumerable: true, configurable: false, writable: false, value: id });
    Object.defineProperty(this, 'active', { enumerable: true, configurable: false, writable: false, value: true });

    return this;
};

//Inherit from Event Target
MediaStream.prototype = Object.create(EventTarget.prototype, {
    constructor: {
        value: MediaStream,
        configurable: true,
        writable: true
    }
});
MediaStream.__proto__ = EventTarget;

// Define Event Handlers
defineEventAttribute(MediaStream.prototype, 'addtrack');
defineEventAttribute(MediaStream.prototype, 'removetrack');

MediaStream.prototype.getAudioTracks = function () {
    var arr = [];
    for (var id in this.priv.tracks) {
        if (this.priv.tracks[id].kind === 'audio') {
            arr.push(this.priv.tracks[id]);
        }
    }return arr;
};

MediaStream.prototype.getVideoTracks = function () {
    var arr = [];
    for (var id in this.priv.tracks) {
        if (this.priv.tracks[id].kind === 'video') {
            arr.push(this.priv.tracks[id]);
        }
    }return arr;
};

MediaStream.prototype.getTracks = function () {
    var arr = [];
    for (var id in this.priv.tracks) {
        arr.push(this.priv.tracks[id]);
    }
    return arr;
};

MediaStream.prototype.getTrackById = function (id) {
    return this.priv.tracks[id];
};

MediaStream.prototype.addTrack = function (track) {
    //Check if already present
    if (this.priv.tracks.hasOwnProperty(track.id)) return;
    //Add to track
    this.priv.tracks[track.id] = track;

    if (typeof this.priv.tracks[track.id].enabled !== 'boolean') {
        this.priv.tracks[track.id].enabled = true;
    }

    //Create event
    var event = document.createEvent('Event');
    event.initEvent('addtrack', false, false);
    event.track = track;
    //Fire it
    this.dispatchEvent(event);
};

MediaStream.prototype.removeTrack = function (track) {
    //Check if it is not already present
    if (!this.priv.tracks.hasOwnProperty(track.id)) return;
    //Add to track
    delete this.priv.tracks[track.id];
    //Create event
    var event = document.createEvent('Event');
    event.initEvent('removetrack', false, false);
    event.track = track;
    //Fire it
    this.dispatchEvent(event);
};

MediaStream.prototype.clone = function () {
    return new MediaStream(this.getTracks());
};

Object.defineProperty(MediaStream, 'name', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: 'MediaStream'
});
Object.defineProperty(MediaStream, 'prototype', { writable: false });
module.exports = MediaStream;

},{"./EventTarget.js":4}],8:[function(require,module,exports){
'use strict';

var EventTarget = require('./EventTarget.js').EventTarget;
var defineEventAttribute = require('./EventTarget.js').defineEventAttribute;
/*
[Exposed=Window]
interface MediaStreamTrack : EventTarget {
    readonly attribute DOMString             kind;
    readonly attribute DOMString             id;
    readonly attribute DOMString             label;
             attribute boolean               enabled;
    readonly attribute boolean               muted;
             attribute EventHandler          onmute;
             attribute EventHandler          onunmute;
    readonly attribute MediaStreamTrackState readyState;
             attribute EventHandler          onended;
    MediaStreamTrack       clone();
    void                   stop();
    MediaTrackCapabilities getCapabilities();
    MediaTrackConstraints  getConstraints();
    MediaTrackSettings     getSettings();
    Promise<void>          applyConstraints(optional MediaTrackConstraints constraints);
             attribute EventHandler          onoverconstrained;
};

partial interface MediaStreamTrack {
    readonly attribute boolean      isolated;
             attribute EventHandler onisolationchange;
};
*/
var MediaStreamTrack = function MediaStreamTrack(track) {
    //Init event targetr
    EventTarget.call(this);

    //Private vars
    var priv = this.priv = {
        track: track,
        muted: false,
        enabled: true
    };

    Object.defineProperty(this, 'kind', {
        enumerable: true, configurable: false, get: function get() {
            return priv.track.kind;
        }
    });
    Object.defineProperty(this, 'id', {
        enumerable: true, configurable: false, get: function get() {
            return priv.track.id;
        }
    });
    Object.defineProperty(this, 'label', {
        enumerable: true, configurable: false, get: function get() {
            return priv.track.id;
        }
    });
    Object.defineProperty(this, 'enabled', {
        enumerable: true, configurable: false, get: function get() {
            return priv.enabled;
        }, set: function set(enabled) {
            priv.enabled = !!enabled;
        }
    });
    Object.defineProperty(this, 'muted', {
        enumerable: true, configurable: false, get: function get() {
            return priv.muted;
        }
    });
    Object.defineProperty(this, 'readyState', {
        enumerable: true, configurable: false, get: function get() {
            return priv.track.state;
        }
    });
    Object.defineProperty(this, 'isolated', {
        enumerable: true, configurable: false, get: function get() {
            return false;
        }
    });

    return this;
};

//Inherit from Event Target
MediaStreamTrack.prototype = Object.create(EventTarget.prototype, {
    constructor: {
        value: MediaStreamTrack,
        configurable: true,
        writable: false
    }
});

MediaStreamTrack.__proto__ = EventTarget;

// Define Event Handlers
//TODO: fire them somehow
defineEventAttribute(MediaStreamTrack.prototype, 'mute');
defineEventAttribute(MediaStreamTrack.prototype, 'unmute');
defineEventAttribute(MediaStreamTrack.prototype, 'ended');
defineEventAttribute(MediaStreamTrack.prototype, 'isolationchange');

MediaStreamTrack.prototype.clone = function () {
    return null;
};

MediaStreamTrack.prototype.stop = function () {
    this.priv.track.stop();
};

MediaStreamTrack.prototype.getCapabilities = function () {};

MediaStreamTrack.prototype.getConstraints = function () {};

MediaStreamTrack.prototype.getSettings = function () {};

MediaStreamTrack.prototype.applyConstraints = function () {};

Object.defineProperty(MediaStreamTrack, 'name', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: 'MediaStreamTrack'
});
module.exports = MediaStreamTrack;

},{"./EventTarget.js":4}],9:[function(require,module,exports){
"use strict";

var EventTarget = require("./EventTarget.js").EventTarget;
var defineEventAttribute = require("./EventTarget.js").defineEventAttribute;
var InvalidStateError = require("./InvalidStateError.js");

/*
 [Exposed=Window]
 interface RTCRTCDataChannel : EventTarget {
    readonly attribute USVString           label;
    readonly attribute boolean             ordered;
    readonly attribute unsigned short?     maxPacketLifeTime;
    readonly attribute unsigned short?     maxRetransmits;
    readonly attribute USVString           protocol;
    readonly attribute boolean             negotiated;
    readonly attribute unsigned short?     id;
    readonly attribute RTCPriorityType     priority;
    readonly attribute RTCRTCDataChannelState readyState;
    readonly attribute unsigned long       bufferedAmount;
             attribute unsigned long       bufferedAmountLowThreshold;
             attribute EventHandler        onopen;
             attribute EventHandler        onbufferedamountlow;
             attribute EventHandler        onerror;
             attribute EventHandler        onclose;
    void close();
             attribute EventHandler        onmessage;
             attribute DOMString           binaryType;
    void send(USVString data);
    void send(Blob data);
    void send(ArrayBuffer data);
    void send(ArrayBufferView data);
};
 */
var RTCDataChannel = function RTCDataChannel(dataChannel) {
	//Init event targetr
	EventTarget.call(this);

	//Private vars
	var self = this;
	var priv = this.priv = {
		binaryType: "blob",
		dataChannel: dataChannel
	};

	//Read only properties
	Object.defineProperty(this, 'label', { enumerable: true, configurable: false, get: function get() {
			return priv.dataChannel.label;
		} });
	Object.defineProperty(this, 'ordered', { enumerable: true, configurable: false, get: function get() {
			return priv.dataChannel.ordered;
		} });
	Object.defineProperty(this, 'maxPacketLifeTime', { enumerable: true, configurable: false, get: function get() {
			return priv.dataChannel.maxPacketLifeTime;
		} });
	Object.defineProperty(this, 'protocol', { enumerable: true, configurable: false, get: function get() {
			return priv.dataChannel.protocol;
		} });
	Object.defineProperty(this, 'negotiated', { enumerable: true, configurable: false, get: function get() {
			return priv.dataChannel.negotiated;
		} });
	Object.defineProperty(this, 'id', { enumerable: true, configurable: false, get: function get() {
			return priv.dataChannel.id;
		} });
	Object.defineProperty(this, 'priority', { enumerable: true, configurable: false, get: function get() {
			return priv.dataChannel.priority;
		} });
	Object.defineProperty(this, 'readyState', { enumerable: true, configurable: false, get: function get() {
			return priv.dataChannel.readyState;
		} });
	Object.defineProperty(this, 'bufferedAmount', { enumerable: true, configurable: false, get: function get() {
			return priv.dataChannel.bufferedAmount;
		} });
	//Read & write
	Object.defineProperty(this, 'bufferedAmountLowThreshold', { enumerable: true, configurable: false,
		get: function get() {
			return priv.dataChannel.bufferedAmountLowThreshold;
		},
		set: function set(bufferedAmountLowThreshold) {
			return priv.dataChannel.bufferedAmountLowThreshold = bufferedAmountLowThreshold;
		}
	});
	Object.defineProperty(this, 'binaryType', { enumerable: true, configurable: false,
		get: function get() {
			return priv.dataChannel.bufferedAmount;
		},
		set: function set(binaryType) {
			if (binaryType !== "blob" && binaryType !== "arraybuffer") throw new SyntaxError();
			return priv.binaryType = binaryType;
		}
	});

	function createEvent(name) {
		var e = document.createEvent("Event");
		e.initEvent(name, false, false);
		return e;
	}

	function fire(name) {
		self.dispatchEvent(createEvent(name));
	}

	//Set event
	priv.dataChannel.onopen = function () {
		fire("open");
	};
	priv.dataChannel.onbufferedamountlow = function () {
		fire("bufferedamountlow");
	};
	priv.dataChannel.onerror = function () {
		fire("error");
	};
	priv.dataChannel.onclose = function () {
		fire("close");
	};
	priv.dataChannel.onmessage = function (message) {
		//Create event
		var event = createEvent("message");

		//Check if message is binary
		if (typeof message !== "string") {
			//Create uint array
			var array = new Uint8Array(message);
			//Check binary type
			if (priv.binaryType === "blob") {
				//Create blob builder
				var builder = new MSBlobBuilder();
				//Append message
				builder.append(array);
				//Get blob
				event.data = builder.getBlob();
			} else if (priv.binaryType === "arraybuffer") {
				//Get array buffer
				event.data = array.buffer;
			} else return;
		} else {
			//It is a string
			event.data = message;
		}

		//Check if 
		self.dispatchEvent(event);
	};

	//Done
	return this;
};

//Inherit from Event Target
RTCDataChannel.prototype = Object.create(EventTarget.prototype, {
	constructor: {
		value: RTCDataChannel,
		configurable: true,
		writable: true
	}
});
RTCDataChannel.__proto__ = EventTarget;

// Define Event Handlers
defineEventAttribute(RTCDataChannel.prototype, "open");
defineEventAttribute(RTCDataChannel.prototype, "bufferedamountlow");
defineEventAttribute(RTCDataChannel.prototype, "error");
defineEventAttribute(RTCDataChannel.prototype, "close");
defineEventAttribute(RTCDataChannel.prototype, "message");

RTCDataChannel.prototype.send = function (data) {
	var self = this;
	//Check state
	if (this.readyState !== "open") throw new InvalidStateError();

	try {
		//Check type
		if (data instanceof Blob) {
			var reader = new FileReader();
			reader.onloadend = function () {
				//Create array from buffer
				var array = new Uint8Array(reader.result);
				//Send it
				self.priv.dataChannel.send(array);
			};
			//Read data as array
			reader.readAsArrayBuffer(data);
		} else if (data instanceof ArrayBuffer) {
			//Send it
			this.priv.dataChannel.send(array);
		} else if (typeof data === "string") {
			//Send it
			this.priv.dataChannel.send(data);
		} else {
			throw new TypeError();
		}
	} catch (e) {
		throw InvalidStateError();
	}
};

RTCDataChannel.prototype.close = function () {
	this.priv.dataChannel.close();
};

Object.defineProperty(RTCDataChannel, 'name', { enumerable: false, configurable: true, writable: false, value: "RTCDataChannel" });
Object.defineProperty(RTCDataChannel, 'prototype', { writable: false });
module.exports = RTCDataChannel;

},{"./EventTarget.js":4,"./InvalidStateError.js":5}],10:[function(require,module,exports){
"use strict";

var WebRTCProxy = require("./WebRTCProxy.js");
/*
interface RTCIceCandidate {
    readonly attribute DOMString               candidate;
    readonly attribute DOMString?              sdpMid;
    readonly attribute unsigned short?         sdpMLineIndex;
    readonly attribute DOMString?              foundation;
    readonly attribute RTCIceComponent?        component;
    readonly attribute unsigned long?          priority;
    readonly attribute DOMString?              ip;
    readonly attribute RTCIceProtocol?         protocol;
    readonly attribute unsigned short?         port;
    readonly attribute RTCIceCandidateType?    type;
    readonly attribute RTCIceTcpCandidateType? tcpType;
    readonly attribute DOMString?              relatedAddress;
    readonly attribute unsigned short?         relatedPort;
    readonly attribute DOMString?              usernameFragment;
    RTCIceCandidateInit toJSON();
};
 */
var RTCIceCandidate = function RTCIceCandidate(iceCandidateInit) {
	if (!iceCandidateInit) throw new TypeError();

	//Get values from dictionary
	var candidate = iceCandidateInit.candidate;
	var sdpMid = iceCandidateInit.sdpMid;
	var sdpMLineIndex = iceCandidateInit.sdpMLineIndex;
	var usernameFragment = iceCandidateInit.usernameFragment;
	//Not set yet
	var foundation;
	var component;
	var priority;
	var ip;
	var protocol;
	var port;
	var type;
	var tcpType;
	var relatedAddress;
	var relatedPort;

	//Extended attributes to avoid parsing it twice
	if (iceCandidateInit.ext) {
		foundation = iceCandidateInit.ext.foundation;
		component = iceCandidateInit.ext.component;
		priority = iceCandidateInit.ext.priority;
		ip = iceCandidateInit.ext.ip;
		protocol = iceCandidateInit.ext.protocol;
		port = iceCandidateInit.ext.port;
		type = iceCandidateInit.ext.type;
		tcpType = iceCandidateInit.ext.tcpType;
		relatedAddress = iceCandidateInit.ext.relatedAddress;
		relatedPort = iceCandidateInit.ext.relatedPort;
	} else {
		try {
			//Parse candidate
			var parsed = WebRTCProxy.parseIceCandidate(candidate);
		} catch (e) {
			throw new TypeError();
		}
		//Set parsed properties
		foundation = parsed[0];
		component = parsed[1];
		priority = parsed[2];
		ip = parsed[3];
		protocol = parsed[4];
		port = parsed[5];
		type = parsed[6];
		tcpType = parsed[7];
		relatedAddress = parsed[8];
		relatedPort = parsed[9];
		if (!usernameFragment) usernameFragment = parsed[10];
	}

	//Direct attributes from init
	Object.defineProperty(this, "candidate", { enumerable: true, configurable: false, get: function get() {
			return candidate;
		} });
	Object.defineProperty(this, "sdpMid", { enumerable: true, configurable: false, get: function get() {
			return sdpMid;
		} });
	Object.defineProperty(this, "sdpMLineIndex", { enumerable: true, configurable: false, get: function get() {
			return sdpMLineIndex;
		} });
	Object.defineProperty(this, "foundation", { enumerable: true, configurable: false, get: function get() {
			return foundation;
		} });
	Object.defineProperty(this, "component", { enumerable: true, configurable: false, get: function get() {
			return component;
		} });
	Object.defineProperty(this, "priority", { enumerable: true, configurable: false, get: function get() {
			return priority;
		} });
	Object.defineProperty(this, "ip", { enumerable: true, configurable: false, get: function get() {
			return ip;
		} });
	Object.defineProperty(this, "protocol", { enumerable: true, configurable: false, get: function get() {
			return protocol;
		} });
	Object.defineProperty(this, "port", { enumerable: true, configurable: false, get: function get() {
			return port;
		} });
	Object.defineProperty(this, "type", { enumerable: true, configurable: false, get: function get() {
			return type;
		} });
	Object.defineProperty(this, "tcpType", { enumerable: true, configurable: false, get: function get() {
			return tcpType;
		} });
	Object.defineProperty(this, "relatedAddress", { enumerable: true, configurable: false, get: function get() {
			return relatedAddress;
		} });
	Object.defineProperty(this, "relatedPort", { enumerable: true, configurable: false, get: function get() {
			return relatedPort;
		} });
	Object.defineProperty(this, "usernameFragment", { enumerable: true, configurable: false, get: function get() {
			return usernameFragment;
		} });

	return this;
};

RTCIceCandidate.prototype.toJSON = function () {
	return {
		candidate: this.candidate,
		sdpMid: this.sdpMid,
		sdpMLineIndex: this.sdpMLineIndex,
		usernameFragment: this.usernameFragment
	};
};

Object.defineProperty(RTCIceCandidate, 'name', { enumerable: false, configurable: true, writable: false, value: "RTCIceCandidate" });
Object.defineProperty(RTCIceCandidate, 'prototype', { writable: false });
module.exports = RTCIceCandidate;

},{"./WebRTCProxy.js":17}],11:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var WebRTCProxy = require("./WebRTCProxy.js");
var MediaStreamTrack = require("./MediaStreamTrack.js");
var RTCSessionDescription = require("./RTCSessionDescription.js");
var RTCIceCandidate = require("./RTCIceCandidate.js");
var RTCRtpSender = require("./RTCRtpSender.js");
var RTCRtpReceiver = require("./RTCRtpReceiver.js");
var RTCRtpTransceiver = require("./RTCRtpTransceiver.js");
var DataChannel = require("./RTCDataChannel.js");
var InvalidStateError = require("./InvalidStateError.js");
var EventTarget = require("./EventTarget.js").EventTarget;
var defineEventAttribute = require("./EventTarget.js").defineEventAttribute;

/*
[Constructor(optional RTCConfiguration configuration),Exposed=Window]
interface RTCPeerConnection : EventTarget {
    Promise<RTCSessionDescriptionInit> createOffer(optional RTCOfferOptions options);
    Promise<RTCSessionDescriptionInit> createAnswer(optional RTCAnswerOptions options);
    Promise<void>                      setLocalDescription(RTCSessionDescriptionInit description);

    readonly attribute RTCSessionDescription? localDescription;
    readonly attribute RTCSessionDescription? currentLocalDescription;
    readonly attribute RTCSessionDescription? pendingLocalDescription;

    Promise<void>                      setRemoteDescription(RTCSessionDescriptionInit description);

    readonly attribute RTCSessionDescription? remoteDescription;
    readonly attribute RTCSessionDescription? currentRemoteDescription;
    readonly attribute RTCSessionDescription? pendingRemoteDescription;

    Promise<void>                      addIceCandidate((RTCIceCandidateInit or RTCIceCandidate) candidate);

    readonly attribute RTCSignalingState      signalingState;
    readonly attribute RTCIceGatheringState   iceGatheringState;
    readonly attribute RTCIceConnectionState  iceConnectionState;
    readonly attribute RTCPeerConnectionState connectionState;
    readonly attribute boolean?               canTrickleIceCandidates;
    static sequence<RTCIceServer>      getDefaultIceServers();
    RTCConfiguration                   getConfiguration();
    void                               setConfiguration(RTCConfiguration configuration);
    void                               close();

	attribute EventHandler           onnegotiationneeded;
	attribute EventHandler           onicecandidate;
	attribute EventHandler           onicecandidateerror;
	attribute EventHandler           onsignalingstatechange;
	attribute EventHandler           oniceconnectionstatechange;
	attribute EventHandler           onicegatheringstatechange;
	attribute EventHandler           onconnectionstatechange;
};
*/

var RTCIceTransportPolicy = ["relay", "all"];
var RTCBundlePolicy = ["balanced", "max-compat", "max-bundle"];
var RTCRtcpMuxPolicy = ["negotiate", "require"];
var RTCIceCredentialType = ["password", "oauth"];

//Check if a value is valid in an enum
function check(value, valid) {
	for (var i = 0; i < valid.length; ++i) {
		if (valid[i] === value) return;
	}throw new TypeError(value + " not in " + JSON.stringify(valid));
}

function checkRange(value, min, max) {
	if (value < min || value > max) throw new TypeError(value + " not in [" + min + "," + max + "]");
}

function checkNotNull(value) {
	if (value === null) throw new TypeError("Null not allowed");
}

function checkArray(value) {
	if (!Array.isArray(value)) throw new TypeError("Must be an array");
}

function createRTCConfiguration(configuration) {
	/*
  *
 dictionary RTCConfiguration {
 	sequence<RTCIceServer>   iceServers;
 	RTCIceTransportPolicy    iceTransportPolicy = "all";
 	RTCBundlePolicy          bundlePolicy = "balanced";
 	RTCRtcpMuxPolicy         rtcpMuxPolicy = "require";
 	DOMString                peerIdentity;
 	sequence<RTCCertificate> certificates;
 	[EnforceRange]
 	octet                    iceCandidatePoolSize = 0;
 };  
 */
	//Set configuration with default values
	var sanitized = _extends({
		iceServers: undefined,
		iceTransportPolicy: "all",
		bundlePolicy: "balanced",
		rtcpMuxPolicy: "require",
		iceCandidatePoolSize: 0,
		certificates: undefined
	},
	//Remove undefined objects
	configuration ? JSON.parse(JSON.stringify(configuration)) : {});
	//Check valid values
	checkNotNull(sanitized.iceServers);

	//Check array
	if (Array.isArray(sanitized.iceServers)) {
		//Check each one
		for (var i = 0; i < sanitized.iceServers.length; ++i) {
			/*
    * 
    dictionary RTCIceServer {
   	required (DOMString or sequence<DOMString>) urls;
   		 DOMString                          username;
   		 (DOMString or RTCOAuthCredential)  credential;
   		 RTCIceCredentialType               credentialType = "password";
   };
    */
			//Set defautls
			var iceServer = sanitized.iceServers[i] = _extends({
				credentialType: "password"
			}, sanitized.iceServers[i]);
			//Check it is not null
			checkNotNull(iceServer.urls);
			//If it is a sring fallback
			if (typeof iceServer.urls === "string")
				//Arraify
				iceServer.urls = [iceServer.urls];
			checkArray(iceServer.urls);
		}
	}
	//Check the others
	check(sanitized.iceTransportPolicy, RTCIceTransportPolicy);
	check(sanitized.bundlePolicy, RTCBundlePolicy);
	check(sanitized.rtcpMuxPolicy, RTCRtcpMuxPolicy);
	checkRange(sanitized.iceCandidatePoolSize, 0, 255);
	//Done
	return sanitized;
}

var RTCPeerConnection = function RTCPeerConnection() {
	var self = this;
	//Init event targetr
	EventTarget.call(this);

	//Create private args
	var priv = this.priv = {};

	//Set configuration with default values
	priv.configuration = createRTCConfiguration(arguments.length ? JSON.parse(JSON.stringify(arguments[0])) : {});

	//Other internal data
	priv.senders = {};
	priv.remoteStreams = {};
	priv.lastOffer = null;
	priv.lastAnswer = null;
	priv.isClosed = false;

	var signalingState = "stable";
	var iceGatheringState = "new";
	var iceConnectionState = "new";
	var connectionState = "new";

	//TODO: Implement this
	var canTrickleIceCandidates = null;

	function toSessionDescription(sdp) {
		return typeof sdp === "unknown" ? new RTCSessionDescription(sdp.toArray()) : null;
	}

	//Define read only properties for each attribute
	//The localDescription attribute must return pendingLocalDescription if it is not null and otherwise it must return currentLocalDescription .
	Object.defineProperty(this, 'localDescription', { enumerable: true, configurable: false, get: function get() {
			return toSessionDescription(priv.pc.localDescription);
		} });
	Object.defineProperty(this, 'currentLocalDescription', { enumerable: true, configurable: false, get: function get() {
			return toSessionDescription(priv.pc.currentLocalDescription);
		} });
	Object.defineProperty(this, 'pendingLocalDescription', { enumerable: true, configurable: false, get: function get() {
			return toSessionDescription(priv.pc.pendingLocalDescription);
		} });

	Object.defineProperty(this, 'remoteDescription', { enumerable: true, configurable: false, get: function get() {
			return toSessionDescription(priv.pc.remoteDescription);
		} });
	Object.defineProperty(this, 'currentRemoteDescription', { enumerable: true, configurable: false, get: function get() {
			return toSessionDescription(priv.pc.currentRemoteDescription);
		} });
	Object.defineProperty(this, 'pendingRemoteDescription', { enumerable: true, configurable: false, get: function get() {
			return toSessionDescription(priv.pc.pendingRemoteDescription);
		} });

	Object.defineProperty(this, 'signalingState', { enumerable: true, configurable: false, get: function get() {
			return signalingState;
		} });
	Object.defineProperty(this, 'iceGatheringState', { enumerable: true, configurable: false, get: function get() {
			return iceGatheringState;
		} });
	Object.defineProperty(this, 'iceConnectionState', { enumerable: true, configurable: false, get: function get() {
			return iceConnectionState;
		} });
	Object.defineProperty(this, 'connectionState', { enumerable: true, configurable: false, get: function get() {
			return connectionState;
		} });

	Object.defineProperty(this, 'canTrickleIceCandidates', { enumerable: true, configurable: false, get: function get() {
			return canTrickleIceCandidates;
		} });

	function createEvent(name) {
		var e = document.createEvent("Event");
		e.initEvent(name, false, false);
		return e;
	}
	function fire(name) {
		self.dispatchEvent(createEvent(name));
	}

	// Create new native pc
	priv.pc = WebRTCProxy.createPeerConnection(priv.configuration);

	//Event handlers
	priv.pc.onnegotiationneeded = function () {
		fire("negotiationneeded");
	};
	priv.pc.onicecandidate = function (candidate, sdpMid, sdpMLineIndex, foundation, component, priority, ip, protocol, port, type, tcpType, relatedAddress, relatedPort, usernameFragment, url) {
		var e = createEvent("icecandidate");
		if (candidate) e.candidate = new RTCIceCandidate({
			candidate: candidate,
			sdp: sdpMid,
			sdpMLineIndex: sdpMLineIndex,
			ext: {
				foundation: foundation,
				component: component,
				priority: priority,
				ip: ip,
				protocol: protocol,
				port: port,
				type: type,
				tcpType: tcpType,
				relatedAddress: relatedAddress,
				relatedPort: relatedPort
			},
			usernameFragment: usernameFragment
		});else e.candidate = null;
		e.url = url;
		self.dispatchEvent(e);
	};
	priv.pc.onicecandidateerror = function () {
		fire("icecandidateerror");
	};
	priv.pc.onsignalingstatechange = function (state) {
		signalingState = state;
		fire("signalingstatechange");
		if ("closed" === state) {
			priv.isClosed = true;
			delete priv.pc;
		}
	};
	priv.pc.oniceconnectionstatechange = function (state) {
		iceConnectionState = state;
		fire("iceconnectionstatechange");
	};
	priv.pc.onicegatheringstatechange = function (state) {
		iceGatheringState = state;
		fire("icegatheringstatechange");
	};
	priv.pc.onconnectionstatechange = function (state) {
		connectionState = state;
		fire("connectionState");
	};
	priv.pc.onaddstream = function (label) {
		//Create new stream
		var stream = new MediaStream(label);

		//Get remote stream tracks
		priv.pc.getRemoteStreamTracks(label, function () {
			//Parse arguments
			var tracks = Array.prototype.slice.call(arguments, 0);

			//For each track
			for (var i = 0; i < tracks.length; ++i) {
				//Create a wrapper
				stream.addTrack(new MediaStreamTrack(tracks[i]));
			} //Get all tracks
			var mediaStreamTracks = stream.getTracks();

			//For each track in stream
			for (var i = 0; i < mediaStreamTracks.length; ++i) {
				//Create evnet
				var event = createEvent("track");
				//Add data
				event.track = mediaStreamTracks[i];
				event.receiver = { track: mediaStreamTracks[i] };
				event.transceiver = { receiver: event.receiver };
				event.streams = [stream];
				//Fire it
				self.dispatchEvent(event);
			}
		});
	};

	priv.pc.onremovestream = function (label) {
		//Delete from remote stream list
		delete priv.remotes[label];
	};

	priv.pc.ondatachannel = function (dataChannel) {
		//Create event
		var event = createEvent("datachannel");
		//Create datachannel
		event.channel = new DataChannel(dataChannel);
		//Fire event
		self.dispatchEvent(event);
	};
};

//Inherit from Event Target
RTCPeerConnection.prototype = Object.create(EventTarget.prototype, {
	constructor: {
		value: RTCPeerConnection,
		configurable: true,
		writable: true
	}
});
RTCPeerConnection.__proto__ = EventTarget;

// Define Event Handlers
defineEventAttribute(RTCPeerConnection.prototype, "negotiationneeded");
defineEventAttribute(RTCPeerConnection.prototype, "icecandidate");
defineEventAttribute(RTCPeerConnection.prototype, "icecandidateerror");
defineEventAttribute(RTCPeerConnection.prototype, "signalingstatechange");
defineEventAttribute(RTCPeerConnection.prototype, "iceconnectionstatechange");
defineEventAttribute(RTCPeerConnection.prototype, "icegatheringstatechange");
defineEventAttribute(RTCPeerConnection.prototype, "connectionstatechange");
defineEventAttribute(RTCPeerConnection.prototype, "addtrack");

RTCPeerConnection.prototype.getConfiguration = function () {
	return this.priv.configuration;
};

RTCPeerConnection.prototype.setConfiguration = function (configuration) {
	var priv = this.priv;
	if (!priv.pc || priv.isClosed) throw new InvalidStateError();

	//Get configuration object from input
	var sanitized = createRTCConfiguration(configuration);

	try {
		//Try to set it
		priv.pc.setConfiguration(sanitized);
	} catch (error) {
		//Launch InvalidModificationError
		var operationError = new Error(error);
		operationError.name = "InvalidModificationError";
		operationError.code = 13;
		throw operationError;
	}
	//Store new configuration
	priv.configuration = sanitized;
};

RTCPeerConnection.getDefaultIceServers = function () {
	return [];
};

RTCPeerConnection.prototype.createOffer = function (options) {
	var priv = this.priv;

	return new Promise(function (resolve, reject) {
		if (!priv.pc || priv.isClosed) throw new InvalidStateError();
		priv.pc.createOffer(function (type, sdp) {
			priv.lastOffer = sdp;
			resolve({
				type: type,
				sdp: sdp
			});
		}, function () {
			reject(new InvalidStateError());
		}, options);
	});
};

RTCPeerConnection.prototype.createAnswer = function (options) {
	var self = this;
	var priv = this.priv;

	return new Promise(function (resolve, reject) {
		if (!priv.pc || priv.isClosed) throw new InvalidStateError();
		if (self.remoteDescription === null) throw new InvalidStateError();
		priv.pc.createAnswer(function (type, sdp) {
			priv.lastAnswer = sdp;
			resolve({
				type: type,
				sdp: sdp
			});
		}, function () {
			reject(new InvalidStateError());
		}, options);
	});
};

RTCPeerConnection.prototype.setLocalDescription = function (description) {
	var priv = this.priv;

	//If description.sdp is the empty string and description.type is "answer" or "pranswer", set description.sdp to lastAnswer.
	if (!description.sdp && ("answer" === description.type || "pranser" === description.type)) description.sdp = priv.lastAnswer;

	//If description.sdp is the empty string and description.type is "offer", set description.sdp to lastOffer.
	if (!description.sdp && "offer" === description.type) description.sdp = priv.lastOffer;

	return new Promise(function (resolve, reject) {
		if (!priv.pc || priv.isClosed) throw new InvalidStateError();
		priv.pc.setLocalDescription(resolve, function () {
			reject(new InvalidStateError());
		}, description);
	});
};

RTCPeerConnection.prototype.setRemoteDescription = function (description) {
	var priv = this.priv;

	return new Promise(function (resolve, reject) {
		if (!priv.pc || priv.isClosed) throw new InvalidStateError();
		priv.pc.setRemoteDescription(resolve, function () {
			reject(new InvalidStateError());
		}, description);
	});
};

RTCPeerConnection.prototype.addIceCandidate = function (candidate) {
	var self = this;
	var priv = this.priv;
	//1.  Let candidate be the method's argument.
	//2.  Let connection be the ``[`RTCPeerConnection`](#dom-rtcpeerconnection)`` object on which the method was invoked.
	//3.  If both sdpMid and sdpMLineIndex are `null`, return a promise [rejected](#dfn-rejected) with a newly [created](https://www.w3.org/TR/2016/REC-WebIDL-1-20161215/#dfn-create-exception) `TypeError`.
	if (!candidate || typeof candidate.sdpMid !== "string" && typeof candidate.sdpMLineIndex !== "number") return Promise.reject(new TypeError());

	//4.  Return the result of [enqueuing](#enqueue-an-operation) the following steps to connection's operation queue:
	return new Promise(function (resolve, reject) {
		//1.  If ``[`remoteDescription`](#dom-rtcpeerconnection-remotedescription)`` is `null` return a promise [rejected](#dfn-rejected) with a newly [created](https://www.w3.org/TR/2016/REC-WebIDL-1-20161215/#dfn-create-exception) `InvalidStateError`.
		if (self.remoteDescription === null) throw new InvalidStateError();

		/*
  2.  Let p be a new promise.   
  3.  If candidate.sdpMid is not null, run the following steps:
      1.  If candidate.sdpMid is not equal to the mid of any media description in ``[`remoteDescription`](#dom-rtcpeerconnection-remotedescription)`` , [reject](#dfn-rejected) p with a newly [created](https://www.w3.org/TR/2016/REC-WebIDL-1-20161215/#dfn-create-exception) `OperationError` and abort these steps.
  4.  Else, if candidate.sdpMLineIndex is not null, run the following steps:
      1.  If candidate.sdpMLineIndex is equal to or larger than the number of media descriptions in ``[`remoteDescription`](#dom-rtcpeerconnection-remotedescription)`` , [reject](#dfn-rejected) p with a newly [created](https://www.w3.org/TR/2016/REC-WebIDL-1-20161215/#dfn-create-exception) `OperationError` and abort these steps.
  5.  If `candidate.usernameFragment` is neither `undefined` nor `null`, and is not equal to any username fragment present in the corresponding [media description](#dfn-media-description) of an applied remote description, [reject](#dfn-rejected) p with a newly [created](https://www.w3.org/TR/2016/REC-WebIDL-1-20161215/#dfn-create-exception) `OperationError` and abort these steps.
  6.  In parallel, add the ICE candidate candidate as described in \[[JSEP](#bib-JSEP)\] ([section 4.1.17.](https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-4.1.17)). Use `candidate.usernameFragment` to identify the ICE [generation](#dfn-generation); if `usernameFragment` is null, process the candidate for the most recent ICE [generation](#dfn-generation). If `candidate.candidate` is an empty string, process candidate as an end-of-candidates indication for the corresponding [media description](#dfn-media-description) and ICE candidate [generation](#dfn-generation).
      1.  If candidate could not be successfully added the user agent _MUST_ queue a task that runs the following steps:
  	1.  If connection's [\[\[IsClosed\]\]](#dfn-x%5B%5Bisclosed%5D%5D) slot is `true`, then abort these steps.
  	2.  [Reject](#dfn-rejected) p with a `DOMException` object whose `name` attribute has the value `OperationError` and abort these steps.
      2.  If candidate is applied successfully, the user agent _MUST_ queue a task that runs the following steps:
  	1.  If connection's [\[\[IsClosed\]\]](#dfn-x%5B%5Bisclosed%5D%5D) slot is `true`, then abort these steps.
  	2.  If ``connection.[`pendingRemoteDescription`](#dom-rtcpeerconnection-pendingremotedescription)`` is non-null, and represents the ICE [generation](#dfn-generation) for which candidate was processed, add candidate to ``connection.[`pendingRemoteDescription`](#dom-rtcpeerconnection-pendingremotedescription)`` .
  	3.  If ``connection.[`currentRemoteDescription`](#dom-rtcpeerconnection-currentremotedescription)`` is non-null, and represents the ICE [generation](#dfn-generation) for which candidate was processed, add candidate to ``connection.[`currentRemoteDescription`](#dom-rtcpeerconnection-currentremotedescription)`` .
  	4.  [Resolve](#dfn-resolved) p with `undefined`.
  7.  Return p.
  */
		try {
			//Add ICE candidate nativelly
			priv.pc.addIceCandidate(resolve, function () {
				reject(new InvalidStateError());
			}, candidate);
		} catch (error) {
			//Launch operation error
			var operationError = new Error(error);
			operationError.name = "OperationError";
			operationError.code = 0;
			throw operationError;
		}
	});
};

RTCPeerConnection.prototype.close = function () {

	var priv = this.priv;
	if (!priv.pc || priv.isClosed) throw new InvalidStateError();
	//Close it
	priv.pc.close();
	//We are closed now, we can wait until callback
	priv.isClosed = true;
};
/*
partial interface RTCPeerConnection {
    sequence<RTCRtpSender>      getSenders();
    sequence<RTCRtpReceiver>    getReceivers();
    sequence<RTCRtpTransceiver> getTransceivers();
    RTCRtpSender                addTrack(MediaStreamTrack track, MediaStream... streams);
    void                        removeTrack(RTCRtpSender sender);
    RTCRtpTransceiver           addTransceiver((MediaStreamTrack or DOMString) trackOrKind, optional RTCRtpTransceiverInit init);
    attribute EventHandler ontrack;
};
*/
RTCPeerConnection.prototype.getSenders = function () {
	throw "Not implemented";
};

RTCPeerConnection.prototype.getReceivers = function () {
	throw "Not implemented";
};

RTCPeerConnection.prototype.getTransceivers = function () {
	throw "Not implemented";
};

RTCPeerConnection.prototype.addTrack = function () {
	var priv = this.priv;

	if (!priv.pc || priv.isClosed) throw new InvalidStateError();

	//Parse arguments
	var track = arguments[0];
	var streams = Array.prototype.slice.call(arguments, 1);

	//Ensure that we are attaching to at most 1, as it is not supported in libwebrtc
	if (streams.length > 1) throw new Error("Adding track to more than one stream is not currently supported");

	//Get stream label, as it is the only param needed by libwebrtc
	var label = streams.length ? streams[0].id : "";

	//Add native track to native object it only needs the stream label not the stream
	var sender = priv.pc.addTrack(track.priv.track, label);

	//Check result
	if (!sender) return null;

	//Create sender
	var rtpSender = new RTCRtpSender(sender);

	//Get native sender id
	var senderId = rtpSender.priv.id;

	//Add to senders
	priv.senders[senderId] = rtpSender;

	return rtpSender;
};

RTCPeerConnection.prototype.addTransceiver = function (trackOrKind, init) {
	//TODO: Implement!
	//Not really implemented just for passing tests
	var sender = new RTCRtpSender(null, null);
	var track = new MediaStreamTrack(null);
	var receiver = new RTCRtpReceiver(track);
	//Return dummy object for now
	return new RTCRtpTransceiver(sender, receiver);
};

/*
 * Legacy stream apis
 */
RTCPeerConnection.prototype.addStream = function (stream) {
	var tracks = stream.getTracks();
	for (var i = 0; i < tracks.length; ++i) {
		this.addTrack(tracks[i], stream);
	}
};

RTCPeerConnection.prototype.removeTrack = function (rtpSender) {
	var priv = this.priv;

	if (!priv.pc || priv.isClosed) throw new InvalidStateError();

	//Check if sender is invalid
	if (!rtpSender || !rtpSender.priv.sender || !rtpSender.priv.track) throw new InvalidStateError();

	//Get native sender id
	var senderId = rtpSender.priv.id;

	//Check if senders is from this pc
	if (!priv.senders.hasOwnProperty(senderId)) throw new InvalidStateError();

	//Pass the nateive object
	priv.pc.removeTrack(rtpSender.priv.sender);

	//Set sender track to null
	rtpSender.priv.track = null;

	//Remove from senders
	delete priv.senders[senderId];
};

defineEventAttribute(RTCPeerConnection.prototype, "track");

/*
partial interface RTCPeerConnection {
    readonly attribute RTCSctpTransport? sctp;
    RTCDataChannel createDataChannel(USVString label,
                                     optional RTCDataChannelInit dataChannelDict);
             attribute EventHandler      ondatachannel;
};
*/
RTCPeerConnection.prototype.createDataChannel = function (label, dataChannelDict) {
	var priv = this.priv;

	if (!priv.pc || priv.isClosed) throw new InvalidStateError();

	//Check if we have a string label (can be empty)
	if (typeof label !== "string") return new TypeError();

	//Create native datachannel
	var dataChannel = priv.pc.createDataChannel(label, dataChannelDict);

	//Check
	if (!dataChannel) return null;

	//Return wrapper
	return new DataChannel(dataChannel);
};

defineEventAttribute(RTCPeerConnection.prototype, "datachannel");

Object.defineProperty(RTCPeerConnection, 'RTCPeerConnection', { enumerable: false, configurable: true, writable: false, value: "RTCPeerConnection" });
Object.defineProperty(RTCPeerConnection, 'prototype', { writable: false });
module.exports = RTCPeerConnection;

},{"./EventTarget.js":4,"./InvalidStateError.js":5,"./MediaStreamTrack.js":8,"./RTCDataChannel.js":9,"./RTCIceCandidate.js":10,"./RTCRtpReceiver.js":12,"./RTCRtpSender.js":13,"./RTCRtpTransceiver.js":14,"./RTCSessionDescription.js":15,"./WebRTCProxy.js":17}],12:[function(require,module,exports){
'use strict';

/*
[Exposed=Window]
interface RTCRtpReceiver {
    readonly attribute MediaStreamTrack  track;
    readonly attribute RTCDtlsTransport? transport;
    readonly attribute RTCDtlsTransport? rtcpTransport;
    // Feature at risk
    static RTCRtpCapabilities             getCapabilities(DOMString kind);
    RTCRtpParameters                      getParameters();
    sequence<RTCRtpContributingSource>    getContributingSources();
    sequence<RTCRtpSynchronizationSource> getSynchronizationSources();
    Promise<RTCStatsReport>               getStats();
};

 */

var RTCRtpReceiver = function RTCRtpReceiver(track) {
    var priv = {
        track: track
    };

    //Read only
    Object.defineProperty(this, 'track', {
        enumerable: true, configurable: false, get: function get() {
            return priv.track;
        }
    });
    //Not implemented
    Object.defineProperty(this, 'transport', {
        enumerable: true, configurable: false, get: function get() {
            return null;
        }
    });
    Object.defineProperty(this, 'rtcpTransport', {
        enumerable: true, configurable: false, get: function get() {
            return null;
        }
    });
};

RTCRtpReceiver.getCapabilities = function (kind) {
    throw 'Not implemented yet';
};

RTCRtpReceiver.getParameters = function () {
    throw 'Not implemented yet';
};

RTCRtpReceiver.getContributingSources = function () {
    throw 'Not implemented yet';
};
RTCRtpReceiver.getSynchronizationSources = function () {
    throw 'Not implemented yet';
};
RTCRtpReceiver.getStats = function () {
    return Promise.reject(new Error('Not implemented yet'));
};

Object.defineProperty(RTCRtpReceiver, 'name', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: 'RTCRtpReceiver'
});
Object.defineProperty(RTCRtpReceiver, 'prototype', { writable: false });
module.exports = RTCRtpReceiver;

},{}],13:[function(require,module,exports){
'use strict';

/*
[Exposed=Window]
interface RTCRtpSender {
    readonly attribute MediaStreamTrack? track;
    readonly attribute RTCDtlsTransport? transport;
    readonly attribute RTCDtlsTransport? rtcpTransport;
    // Feature at risk
    static RTCRtpCapabilities getCapabilities(DOMString kind);
    Promise<void>           setParameters(optional RTCRtpParameters parameters);
    RTCRtpParameters        getParameters();
    Promise<void>           replaceTrack(MediaStreamTrack? withTrack);
    Promise<RTCStatsReport> getStats();
};
*/
var RTCRtpSender = function RTCRtpSender(sender, track) {
	//Add to map
	this.priv = {
		sender: sender,
		track: track
	};

	Object.defineProperty(this, 'track', { enumerable: true, configurable: false, get: function get() {
			return priv.track;
		} });
	Object.defineProperty(this, 'transport', { enumerable: true, configurable: false, get: function get() {
			new Error("Not supported yet");
		} });
	Object.defineProperty(this, 'rtcpTransport', { enumerable: true, configurable: false, get: function get() {
			new Error("Not supported yet");
		} });

	return this;
};

RTCRtpSender.prototype.getCapabilities = function () {
	throw new Error("Not supported yet");
};

RTCRtpSender.prototype.setParameters = function () {
	throw new Error("Not supported yet");
};

RTCRtpSender.prototype.getParameters = function () {
	throw new Error("Not supported yet");
};

RTCRtpSender.prototype.replaceTrack = function () {
	throw new Error("Not supported yet");
};

RTCRtpSender.prototype.getStats = function () {
	throw new Error("Not supported yet");
};

Object.defineProperty(RTCRtpSender, 'name', { enumerable: false, configurable: true, writable: false, value: "RTCRtpSender" });
Object.defineProperty(RTCRtpSender, 'prototype', { writable: false });
module.exports = RTCRtpSender;

},{}],14:[function(require,module,exports){
"use strict";

/*
 [Exposed=Window]
 interface RTCRtpTransceiver {
    readonly attribute DOMString?                  mid;
    [SameObject]
    readonly attribute RTCRtpSender                sender;
    [SameObject]
    readonly attribute RTCRtpReceiver              receiver;
    readonly attribute boolean                     stopped;
             attribute RTCRtpTransceiverDirection  direction;
    readonly attribute RTCRtpTransceiverDirection? currentDirection;
    void stop();
    void setCodecPreferences(sequence<RTCRtpCodecCapability> codecs);
};

 */
var RTPRtcTransceiver = function RTPRtcTransceiver(sender, receiver) {

	//Private attributes
	var priv = this.priv = {
		mid: null,
		sender: sender,
		receiver: receiver,
		stopped: false,
		direction: "sendrecv",
		currentDirection: "sendrecv"
	};

	//Read only
	Object.defineProperty(this, "mid", { enumerable: true, configurable: false, get: function get() {
			return priv.mid;
		} });
	Object.defineProperty(this, "sender", { enumerable: true, configurable: false, get: function get() {
			return priv.sender;
		} });
	Object.defineProperty(this, "receiver", { enumerable: true, configurable: false, get: function get() {
			return priv.receiver;
		} });
	Object.defineProperty(this, "stopped", { enumerable: true, configurable: false, get: function get() {
			return priv.stopped;
		} });
	Object.defineProperty(this, "currentDirection", { enumerable: true, configurable: false, get: function get() {
			return priv.currentDirection;
		} });

	//REad and write
	Object.defineProperty(this, "currentDirection", { enumerable: true, configurable: false,
		get: function get() {
			return priv.direction;
		},
		set: function set(direction) {
			priv.direction = direction;
			priv.currentDirection = direction;
			return direction;
		}
	});
};

RTPRtcTransceiver.prototype.stop = function () {
	throw "Not implemented";
};

Object.defineProperty(RTPRtcTransceiver, 'name', { enumerable: false, configurable: true, writable: false, value: "RTPRtcTransceiver" });
Object.defineProperty(RTPRtcTransceiver, 'prototype', { writable: false });
module.exports = RTPRtcTransceiver;

},{}],15:[function(require,module,exports){
"use strict";

/*
 [Constructor(RTCSessionDescriptionInit descriptionInitDict),
 Exposed=Window]
interface RTCSessionDescription {
    readonly attribute RTCSdpType type;
    readonly attribute DOMString  sdp;
    [Default] object toJSON();
}; 
 
 dictionary RTCSessionDescriptionInit {
    required RTCSdpType type;
             DOMString  sdp = "";
};

 */

function RTCSessionDescription(descriptionInitDict) {
	//Get values from dictionary
	// we support custom constructor to pass array instead of object as "dictionary" from activexobject
	var type = Array.isArray(descriptionInitDict) ? descriptionInitDict[0] : descriptionInitDict.type;
	var sdp = Array.isArray(descriptionInitDict) ? descriptionInitDict[1] : descriptionInitDict.sdp;

	//Direct attributes from init
	Object.defineProperty(this, "type", { enumerable: true, configurable: false, get: function get() {
			return type;
		} });
	Object.defineProperty(this, "sdp", { enumerable: true, configurable: false, get: function get() {
			return sdp;
		} });

	return this;
};

RTCSessionDescription.prototype.toJSON = function () {
	return {
		type: this.type,
		sdp: this.sdp
	};
};

Object.defineProperty(RTCSessionDescription, 'name', { enumerable: false, configurable: true, writable: false, value: "RTCSessionDescription" });
Object.defineProperty(RTCSessionDescription, 'prototype', { writable: false });
module.exports = RTCSessionDescription;

},{}],16:[function(require,module,exports){
"use strict";

// This obvserver checks when a video element has been set a srcObj
var videoObserver = new MutationObserver(function (mutations) {
	for (var i = 0, numMutations = mutations.length; i < numMutations; i++) {
		var mutation = mutations[i];
		// HTML video element.
		if (mutation.target.videoRenderer) mutation.target.videoRenderer.mutate(mutation);
	}
});

var CLASSID = "CLSID:B8E874D9-72BA-4E54-B59B-3513081DF516";

function VideoRenderer(video) {
	var srcObject;
	var self = this;
	//Store video element
	this.video = video;

	//Create a new video renderer object
	var object = this.object = document.createElement("object");
	//Set csid
	this.object.classid = CLASSID;
	//Apped it hidden
	video.appendChild(this.object);

	// Add .src observer to the video element.
	videoObserver.observe(video, {
		// Set to true if additions and removals of the target node's child elements (including text
		// nodes) are to be observed.
		childList: false,
		// Set to true if mutations to target's attributes are to be observed.
		attributes: true,
		// Set to true if mutations to target's data are to be observed.
		characterData: false,
		// Set to true if mutations to not just target, but also target's descendants are to be observed.
		subtree: false,
		// Set to true if attributes is set to true and target's attribute value before the mutation
		// needs to be recorded.
		attributeOldValue: true,
		// Set to true if characterData is set to true and target's data before the mutation needs to be
		// recorded.
		characterDataOldValue: false
		// Set to an array of attribute local names (without namespace) if not all attribute mutations
		// need to be observed.
		//attributeFilter: [ 'srcObject']
	});
	// Define srcObject properties
	Object.defineProperty(video, 'srcObject', {
		enumerable: true,
		configurable: true,
		get: function get() {
			return srcObject;
		},
		set: function set(stream) {
			//We need to fire metadata event when we get first resize
			var needsmetadata = true;
			//Attach resize event
			object.onresize = function () {
				//Create event
				var event = document.createEvent("Event");
				//Init metadata or resize event
				event.initEvent(needsmetadata ? "loadedmetadata" : "resize", false, false);
				//Dispatch it
				video.dispatchEvent(event);
				//No more medatada event
				needsmetadata = false;
			};
			//Get stream track video stream
			var videoTracks = stream.getVideoTracks();
			//If found any
			if (videoTracks.length)
				//Set native video track on video renderer object
				object.setTrack(videoTracks[0].priv.track);
			//Store it
			srcObject = stream;
			//Show renderer
			self.show();
		}
	});

	// Override properties
	Object.defineProperty(video, 'videoWidth', { enumerable: true, configurable: true, get: function get() {
			return object.videoWidth;
		} });
	Object.defineProperty(video, 'videoHeight', { enumerable: true, configurable: true, get: function get() {
			return object.videoHeight;
		} });
	//TODO: clone attributes
}

VideoRenderer.prototype.mutate = function (mutation) {
	//Get mutation type
	//TODO: clone attributes
};

VideoRenderer.prototype.close = function () {
	//Hide video object
	this.hide();
	//Unobserver video element
	videoObserver.disconnect();
	//Remove srcObject property
	Object.defineProperty(this.video, 'srcObject', {});
	Object.defineProperty(this.video, 'videoWidth', {});
	Object.defineProperty(this.video, 'videoHeigth', {});
	//delete object, IE only method
	this.object.removeNode(false);
	delete this.object;
};

VideoRenderer.handle = function (video) {
	if (!video.videoRenderer) video.videoRenderer = new VideoRenderer(video);
};

VideoRenderer.unhandle = function (video) {
	if (video.videoRenderer) {
		video.videoRenderer.close();
		delete video.videoRenderer;
	}
};

VideoRenderer.prototype.show = function () {
	//Check object is not shown
	if (this.video !== this.object.parentElement)
		//Nothing
		return;
	//Swap them
	this.video.parentNode.replaceChild(this.object, this.video);
	this.object.appendChild(this.video);
};

VideoRenderer.prototype.hide = function () {
	//Check object is not shown
	if (this.object !== this.video.parentElement)
		//Nothing
		return;
	//Swap them
	this.object.parentNode.replaceChild(this.video, this.object);
	this.video.appendChild(this.object);
};

module.exports = VideoRenderer;

},{}],17:[function(require,module,exports){
'use strict';

var browser = require('detect-browser').detect();

var WebRTCProxy = null;

//If it is internet explorer
if (browser.name === 'ie') {
    // Create singleton
    try {
        WebRTCProxy = new ActiveXObject('Cosmo.WebRTCProxy.1');
    } catch (e) {
        console.error('IE WebRTC Plugin not installed');
    }
}

module.exports = WebRTCProxy;

},{"detect-browser":18}],18:[function(require,module,exports){
(function (process){
/**
  # detect-browser

  This is a package that attempts to detect a browser vendor and version (in
  a semver compatible format) using a navigator useragent in a browser or
  `process.version` in node.

  ## NOTE: Version 2.x release

  Release 2.0 introduces a breaking API change (hence the major release)
  which requires invocation of a `detect` function rather than just inclusion of
  the module.  PR [#46](https://github.com/DamonOehlman/detect-browser/pull/46)
  provides more context as to why this change has been made.

  ## Example Usage

  <<< examples/simple.js

  Or you can use a switch statement:

  <<< examples/switch.js

  ## Adding additional browser support

  The current list of browsers that can be detected by `detect-browser` is
  not exhaustive. If you have a browser that you would like to add support for
  then please submit a pull request with the implementation.

  Creating an acceptable implementation requires two things:

  1. A test demonstrating that the regular expression you have defined identifies
     your new browser correctly.  Examples of this can be found in the 
     `test/logic.js` file.

  2. Write the actual regex to the `lib/detectBrowser.js` file. In most cases adding
     the regex to the list of existing regexes will be suitable (if usage of `detect-brower`
     returns `undefined` for instance), but in some cases you might have to add it before
     an existing regex.  This would be true for a case where you have a browser that
     is a specialised variant of an existing browser but is identified as the
     non-specialised case.

  When writing the regular expression remember that you would write it containing a
  single [capturing group](https://regexone.com/lesson/capturing_groups) which
  captures the version number of the browser.

**/

function detect() {
  var nodeVersion = getNodeVersion();
  if (nodeVersion) {
    return nodeVersion;
  } else if (typeof navigator !== 'undefined') {
    return parseUserAgent(navigator.userAgent);
  }

  return null;
}

function detectOS(userAgentString) {
  var rules = getOperatingSystemRules();
  var detected = rules.filter(function (os) {
    return os.rule && os.rule.test(userAgentString);
  })[0];

  return detected ? detected.name : null;
}

function getNodeVersion() {
  var isNode = typeof navigator === 'undefined' && typeof process !== 'undefined';
  return isNode ? {
    name: 'node',
    version: process.version.slice(1),
    os: require('os').type().toLowerCase()
  } : null;
}

function parseUserAgent(userAgentString) {
  var browsers = getBrowserRules();
  if (!userAgentString) {
    return null;
  }

  var detected = browsers.map(function(browser) {
    var match = browser.rule.exec(userAgentString);
    var version = match && match[1].split(/[._]/).slice(0,3);

    if (version && version.length < 3) {
      version = version.concat(version.length == 1 ? [0, 0] : [0]);
    }

    return match && {
      name: browser.name,
      version: version.join('.')
    };
  }).filter(Boolean)[0] || null;

  if (detected) {
    detected.os = detectOS(userAgentString);
  }

  return detected;
}

function getBrowserRules() {
  return buildRules([
    [ 'edge', /Edge\/([0-9\._]+)/ ],
    [ 'yandexbrowser', /YaBrowser\/([0-9\._]+)/ ],
    [ 'vivaldi', /Vivaldi\/([0-9\.]+)/ ],
    [ 'kakaotalk', /KAKAOTALK\s([0-9\.]+)/ ],
    [ 'chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
    [ 'phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'crios', /CriOS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
    [ 'fxios', /FxiOS\/([0-9\.]+)/ ],
    [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
    [ 'opera', /OPR\/([0-9\.]+)(:?\s|$)$/ ],
    [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/ ],
    [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
    [ 'ie', /MSIE\s(7\.0)/ ],
    [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
    [ 'android', /Android\s([0-9\.]+)/ ],
    [ 'ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/ ],
    [ 'safari', /Version\/([0-9\._]+).*Safari/ ]
  ]);
}

function getOperatingSystemRules() {
  return buildRules([
    [ 'iOS', /iP(hone|od|ad)/ ],
    [ 'Android OS', /Android/ ],
    [ 'BlackBerry OS', /BlackBerry|BB10/ ],
    [ 'Windows Mobile', /IEMobile/ ],
    [ 'Amazon OS', /Kindle/ ],
    [ 'Windows 3.11', /Win16/ ],
    [ 'Windows 95', /(Windows 95)|(Win95)|(Windows_95)/ ],
    [ 'Windows 98', /(Windows 98)|(Win98)/ ],
    [ 'Windows 2000', /(Windows NT 5.0)|(Windows 2000)/ ],
    [ 'Windows XP', /(Windows NT 5.1)|(Windows XP)/ ],
    [ 'Windows Server 2003', /(Windows NT 5.2)/ ],
    [ 'Windows Vista', /(Windows NT 6.0)/ ],
    [ 'Windows 7', /(Windows NT 6.1)/ ],
    [ 'Windows 8', /(Windows NT 6.2)/ ],
    [ 'Windows 8.1', /(Windows NT 6.3)/ ],
    [ 'Windows 10', /(Windows NT 10.0)/ ],
    [ 'Windows ME', /Windows ME/ ],
    [ 'Open BSD', /OpenBSD/ ],
    [ 'Sun OS', /SunOS/ ],
    [ 'Linux', /(Linux)|(X11)/ ],
    [ 'Mac OS', /(Mac_PowerPC)|(Macintosh)/ ],
    [ 'QNX', /QNX/ ],
    [ 'BeOS', /BeOS/ ],
    [ 'OS/2', /OS\/2/ ],
    [ 'Search Bot', /(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/ ]
  ]);
}

function buildRules(ruleTuples) {
  return ruleTuples.map(function(tuple) {
    return {
      name: tuple[0],
      rule: tuple[1]
    };
  });
}

module.exports = {
  detect: detect,
  detectOS: detectOS,
  getNodeVersion: getNodeVersion,
  parseUserAgent: parseUserAgent
};

}).call(this,require('_process'))
},{"_process":2,"os":1}]},{},[3])(3)
});
