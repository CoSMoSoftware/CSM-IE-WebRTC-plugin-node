var browser = require("detect-browser").detect();

//If it is not internet exploer, do nothign
if (browser.name === "ie") 
{
	// Add objects to global
	var MediaDevices		= require("./lib/MediaDevices.js");
	var VideoRenderer		= require("./lib/VideoRenderer.js");
	navigator.mediaDevices		= new MediaDevices();

	var RTCPeerConnection		= require("./lib/RTCPeerConnection.js");
	var RTCSessionDescription	= require("./lib/RTCSessionDescription.js");
	var RTCIceCandidate		= require("./lib/RTCIceCandidate.js");
	var RTCRtpTransceiver		= require("./lib/RTCRtpTransceiver.js");
	var RTCRtpReceiver		= require("./lib/RTCRtpReceiver.js");
	var RTCRtpSender		= require("./lib/RTCRtpSender.js");
	var RTCDataChannel		= require("./lib/RTCDataChannel.js");
	var RTCStatsReport		= require("./lib/RTCStatsReport.js");
	var MediaDeviceInfo		= require("./lib/MediaDeviceInfo.js");
	var MediaStream			= require("./lib/MediaStream.js");
	var MediaStreamTrack		= require("./lib/MediaStreamTrack.js");
	var Promise			= require("promise-polyfill");
	var EventTarget			= require("./lib/EventTarget.js").EventTarget;


	function makeInterface(Base) {
		//Interface with no constructor
		var Interface = function() {	throw new TypeError(); };
		//Set name
		Object.defineProperty(Interface, 'name'	, { enumerable: false, configurable: true, writable: false, value: Base.name });
		//Create constructor and reset protocol chain
		Interface.prototype = Object.create(Base.prototype, {
			constructor: { 
				value		: Interface, 
				configurable	: true,
				writable	: false 
			}
		});
		//Fix protocol chain
		Interface.__proto__ = Base.__proto__;
		//Make prototype read only
		Object.defineProperty(Interface, 'prototype'	, { writable:false });
		//Ok
		return Interface;
	}

	Object.defineProperty(window, 'RTCPeerConnection'	, { enumerable: false, configurable: true, writable: true, value: RTCPeerConnection	});
	Object.defineProperty(window, 'RTCSessionDescription'	, { enumerable: false, configurable: true, writable: true, value: RTCSessionDescription });
	Object.defineProperty(window, 'RTCIceCandidate'		, { enumerable: false, configurable: true, writable: true, value: RTCIceCandidate	});
	Object.defineProperty(window, 'MediaStream'		, { enumerable: false, configurable: true, writable: true, value: MediaStream		});
	Object.defineProperty(window, 'MediaStreamTrack'	, { enumerable: false, configurable: true, writable: true, value: makeInterface(MediaStreamTrack)	});
	Object.defineProperty(window, 'RTCRtpTransceiver'	, { enumerable: false, configurable: true, writable: true, value: makeInterface(RTCRtpTransceiver)	});
	Object.defineProperty(window, 'RTCRtpReceiver'		, { enumerable: false, configurable: true, writable: true, value: makeInterface(RTCRtpReceiver)		});
	Object.defineProperty(window, 'RTCRtpSender'		, { enumerable: false, configurable: true, writable: true, value: makeInterface(MediaStreamTrack)	});
	Object.defineProperty(window, 'RTCDataChannel'		, { enumerable: false, configurable: true, writable: true, value: makeInterface(RTCDataChannel)		});
	Object.defineProperty(window, 'RTCStatsReport'		, { enumerable: false, configurable: true, writable: true, value: makeInterface(RTCStatsReport)		});
	Object.defineProperty(window, 'MediaDeviceInfo'		, { enumerable: false, configurable: true, writable: true, value: makeInterface(MediaDeviceInfo)	});
	Object.defineProperty(window, 'Promise'			, { enumerable: false, configurable: true, writable: true, value: Promise		});
	Object.defineProperty(window, 'EventTarget'		, { enumerable: false, configurable: true, writable: true, value: EventTarget		});
	//Remove after test
	Object.defineProperty(window, 'VideoRenderer'		, { enumerable: false, configurable: true, writable: true, value: VideoRenderer		});

	//Helper functions to check video nodes
	function checkNewNode(node) 
	{
		//If it is a video element
		if (node.nodeName === 'video') 
			// Observe changes in the video element
			return VideoRenderer.handle(node);
		//Look in childs
		for (var j = 0; j < node.childNodes.length; j++) 
			checkNewNode(node.childNodes.item(j));
	}

	function checkRemovedNode(node)
	{
		//If it is a video element
		if (node.nodeName === 'video') 
			return VideoRenderer.unhandle(node);
		//Look in childs
		for (var j = 0; j < node.childNodes.length; j++) 
			checkRemovedNode(node.childNodes.item(j));
	}
	
	// DOM mutation observer to check when a new video element has been added to the DOM
	var domObserver = new MutationObserver(function (mutations) {
		for (var i = 0, numMutations = mutations.length; i < numMutations; i++)
		{
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
	var videos = document.getElementsByTagName("video");

	//Handle them
	for (var i=0; i<videos.length; ++i)
		VideoRenderer.handle(videos[i]);
}
