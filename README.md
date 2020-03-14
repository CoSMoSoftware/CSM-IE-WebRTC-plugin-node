# CSM-IE-WebRTC shim
WebRTC shim for IE based on the
[CSM-IE-WebRTC-plugin](https://github.com/CoSMoSoftware/CSM-IE-WebRTC-plugin).
The plugin should be compiled, installed and registered first, before using this shim.

## Prerequesite

Enable ActiveX in IE11
https://support.microsoft.com/en-us/help/17469/windows-internet-explorer-use-activex-controls

Install Node.js

## Install and package the JS layer

Warning, this supposes that you have compiled, installed and registered the ActiveX plugin first.

Install dev depencies (browserify and babel) globaly:
```
npm install --only=dev -g
```

Install project dependencies
```
npm install
```

Create bundled package (not minimized):
```
npm run-script browserify
```

## Usage

Just add the bundled js package into your page:
```html
<script src="dist/webrtc-ie-shim.js" type="text/javascript" async></script>
```

## Validation: Run WTP tests
The W3C test suite (WPT) has ben modified to use this shim and the plugin.
See \wpt\README.md for more info.

```
npm test
```

Results
```
         [ie |cr |fi |eg |sa |TOTAL]
2018 m65 [270|360|394| 99|   | 1099]
2020 m73 [272|759|571|   |   | 1099]
```
 
# Documentation
The following webrtc 1.0 apis are supported:

- MediaDevices
```
	attribute EventHandler ondevicechange;
	Promise<sequence<MediaDeviceInfo>> enumerateDevices();
	//TODO: MediaTrackSupportedConstraints getSupportedConstraints();
	Promise<MediaStream>		getUserMedia(optional MediaStreamConstraints constraints);
```
- RTCPeerConnection [spec](https://www.w3.org/TR/webrtc/#peer-to-peer-connections),
[idl 1](https://www.w3.org/TR/webrtc/#interface-definition),
[idl 2](https://www.w3.org/TR/webrtc/#rtcpeerconnection-interface-extensions)
```
	Promise<RTCSessionDescriptionInit> createOffer(optional RTCOfferOptions options);
	Promise<RTCSessionDescriptionInit> createAnswer(optional RTCAnswerOptions options);
	Promise<void>                      setLocalDescription(RTCSessionDescriptionInit description);

	readonly attribute RTCSessionDescription? localDescription;
	readonly attribute RTCSessionDescription? currentLocalDescription;
	readonly attribute RTCSessionDescription? pendingLocalDescription;

	Promise<void>                      setRemoteDescription(RTCSessionDescriptionInit description);

	readonly attribute RTCSessionDescription? remoteDescription;
	readonly attribute RTCSessionDescription? currentRemoteDescription;
	readonly attribute RTCSessionDescription? pendingRemoteDescription;

	Promise<void>                      addIceCandidate((RTCIceCandidateInit or RTCIceCandidate) candidate);

	readonly attribute RTCSignalingState      signalingState;
	readonly attribute RTCIceGatheringState   iceGatheringState;
	readonly attribute RTCIceConnectionState  iceConnectionState;
	readonly attribute RTCPeerConnectionState connectionState;
	//TODO: readonly attribute boolean?               canTrickleIceCandidates;
        //TODO: void restartIce();

	static sequence<RTCIceServer>      getDefaultIceServers(); **
	//TODO: RTCConfiguration                   getConfiguration();
	//TODO: void                               setConfiguration(RTCConfiguration configuration);
	void                               close();

	attribute EventHandler           onnegotiationneeded;
	attribute EventHandler           onicecandidate;
	attribute EventHandler           onicecandidateerror;
	attribute EventHandler           onsignalingstatechange;
	attribute EventHandler           oniceconnectionstatechange;
	attribute EventHandler           onicegatheringstatechange;
	attribute EventHandler           onconnectionstatechange;
	//TODO: sequence<RTCRtpSender>      getSenders();
	//TODO: sequence<RTCRtpReceiver>    getReceivers();
	//TODO: sequence<RTCRtpTransceiver> getTransceivers();
	RTCRtpSender                addTrack(MediaStreamTrack track, MediaStream... streams);
	void                        removeTrack(RTCRtpSender sender);
	//TODO: RTCRtpTransceiver           addTransceiver((MediaStreamTrack or DOMString) trackOrKind, optional RTCRtpTransceiverInit init);
	attribute EventHandler ontrack;
```
- MediaStream
```
	readonly attribute DOMString    id;
	sequence<MediaStreamTrack> getAudioTracks();
	sequence<MediaStreamTrack> getVideoTracks();
	sequence<MediaStreamTrack> getTracks();
	MediaStreamTrack?          getTrackById(DOMString trackId);
	void                       addTrack(MediaStreamTrack track);
	void                       removeTrack(MediaStreamTrack track);
	MediaStream                clone();
	readonly attribute boolean      active;
		 attribute EventHandler		onaddtrack;
		 attribute EventHandler		onremovetrack;
```
- MediaStreamTrack
```
    readonly attribute DOMString             kind;
    readonly attribute DOMString             id;
    readonly attribute DOMString             label;
             attribute boolean               enabled;
    readonly attribute boolean               muted;
    //TODO:  attribute EventHandler          onmute;
    //TODO:  attribute EventHandler          onunmute;
    readonly attribute MediaStreamTrackState readyState;
    //TODO:  attribute EventHandler          onended;
    //TODO: MediaStreamTrack       clone();
    void                   stop();
    //TODO: MediaTrackCapabilities getCapabilities();
    //TODO:vMediaTrackConstraints  getConstraints();
    //TODO: MediaTrackSettings     getSettings();
    //TODO: Promise<void>          applyConstraints(optional MediaTrackConstraints constraints);
    //TODO: attribute EventHandler          onoverconstrained;
```
- RTPSender [idl](https://www.w3.org/TR/webrtc/#rtcrtpsender-interface)
```
    readonly attribute MediaStreamTrack? track;
    //TODO: readonly attribute RTCDtlsTransport? transport;
    //TODO: readonly attribute RTCDtlsTransport? rtcpTransport; **
    //TODO: static RTCRtpCapabilities getCapabilities(DOMString kind);
    //TODO: Promise<void>           setParameters(optional RTCRtpParameters parameters);
    //TODO: RTCRtpParameters        getParameters();
    //TODO: Promise<void>           replaceTrack(MediaStreamTrack? withTrack);
    //TODO: void                    setStreams(MediaStream... streams);
    //TODO: Promise<RTCStatsReport> getStats();
```
- RTPReceiver [idl](https://www.w3.org/TR/webrtc/#rtcrtpreceiver-interface)
```
  readonly attribute MediaStreamTrack track;
  readonly attribute RTCDtlsTransport? transport;
  static RTCRtpCapabilities? getCapabilities(DOMString kind);
  RTCRtpReceiveParameters getParameters();
  sequence<RTCRtpContributingSource> getContributingSources();
  sequence<RTCRtpSynchronizationSource> getSynchronizationSources();
  Promise<RTCStatsReport> getStats();
```
- RTPTransceiver
```
  readonly attribute DOMString? mid;
  [SameObject] readonly attribute RTCRtpSender sender;
  [SameObject] readonly attribute RTCRtpReceiver receiver;
  attribute RTCRtpTransceiverDirection direction;
  readonly attribute RTCRtpTransceiverDirection? currentDirection;
  void stop();
  void setCodecPreferences(sequence<RTCRtpCodecCapability> codecs);
```
- Stats
- DTMF
- DataChannel


# License

Apache License Version 2.0, 
January 2004
http://www.apache.org/licenses/
