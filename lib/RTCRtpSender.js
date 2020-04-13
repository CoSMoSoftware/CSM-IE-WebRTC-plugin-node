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
	if (!this.priv.sender)
		throw new InvalidStateError();
	//Get native parameters
	var params = this.priv.sender.getParameters().toArray();
	
	//Get data
	var transactionId	= params[0];
	var encodings		= params[1].toArray();
	var headerExtensions	= params[2].toArray();
	var rtcp		= params[3].toArray();
	var codecs		= params[4].toArray();
	
	//Create params object
	var sendingParams =  {
		transactionId	: transactionId,
		encodings	: [],
		headerExtensions: [],
		rtcp		: {
			cname		: rtcp[0],
			reducedSize	: rtcp[1]
		},
		codecs		: []
		
	};
	
	//For all encodings
	for (var i=0; i<encodings.length; ++i)
	{
		//Get encoding
		var encoding = encodings[i].toArray();
		//Push it
		sendingParams.encodings.push({
			rid			: encoding[0],
			active			: encoding[1],
			maxBitrate		: encoding[2],
			scaleResolutionDownBy	: encoding[3],
		});
	}
	
	//For all header extensions
	for (var i=0; i<headerExtensions.length; ++i)
	{
		//Get encoding
		var headerExtension = headerExtensions[i].toArray();
		//Push it
		sendingParams.headerExtensions.push({
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
		//Push it
		sendingParams.codecs.push({
			payloadType	: codec[0],
			mimeType	: codec[1],
			clockRate	: codec[2],
			channels	: codec[3],
			sdpFmtpLine	: codec[4],
		});
	}
	
	//Done
	return sendingParams;
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
