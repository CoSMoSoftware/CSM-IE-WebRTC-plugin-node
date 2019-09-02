
// This obvserver checks when a video element has been set a srcObj
var videoObserver = new MutationObserver(function (mutations) {
	for (var i = 0, numMutations = mutations.length; i < numMutations; i++) 
	{
		var mutation = mutations[i];
		// HTML video element.
		if (mutation.target.videoRenderer)
			mutation.target.videoRenderer.mutate(mutation);
	}
});

var CLASSID="CLSID:B8E874D9-72BA-4E54-B59B-3513081DF516";

	
function VideoRenderer(video) 
{
	var srcObject;
	var self = this;
	//Store video element
	this.video = video;
	
	//Create a new video renderer object
	var object = this.object = document.createElement("object");
	//Set csid
	this.object.classid = CLASSID;
	//Apped it hidden
	video.appendChild(this.object);
	
	// Add .src observer to the video element.
	videoObserver.observe(video, {
		// Set to true if additions and removals of the target node's child elements (including text
		// nodes) are to be observed.
		childList: false,
		// Set to true if mutations to target's attributes are to be observed.
		attributes: true,
		// Set to true if mutations to target's data are to be observed.
		characterData: false,
		// Set to true if mutations to not just target, but also target's descendants are to be observed.
		subtree: false,
		// Set to true if attributes is set to true and target's attribute value before the mutation
		// needs to be recorded.
		attributeOldValue: true,
		// Set to true if characterData is set to true and target's data before the mutation needs to be
		// recorded.
		characterDataOldValue: false
		// Set to an array of attribute local names (without namespace) if not all attribute mutations
		// need to be observed.
		//attributeFilter: [ 'srcObject']
	});
	// Define srcObject properties
	Object.defineProperty(video, 'srcObject'		, { 
		enumerable	: true, 
		configurable	: true,
		get		: function() {
			return srcObject;
		},
		set		: function(stream) {
			//We need to fire metadata event when we get first resize
			var needsmetadata = true;
			//Attach resize event
			object.onresize = function() 
			{	
				//Create event
				var event = document.createEvent("Event");
				//Init metadata or resize event
				event.initEvent(needsmetadata ? "loadedmetadata" : "resize", false, false);
				//Dispatch it
				video.dispatchEvent(event);
				//No more medatada event
				needsmetadata = false;
			};
			//Get stream track video stream
			var videoTracks = stream.getVideoTracks();
			//If found any
			if (videoTracks.length)
				//Set native video track on video renderer object
				object.setTrack(videoTracks[0].priv.track);
			//Store it
			srcObject = stream;
			//Show renderer
			self.show();
		}
	});

	// Override properties
	Object.defineProperty(video, 'videoWidth'  , { enumerable : true, configurable : true, get : function() { return object.videoWidth; }} );
	Object.defineProperty(video, 'videoHeight' , { enumerable : true, configurable : true, get : function() { return object.videoHeight; }} );
	//TODO: clone attributes
}

VideoRenderer.prototype.mutate = function(mutation)
{
	//Get mutation type
	//TODO: clone attributes
};

VideoRenderer.prototype.close = function()
{
	//Hide video object
	this.hide();
	//Unobserver video element
	videoObserver.disconnect();
	//Remove srcObject property
	Object.defineProperty(this.video,'srcObject',{});
	Object.defineProperty(this.video,'videoWidth',{});
	Object.defineProperty(this.video,'videoHeigth',{});
	//delete object, IE only method
	this.object.removeNode(false);
	delete(this.object);
	
};

VideoRenderer.handle = function(video)
{
	if (!video.videoRenderer)
		video.videoRenderer = new VideoRenderer(video);
};

VideoRenderer.unhandle = function(video)
{
	if (video.videoRenderer)
	{
		video.videoRenderer.close();
		delete(video.videoRenderer);
	}
};

VideoRenderer.prototype.show = function()
{
	//Check object is not shown
	if (this.video!==this.object.parentElement)
		//Nothing
		return;
	//Swap them
	this.video.parentNode.replaceChild(this.object,this.video);
	this.object.appendChild(this.video);
};

VideoRenderer.prototype.hide = function()
{
	//Check object is not shown
	if (this.object!==this.video.parentElement)
		//Nothing
		return;
	//Swap them
	this.object.parentNode.replaceChild(this.video,this.object);
	this.video.appendChild(this.object);
};

module.exports = VideoRenderer;