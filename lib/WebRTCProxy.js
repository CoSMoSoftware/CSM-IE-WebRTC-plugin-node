var browser = require('detect-browser').detect();

var WebRTCProxy = null;

//If it is internet explorer
if (browser.name === 'ie') {
    // Create singleton
    try {
        WebRTCProxy = new ActiveXObject('Cosmo.WebRTCProxy.1');
    } catch (e) {
        console.error('IE WebRTC Plugin not installed');
    }
}

module.exports = WebRTCProxy;