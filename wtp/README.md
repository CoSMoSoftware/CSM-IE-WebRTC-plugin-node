# Web Platform Tests
This test have been extracted from https://github.com/w3c/web-platform-tests but they are written in es6 which is not supported by IE.

In order to do so you have to use `babel` them in order to run properly (some even require a bit or manual changing, see commit history) so they can run.

`
babel --presets es2015-ie wtp\resources\idlharness.js -o wtp\resources\idlharness.js
`

For changing the inline javascript inside the html we have used https://github.com/murillo128/babel-html

## Add support for the plugin to the tests

IE plugins needs a js shim/adapter in order to provide the WebRTC shim objects, so we have included in each test the following line:

```
<script src="/resources/webrtc-ie-shim.js"></script>
```

You can create the javascript file for the Cosmo plugin by running

```
npm run-script browserify
```

This will create a file located on the `dist` folder and a copy of it on the `wtp\resources\` folder.

In order to test Temasys plugin for commparation, we have grabed their adapter.js from https://cdn.temasys.com.sg/adapterjs/0.15.x/adapter.debug.js and appended a Promise polyfill in order to run the tests. You will need to override the `wtp\resources\webrtc-ie-shim.js` with `wtp\resources\temasys.adapter.debug.js` before running the tests for temasys plugin.

## Running the tests

You just need to do 

```
npm test
```

Test results will be extracted and printed a resume to stdout and the full dump to `out.html`

In order to change the browser, edit the `wpt\wpt.js` and set the target browser in 

```
	//Create driver
	const driver = await new Builder ().forBrowser ('internet explorer').build ();
```

You can set (at least) `internet explorer` `chrome` or `firefox`
