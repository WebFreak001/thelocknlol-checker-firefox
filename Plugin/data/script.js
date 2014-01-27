var refreshRate = 5000, video = "1", livestream = "1", sound = "1", lastVideo = "";
var note = false;

function notify(title, description, link)
{
	self.port.emit("notify", title, description, link);
}

var isTwitchOnline = false;

function process()
{
	console.log("[TheLockNLol Checker] checking...");
	requestExternal();
}

self.port.on("start-process-interval", function ()
{
	process();
	console.log("[TheLockNLol Checker] Started checking");
	window.setInterval(process, 5000);
});

function setValue(a, v)
{
	self.port.emit("set-value", a, v);
	self.port.emit("get-value", a);
}

function requestExternal()
{
	self.port.emit("ext-pls", "http://api.justin.tv/api/stream/list.json?channel=TheLockNLol");
	self.port.emit("ext-pls", "http://gdata.youtube.com/feeds/api/users/TheLockNLol/uploads?max-results=5");
}

self.port.on("receive-ext", function (a, v)
{
	if (a == "http://api.justin.tv/api/stream/list.json?channel=TheLockNLol")
	{
		if (v.trim().replace(" ", "") == "[]")
		{
			isTwitchOnline = false;
		} else
		{
			if (!isTwitchOnline)
			{
				notify("TheLockNLol livestreamt nun!", "TheLockNLol ist grade auf twitch.tv online gekommen! Klick mich um dorthin zu gelangen.", "http://www.twitch.tv/TheLockNLol");
				if (sound == "1") self.port.emit("playsound", "sfx.wav");
			}
			isTwitchOnline = true;
		}
	}
	if (a == "http://gdata.youtube.com/feeds/api/users/TheLockNLol/uploads?max-results=5")
	{
		var parser = new DOMParser();
		var xml = parser.parseFromString(v, "text/xml");
		var author = xml.getElementsByTagName("author")[0].childNodes[0].nodeValue;
		var entries = xml.getElementsByTagName("entry");
		var lastID = "";
		for (var i = 0; i < entries.length; i++)
		{
			var id = entries[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
			var title = entries[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
			if (id == lastVideo) break;
			notify("TheLockNLol hat ein neues Video hochgeladen!", title, "http://www.youtube.com/watch?v=" + id.substring(42));
			if (lastID == "") lastID = id;
		}
	}
});

self.port.on("give-value", function (a, v)
{
	if (a == "refreshRate") refreshRate = v;
	if (a == "video") video = v;
	if (a == "livestream") livestream = v;
	if (a == "sound") sound = v;
	if (a == "lastVideo") lastVideo = v;
});