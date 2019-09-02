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
var MediaDevices = function () {
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
Object.defineProperty(MediaDevices, 'prototype', {writable: false});
module.exports = MediaDevices;