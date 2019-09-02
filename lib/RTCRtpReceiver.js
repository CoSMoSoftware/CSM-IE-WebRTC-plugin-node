/*
[Exposed=Window]
interface RTCRtpReceiver {
    readonly attribute MediaStreamTrack  track;
    readonly attribute RTCDtlsTransport? transport;
    readonly attribute RTCDtlsTransport? rtcpTransport;
    // Feature at risk
    static RTCRtpCapabilities             getCapabilities(DOMString kind);
    RTCRtpParameters                      getParameters();
    sequence<RTCRtpContributingSource>    getContributingSources();
    sequence<RTCRtpSynchronizationSource> getSynchronizationSources();
    Promise<RTCStatsReport>               getStats();
};

 */

var RTCRtpReceiver = function (track) {
    var priv = {
        track: track
    };

    //Read only
    Object.defineProperty(this, 'track', {
        enumerable: true, configurable: false, get: function () {
            return priv.track;
        }
    });
    //Not implemented
    Object.defineProperty(this, 'transport', {
        enumerable: true, configurable: false, get: function () {
            return null;
        }
    });
    Object.defineProperty(this, 'rtcpTransport', {
        enumerable: true, configurable: false, get: function () {
            return null;
        }
    });
};

RTCRtpReceiver.getCapabilities = function (kind) {
    throw 'Not implemented yet';
};

RTCRtpReceiver.getParameters = function () {
    throw 'Not implemented yet';
};

RTCRtpReceiver.getContributingSources = function () {
    throw 'Not implemented yet';
};
RTCRtpReceiver.getSynchronizationSources = function () {
    throw 'Not implemented yet';
};
RTCRtpReceiver.getStats = function () {
    return Promise.reject(new Error('Not implemented yet'));
};

Object.defineProperty(RTCRtpReceiver, 'name', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: 'RTCRtpReceiver'
});
Object.defineProperty(RTCRtpReceiver, 'prototype', {writable: false});
module.exports = RTCRtpReceiver;