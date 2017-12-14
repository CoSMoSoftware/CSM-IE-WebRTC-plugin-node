/*
[Exposed=Window]
interface RTCRtpSender {
    readonly attribute MediaStreamTrack? track;
    readonly attribute RTCDtlsTransport? transport;
    readonly attribute RTCDtlsTransport? rtcpTransport;
    // Feature at risk
    static RTCRtpCapabilities getCapabilities(DOMString kind);
    Promise<void>           setParameters(optional RTCRtpParameters parameters);
    RTCRtpParameters        getParameters();
    Promise<void>           replaceTrack(MediaStreamTrack? withTrack);
    Promise<RTCStatsReport> getStats();
};
*/
var RTCRtpSender = function(sender,track)
{
	//Add to map
	this.priv = {
		sender : sender,
		track  : track
	};
	
	Object.defineProperty(this, 'track'		, { enumerable: true, configurable: false, get: function(){ return priv.track;		}});
	Object.defineProperty(this, 'transport'		, { enumerable: true, configurable: false, get: function(){ new Error("Not supported yet");	}});
	Object.defineProperty(this, 'rtcpTransport'	, { enumerable: true, configurable: false, get: function(){ new Error("Not supported yet");	}});
	
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
	throw new Error("Not supported yet");
};

module.exports = RTCRtpSender;