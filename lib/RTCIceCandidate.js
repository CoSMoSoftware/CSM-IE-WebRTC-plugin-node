var WebRTCProxy			= require("./WebRTCProxy.js");
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
var RTCIceCandidate = function(iceCandidateInit) 
{
	if (!iceCandidateInit)
		throw new TypeError();
	
	//Get values from dictionary
	var candidate		= iceCandidateInit.candidate;
	var sdpMid		= iceCandidateInit.sdpMid;
	var sdpMLineIndex	= iceCandidateInit.sdpMLineIndex;
	var usernameFragment    = iceCandidateInit.usernameFragment;
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
	if (iceCandidateInit.ext)
	{
		foundation	= iceCandidateInit.ext.foundation;
		component	= iceCandidateInit.ext.component;
		priority	= iceCandidateInit.ext.priority;
		ip		= iceCandidateInit.ext.ip;
		protocol	= iceCandidateInit.ext.protocol;
		port		= iceCandidateInit.ext.port;
		type		= iceCandidateInit.ext.type;
		tcpType		= iceCandidateInit.ext.tcpType;
		relatedAddress	= iceCandidateInit.ext.relatedAddress;
		relatedPort	= iceCandidateInit.ext.relatedPort;
	} else {
		try {
			//Parse candidate
			var parsed = WebRTCProxy.parseIceCandidate(candidate).toArray();
		} catch (e) {
			throw new TypeError();
		}
		//Set parsed properties
		foundation	= parsed[0];
		component	= parsed[1];
		priority	= parsed[2];
		ip		= parsed[3];
		protocol	= parsed[4];
		port		= parsed[5];
		type		= parsed[6];
		tcpType		= parsed[7];
		relatedAddress	= parsed[8];
		relatedPort	= parsed[9];
		if (!usernameFragment)
			usernameFragment = parsed[10];
	}

		
	//Direct attributes from init
	Object.defineProperty(this, "candidate"		, { enumerable: true, configurable: false, get: function() { return candidate;		}});
	Object.defineProperty(this, "sdpMid"		, { enumerable: true, configurable: false, get: function() { return sdpMid;		}});
	Object.defineProperty(this, "sdpMLineIndex"	, { enumerable: true, configurable: false, get: function() { return sdpMLineIndex;	}});
	Object.defineProperty(this, "foundation"	, { enumerable: true, configurable: false, get: function() { return foundation;		}});
	Object.defineProperty(this, "component"		, { enumerable: true, configurable: false, get: function() { return component;		}});
	Object.defineProperty(this, "priority"		, { enumerable: true, configurable: false, get: function() { return priority;		}});
	Object.defineProperty(this, "ip"		, { enumerable: true, configurable: false, get: function() { return ip;			}});
	Object.defineProperty(this, "protocol"		, { enumerable: true, configurable: false, get: function() { return protocol;		}});
	Object.defineProperty(this, "port"		, { enumerable: true, configurable: false, get: function() { return port;		}});
	Object.defineProperty(this, "type"		, { enumerable: true, configurable: false, get: function() { return type;		}});
	Object.defineProperty(this, "tcpType"		, { enumerable: true, configurable: false, get: function() { return tcpType;		}});
	Object.defineProperty(this, "relatedAddress"	, { enumerable: true, configurable: false, get: function() { return relatedAddress;	}});
	Object.defineProperty(this, "relatedPort"	, { enumerable: true, configurable: false, get: function() { return relatedPort;	}});
	Object.defineProperty(this, "usernameFragment"	, { enumerable: true, configurable: false, get: function() { return usernameFragment;	}});
	
	return this;
};

RTCIceCandidate.prototype.toJSON = function() 
{
	return {
		candidate	: this.candidate,
		sdpMid		: this.sdpMid,
		sdpMLineIndex	: this.sdpMLineIndex,
		usernameFragment: this.usernameFragment
	};
};

Object.defineProperty(RTCIceCandidate, 'name', { enumerable: false, configurable: true, writable: false, value: "RTCIceCandidate" });
Object.defineProperty(RTCIceCandidate, 'prototype'	, { writable:false });
module.exports = RTCIceCandidate;
