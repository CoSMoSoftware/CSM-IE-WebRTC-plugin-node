/*
 [Exposed=Window]
 interface RTCRtpTransceiver {
    readonly attribute DOMString?                  mid;
    [SameObject]
    readonly attribute RTCRtpSender                sender;
    [SameObject]
    readonly attribute RTCRtpReceiver              receiver;
             attribute RTCRtpTransceiverDirection  direction;
    readonly attribute RTCRtpTransceiverDirection? currentDirection;
    void stop();
    void setCodecPreferences(sequence<RTCRtpCodecCapability> codecs);
};

 */
var RTPRtcTransceiver = function(transceiver,sender,receiver)
{

	//Private attributes
	var priv = this.priv = {
		transceiver	: transceiver,
		sender		: sender,
		receiver	: receiver,
	};
	
	//Read only
	Object.defineProperty(this, "mid"		, { enumerable: true, configurable: false, get: function() { return priv.transceiver.mid;		}});
	Object.defineProperty(this, "sender"		, { enumerable: true, configurable: false, get: function() { return priv.sender;			}});
	Object.defineProperty(this, "receiver"		, { enumerable: true, configurable: false, get: function() { return priv.receiver;			}});
	Object.defineProperty(this, "currentDirection"	, { enumerable: true, configurable: false, get: function() { return priv.transceiver.currentDirection;	}});
	
	//REad and write
	Object.defineProperty(this, "direction"		, { enumerable: true, configurable: false, 
		get: function() {
			return priv.transceiver.direction;	
		},
		set: function(direction) {
			priv.transceiver.direction = direction;
			return direction;	
		}
	});

};

RTPRtcTransceiver.prototype.stop = function()
{
	this.priv.transceiver.stop();
};

Object.defineProperty(RTPRtcTransceiver, 'name'		, { enumerable: false, configurable: true, writable: false, value: "RTPRtcTransceiver" });
Object.defineProperty(RTPRtcTransceiver, 'prototype'	, { writable:false });
module.exports = RTPRtcTransceiver;
