var data = require("sdk/self").data;
var Request = require("sdk/request").Request;
var ss = require("sdk/simple-storage");
var chrom = require('chrome');
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

var pageWorker = require("sdk/page-worker").Page({
	contentScriptFile: data.url("script.js")
});

var pg = require("sdk/page-mod").PageMod({
	include: ["*"],
	contentScriptFile: data.url("script.js"),
	onAttach: function (pageWorker)
	{
		pageWorker.port.on("get-value", function (a)
		{
			pageWorker.port.emit("give-value", a, ss.storage[a]);
		});

		pageWorker.port.on("set-value", function (a, v)
		{
			ss.storage[a] = v;
		});

		pageWorker.port.on("ext-pls", function (a)
		{
			console.log("Requesting " + a);
			var request = Request({
				url: a,
				onComplete: function (response)
				{
					pageWorker.port.emit("receive-ext", a, response.text);
				}
			}).get();
		});

		pageWorker.port.emit("start-process-interval");
	}
});