var Promise			= require("promise-polyfill");

/*
[Exposed=Window]
interface RTCRtpReceiver {
  readonly attribute MediaStreamTrack track;
  readonly attribute RTCDtlsTransport? transport;
  static RTCRtpCapabilities? getCapabilities(DOMString kind);
  RTCRtpReceiveParameters getParameters();
  sequence<RTCRtpContributingSource> getContributingSources();
  sequence<RTCRtpSynchronizationSource> getSynchronizationSources();
  Promise<RTCStatsReport> getStats();
};

 */

var RTCRtpReceiver = function(receiver, track, pc) 
{
	var priv = {
		receiver	: receiver,
		track		: track,
		pc		: pc
	};
	
	//Read only
	Object.defineProperty(this, "track"		, { enumerable: true, configurable: false, get: function() { return priv.track;				}});
	//Not implemented
	Object.defineProperty(this, "transport"		, { enumerable: true, configurable: false, get: function() { new Error("Not supported yet");		}});
};

RTCRtpReceiver.getCapabilities = function(kind)
{
	throw "Not implemented yet";
};

RTCRtpReceiver.prototype.getParameters = function()
{
	throw "Not implemented yet";
};

RTCRtpReceiver.prototype.getContributingSources = function()
{
	throw "Not implemented yet";
};
RTCRtpReceiver.prototype.getSynchronizationSources = function()
{
	throw "Not implemented yet";
};
RTCRtpReceiver.prototype.getStats = function()
{
	return this.priv.getStats(this.track);
};

Object.defineProperty(RTCRtpReceiver, 'name', { enumerable: false, configurable: true, writable: false, value: "RTCRtpReceiver" });
Object.defineProperty(RTCRtpReceiver, 'prototype'	, { writable:false });
module.exports = RTCRtpReceiver;
