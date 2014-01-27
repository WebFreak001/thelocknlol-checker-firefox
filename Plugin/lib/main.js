var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");
var pnl = require("sdk/panel").Panel({
	width: 370,
	height: 200,
	contentURL: data.url("popup.html"),
	contentScriptFile: data.url("config.js")
});

require("sdk/widget").Widget({
	label: "Text entry",
	id: "text-entry",
	contentURL: data.url("koala48.png"),
	panel: pnl
});

pnl.port.on("example-click", function ()
{
	notify("Example", "this is a example", "http://www.google.com");
});

var pageWorker = require("sdk/page-worker").Page({
	contentScript: require("sdk/self").data.url("script.js")
});

pageWorker.port.emit("start");