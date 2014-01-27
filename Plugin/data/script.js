if (!localStorage["refreshRate"]) localStorage["refreshRate"] = "5000";
if (!localStorage['video']) localStorage['video'] = "1";
if (!localStorage['livestream']) localStorage['livestream'] = "1";
if (!localStorage['sound']) localStorage['sound'] = "1";
if (!localStorage['lastVideo']) localStorage['lastVideo'] = "";

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
	if (localStorage['livestream'] == "1")
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
						if (localStorage['sound'] == "1") document.write('<audio id="player" src="sfx.wav" >');
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
	if (localStorage['video'] == "1")
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
			if (id == localStorage['lastVideo']) break;
			notify("TheLockNLol hat ein neues Video hochgeladen!", title, "http://www.youtube.com/watch?v=" + id.substring(42));
			if(lastID == "") lastID = id;
		}
		if(lastID != "") localStorage['lastVideo'] = lastID;
	}
}

function process()
{
	checkTwitch();
	checkYoutube();
	var nextDelay = parseInt(localStorage["refreshRate"]);
	console.log(nextDelay);
	console.log("[TheLockNLol Checker] checking...");
	window.setTimeout(process, nextDelay);
}


self.port.on("start", function ()
{
	alert("Started");
	console.log("[TheLockNLol Checker] Started checking");
	window.addEventListener("load", process);
});