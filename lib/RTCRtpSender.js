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

RTCRtpSender.prototype.setParameters = function(parameters) 
{
	var priv = this.priv;
	
	return new Promise(function(resolve,reject){
		try {
			if (!priv.sender)
				throw new InvalidStateError();
			//Set parameters
			priv.sender.setParameters(parameters);
			//Done
			resolve();
		} catch(e) {
			//Error
			reject(e);
		}
	});
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
		//Create the sending encoding
		var sendingeEncoding = {};
		
		//Add params
		if (!!encoding[0])	sendingeEncoding.rid			= encoding[0];
					sendingeEncoding.active			= encoding[1];
		if (!!encoding[2])	sendingeEncoding.maxBitrate		= encoding[2];
		if (!!encoding[3])	sendingeEncoding.scaleResolutionDownBy	= encoding[3];
		
		//Push it
		sendingParams.encodings.push(sendingeEncoding);
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
		
		//Create the sending encoding
		var sendingCodec = {};
		
		//Add params
				sendingCodec.payloadType	= codec[0];
				sendingCodec.mimeType		= codec[1];
		if (!!codec[2])	sendingCodec.clockRate		= codec[2];
		if (!!codec[3])	sendingCodec.channels		= codec[3];
		if (!!codec[4])	sendingCodec.sdpFmtpLine	= codec[4];
		
		//Push it
		sendingParams.encodings.push(sendingCodec);
	}
	
	//Done
	return sendingParams;
};

RTCRtpSender.prototype.replaceTrack = function(track) 
{
	if (!this.priv.sender)
		throw new InvalidStateError();
	//Replace track
	return this.priv.sender.replaceTrack(track ? track.priv.track : null);
};

RTCRtpSender.prototype.getStats = function() 
{
	return this.priv.pc.getStats(this);
};

Object.defineProperty(RTCRtpSender, 'name', { enumerable: false, configurable: true, writable: false, value: "RTCRtpSender" });
Object.defineProperty(RTCRtpSender, 'prototype'	, { writable:false });
module.exports = RTCRtpSender;
