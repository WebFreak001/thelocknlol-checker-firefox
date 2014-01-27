if (!localStorage['video']) localStorage['video'] = "1";
if (!localStorage['livestream']) localStorage['livestream'] = "1";
if (!localStorage['sound']) localStorage['sound'] = "1";
document.getElementById("vid").checked = localStorage['video'] == '1' ? true : false;
document.getElementById("live").checked = localStorage['livestream'] == '1' ? true : false;
document.getElementById("sound").checked = localStorage['sound'] == '1' ? true : false;
document.getElementById("vid").addEventListener("change", function () { localStorage['video'] = document.getElementById("vid").checked ? '1' : '0' });
document.getElementById("live").addEventListener("change", function () { localStorage['livestream'] = document.getElementById("live").checked ? '1' : '0' });
document.getElementById("sound").addEventListener("change", function () { localStorage['sound'] = document.getElementById("sound").checked ? '1' : '0' });