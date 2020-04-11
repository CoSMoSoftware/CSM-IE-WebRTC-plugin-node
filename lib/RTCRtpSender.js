/*
[Exposed=Window]
interface RTCRtpSender {
    readonly attribute MediaStreamTrack? track;
    readonly attribute RTCDtlsTransport? transport;
    static RTCRtpCapabilities getCapabilities(DOMString kind);
    Promise<void>           setParameters(optional RTCRtpParameters parameters);
    RTCRtpParameters        getParameters();
    Promise<void>           replaceTrack(MediaStreamTrack? withTrack);
    Promise<RTCStatsReport> getStats();
};
*/
var RTCRtpSender = function(sender,track, pc)
{
	//Add to map
	var priv = this.priv = {
		sender	: sender,
		pc	: pc
	};
	
	Object.defineProperty(this, 'track'		, { enumerable: true, configurable: false, get: function(){ return track;			}});
	Object.defineProperty(this, 'transport'		, { enumerable: true, configurable: false, get: function(){ new Error("Not supported yet");	}});
	
	return this;
};

RTCRtpSender.prototype.getCapabilities = function() 
{
	throw new Error("Not supported yet");
};

RTCRtpSender.prototype.setParameters = function() 
{
	throw new Error("Not supported yet");
};

RTCRtpSender.prototype.getParameters = function() 
{
	throw new Error("Not supported yet");
};

RTCRtpSender.prototype.replaceTrack = function() 
{
	throw new Error("Not supported yet");
};

RTCRtpSender.prototype.getStats = function() 
{
	return this.priv.pc.getStats(this);
};

Object.defineProperty(RTCRtpSender, 'name', { enumerable: false, configurable: true, writable: false, value: "RTCRtpSender" });
Object.defineProperty(RTCRtpSender, 'prototype'	, { writable:false });
module.exports = RTCRtpSender;
