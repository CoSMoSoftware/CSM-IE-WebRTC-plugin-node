var browser = require('detect-browser').detect();

//If it is not internet exploer, do nothign
if (browser.name === 'ie') {
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
        bindVideoElement: function (element) {
            checkNewNode(element);
        },

        //Method called by demand in IE for unbind video elements
        unBindVideoElement: function (element) {
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
            if (mutation.type !== 'childList')
                continue;

            // Check added nodes.
            for (var j = 0, numNodes = mutation.addedNodes.length; j < numNodes; j++)
                //Check node recursively
                checkNewNode(mutation.addedNodes[j]);

            // Check removed nodes.
            for (j = 0, numNodes = mutation.removedNodes.length; j < numNodes; j++)
                //Check node recursively
                checkRemovedNode(mutation.removedNodes[j]);
        }
    });

    //Get all video elements already present
    var videos = document.getElementsByTagName('video');

    //Handle them
    for (var i = 0; i < videos.length; ++i)
        VideoRenderer.handle(videos[i]);

    //Helper functions to check video nodes
    function checkNewNode(node) {
        //If it is a video element
        if (node.nodeName.match(/video/i))
        // Observe changes in the video element
            return VideoRenderer.handle(node);
        //Look in childs
        for (var j = 0; j < node.childNodes.length; j++)
            checkNewNode(node.childNodes.item(j));
    }

    function checkRemovedNode(node) {
        //If it is a video element
        if (node.nodeName.match(/video/i))
            return VideoRenderer.unhandle(node);
        //Look in childs
        for (var j = 0; j < node.childNodes.length; j++)
            checkRemovedNode(node.childNodes.item(j));
    }

    function makeInterface(Base) {
        //Interface with no constructor
        var Interface = function () {
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
        Object.defineProperty(Interface, 'prototype', {writable: false});
        //Ok
        return Interface;
    }

    function defineGlobalProperty(name, value) {
        Object.defineProperty(window, name, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
        });
    }
}