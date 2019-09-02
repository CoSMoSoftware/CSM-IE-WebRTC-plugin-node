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
var MediaStreamTrack = function (track) {
    //Init event targetr
    EventTarget.call(this);

    //Private vars
    var priv = this.priv = {
        track: track,
        muted: false,
        enabled: true
    };

    Object.defineProperty(this, 'kind', {
        enumerable: true, configurable: false, get: function () {
            return priv.track.kind;
        }
    });
    Object.defineProperty(this, 'id', {
        enumerable: true, configurable: false, get: function () {
            return priv.track.id;
        }
    });
    Object.defineProperty(this, 'label', {
        enumerable: true, configurable: false, get: function () {
            return priv.track.id;
        }
    });
    Object.defineProperty(this, 'enabled', {
        enumerable: true, configurable: false, get: function () {
            return priv.enabled;
        }, set: function (enabled) {
            priv.enabled = !!enabled;
        }
    });
    Object.defineProperty(this, 'muted', {
        enumerable: true, configurable: false, get: function () {
            return priv.muted;
        }
    });
    Object.defineProperty(this, 'readyState', {
        enumerable: true, configurable: false, get: function () {
            return priv.track.state;
        }
    });
    Object.defineProperty(this, 'isolated', {
        enumerable: true, configurable: false, get: function () {
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

MediaStreamTrack.prototype.getCapabilities = function () {

};

MediaStreamTrack.prototype.getConstraints = function () {

};

MediaStreamTrack.prototype.getSettings = function () {

};

MediaStreamTrack.prototype.applyConstraints = function () {

};

Object.defineProperty(MediaStreamTrack, 'name', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: 'MediaStreamTrack'
});
module.exports = MediaStreamTrack;