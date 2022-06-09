var date = new Date().getFullYear()

var footer = `
<div class="footer_left footer_block">©2019 - ${date} by CMD-Golem</div>
<div class="footer_center footer_block">
	<a href="https://cmd-golem.com/info/disclaimer.html">Disclaimer</a>
	<a href="https://cmd-golem.com/info/therms_of_use.html">Therms of use</a>
	<a href="https://cmd-golem.com/info/compatibility.html">Compatibility</a>
</div>
<div class="footer_right footer_block">
	<a href="https://twitter.com/CmdGolem"><img src="https://cmd-golem.com/elements/nav/twitter.svg" title="Twitter" target="_blank"></a>
	<a href="https://www.youtube.com/channel/UCy8xWmgIga8nL1kPYJ8TD2g"><img src="https://cmd-golem.com/elements/nav/youtube.svg" title="Youtube" target="_blank"></a>
	<a href="https://www.planetminecraft.com/member/cmd-golem"><img src="https://cmd-golem.com/elements/nav/planet_minecraft.webp" title="Planet Minecraft" target="_blank"></a>
</div>
`;

document.getElementsByTagName("footer")[0].innerHTML = footer;