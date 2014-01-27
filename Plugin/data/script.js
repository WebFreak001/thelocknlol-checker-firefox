var refreshRate = 5000, video = "1", livestream = "1", sound = "1", lastVideo = "";

function notify(title, description, link)
{
	console.log("[TheLockNLol Checker] Notification: " + title + " " + description);
	var notification = new Notification(title, { "body": description, "icon": "koala48.png" })
	
	notification.onclick = function ()
	{
		window.open(link);
		notification.close();
	}
	notification.show();
	window.setTimeout(function () { notification.close(); }, 10000);
}

var isTwitchOnline = false;

function checkTwitch()
{
	if (livestream == "1")
	{
		if (window.XMLHttpRequest)
		{
			xmlhttp = new XMLHttpRequest();
		}
		else
		{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
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
						if (sound == "1") document.write('<audio id="player" src="sfx.wav" >');
						document.getElementById('player').play();
					}
					isTwitchOnline = true;
				}
			}
		}
		xmlhttp.open("GET", "http://api.justin.tv/api/stream/list.json?channel=TheLockNLol", false);
		xmlhttp.send();
	}
}

function checkYoutube()
{
	if (video == "1")
	{
		//http://gdata.youtube.com/feeds/api/users/TheLockNLol/uploads?max-results=10
		if (window.XMLHttpRequest)
		{
			xhttp = new XMLHttpRequest();
		}
		else // code for IE5 and IE6
		{
			xhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
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
			if (id == lastVideo) break;
			notify("TheLockNLol hat ein neues Video hochgeladen!", title, "http://www.youtube.com/watch?v=" + id.substring(42));
			if(lastID == "") lastID = id;
		}
		if(lastID != "") setValue("lastVideo", lastID);
	}
}

function process()
{
	console.log("[TheLockNLol Checker] checking...");
	checkTwitch();
	checkYoutube();
}

self.port.on("start-process-interval", function ()
{
	console.log("[TheLockNLol Checker] Started checking");
	window.setInterval(process, 5000);
});

function setValue(a, v)
{
	self.port.emit("set-value", a, v);
	self.port.emit("get-value", a);
}

self.port.on("give-value", function (a, v)
{
	if (a == "refreshRate") refreshRate = v;
	if (a == "video") video = v;
	if (a == "livestream") livestream = v;
	if (a == "sound") sound = v;
	if (a == "lastVideo") lastVideo = v;
});