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
	var priv = this.priv = {
		receiver	: receiver,
		pc		: pc
	};
	
	//Read only
	Object.defineProperty(this, "track"		, { enumerable: true, configurable: false, get: function() { return track;				}});
	//Not implemented
	Object.defineProperty(this, "transport"		, { enumerable: true, configurable: false, get: function() { new Error("Not supported yet");		}});
};

RTCRtpReceiver.getCapabilities = function(kind)
{
	throw "Not implemented yet";
};

RTCRtpReceiver.prototype.getParameters = function()
{
	if (!this.priv.receiver)
		throw new InvalidStateError();
	//Get native parameters
	var params = this.priv.receiver.getParameters().toArray();
	
	//Get data
	var headerExtensions	= params[0].toArray();
	var rtcp		= params[1].toArray();
	var codecs		= params[2].toArray();
	
	//Create params object
	var receivingParams =  {
		headerExtensions: [],
		rtcp		: {
			cname		: rtcp[0],
			reducedSize	: rtcp[1]
		},
		codecs		: []
		
	};
	
	//For all header extensions
	for (var i=0; i<headerExtensions.length; ++i)
	{
		//Get encoding
		var headerExtension = headerExtensions[i].toArray();
		//Push it
		receivingParams.headerExtensions.push({
			uri			: headerExtension[0],
			id			: headerExtension[1],
			encrypted		: headerExtension[2],
		});
	}
	
	//For all codecs
	for (var i=0; i<codecs.length; ++i)
	{
		//Get encoding
		var codec = codecs[i].toArray();
		
		//Create the receiving encoding
		var receivingCodec = {};
		
		//Add params
				receivingCodec.payloadType	= codec[0];
				receivingCodec.mimeType		= codec[1];
		if (!!codec[2])	receivingCodec.clockRate	= codec[2];
		if (!!codec[3])	receivingCodec.channels		= codec[3];
		if (!!codec[4])	receivingCodec.sdpFmtpLine	= codec[4];
		
		//Push it
		receivingParams.encodings.push(receivingCodec);
	}
	
	//Done
	return receivingParams;
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
	return this.priv.pc.getStats(this);
};

Object.defineProperty(RTCRtpReceiver, 'name', { enumerable: false, configurable: true, writable: false, value: "RTCRtpReceiver" });
Object.defineProperty(RTCRtpReceiver, 'prototype'	, { writable:false });
module.exports = RTCRtpReceiver;
