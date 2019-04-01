var browser = require("detect-browser").detect();

var WebRTCProxy;

//If it is internet exploer
if (browser.name === "ie") {
	// Create singleton
	try {
		WebRTCProxy = new ActiveXObject("Cosmo.WebRTCProxy.1");
	} catch(e) {
		console.error(e)
	}
}

module.exports = WebRTCProxy;