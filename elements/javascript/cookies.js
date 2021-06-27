var cookies;

// Get from local Storage
if (localStorage.getItem("cookies") == "true") {
	cookies = true;
}

// Accept Cookies
function setCookies() {
	localStorage.setItem("cookies", "true");
	cookies = true;
	document.getElementById("cookie_box").remove();
}

function removeCookies() {
	document.getElementById("cookie_box").remove();
}

// Ask for Cookies
if (cookies == undefined) {
	var element = `
	<h3>Cookies</h3>
	<p><small>By clicking "Accept", you agree that this Website can store your Settings on your device.</small></p>
	<div class="cookie_box_flex">
		<div class="button accept_button" onclick="setCookies()">Accept</div>
		<div class="button" onclick="removeCookies()">Decline</div>
	</div>
	`;

	var cookie_box = document.createElement("div");
	cookie_box.innerHTML = element;
	cookie_box.id = "cookie_box";

	var el_last_script = document.getElementsByTagName("script");
	var el_last_script = el_last_script[el_last_script.length - 1];
	el_last_script.parentNode.insertBefore(cookie_box, el_last_script.nextSibling);
}