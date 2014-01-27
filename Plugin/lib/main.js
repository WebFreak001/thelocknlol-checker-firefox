var data = require("sdk/self").data;
require("sdk/tabs").on("ready", checkThings);
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

var pageWorker = require("sdk/page-worker").Page({
	contentScript: require("sdk/self").data.url("script.js")
});

function checkThings(tab)
{
	var xmlhttp, xhttp;
	xmlhttp = new window.XMLHttpRequest();
	xmlhttp.onreadystatechange = function ()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			if (xmlhttp.responseText.trim().replace(" ", "") == "[]")
			{
				isTwitchOnline = false;
			} else
			{
				if (!isTwitchOnline)
				{
					notify("TheLockNLol livestreamt nun!", "TheLockNLol ist grade auf twitch.tv online gekommen! Klick mich um dorthin zu gelangen.", "http://www.twitch.tv/TheLockNLol");
					document.write('<audio id="player" src="sfx.wav" >');
					document.getElementById('player').play();
				}
				isTwitchOnline = true;
			}
		}
	}
	xmlhttp.open("GET", "http://api.justin.tv/api/stream/list.json?channel=TheLockNLol", false);
	xmlhttp.send();

	//http://gdata.youtube.com/feeds/api/users/TheLockNLol/uploads?max-results=10
	xhttp = new window.XMLHttpRequest();
	xhttp.open("GET", "http://gdata.youtube.com/feeds/api/users/TheLockNLol/uploads?max-results=5", false);
	xhttp.send();
	var xml = xhttp.responseXML;
	var author = xml.getElementsByTagName("author")[0].childNodes[0].nodeValue;
	var entries = xml.getElementsByTagName("entry");
	var lastID = "";
	for (var i = 0; i < entries.length; i++)
	{
		var id = entries[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
		var title = entries[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
		if (id == ss.storage.lastVideo) break;
		notify("TheLockNLol hat ein neues Video hochgeladen!", title, "http://www.youtube.com/watch?v=" + id.substring(42));
		if (lastID == "") lastID = id;
	}
	if (lastID != "") ss.storage.lastVideo = lastID;
	window.setTimeout(checkThings, 5000);
};

var play = function ()
{
	pageWorker.Page({
		contentScript: "var audio = new Audio('" + data.url("sfx.wav") + "'); audio.play();",
		contentURL: data.url("sound.html")
	});
}