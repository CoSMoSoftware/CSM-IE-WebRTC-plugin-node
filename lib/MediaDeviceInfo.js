/*
[[Exposed=Window, SecureContext]
interface MediaDeviceInfo {
    readonly        attribute DOMString       deviceId;
    readonly        attribute MediaDeviceKind kind;
    readonly        attribute DOMString       label;
    readonly        attribute DOMString       groupId;
    [Default] object toJSON();
};
*/
var MediaDeviceInfo = function(deviceId, kind, label, groupId)
{
	Object.defineProperty(this, 'deviceId'	, { enumerable: true, configurable: false, get: function(){ return deviceId;	}});
	Object.defineProperty(this, 'kind'	, { enumerable: true, configurable: false, get: function(){ return kind;	}});
	Object.defineProperty(this, 'label'	, { enumerable: true, configurable: false, get: function(){ return label;	}});
	Object.defineProperty(this, 'groupId'	, { enumerable: true, configurable: false, get: function(){ return groupId;	}});
	
	return this;
};


MediaDeviceInfo.prototype.toJSON = function()
{
	return JSON.stringify ({
		deviceId	: this.deviceId,
		kind		: this.kind,
		label		: this.label,
		groupId		: this.groupId
	});
};

Object.defineProperty(MediaDeviceInfo, 'name'		, { enumerable: false, configurable: true, writable: false, value: "MediaDeviceInfo" });
module.exports = MediaDeviceInfo;
