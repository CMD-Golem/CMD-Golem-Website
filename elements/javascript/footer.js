var date = new Date().getFullYear()

var footer = `
<div class="footer_left footer_block">©2019 - ${date} by CMD-Golem</div>
<div class="footer_center footer_block">
	<a href="/info/disclaimer.html">Disclaimer</a>
	<a href="/info/therms_of_use.html">Therms of use</a>
	<a href="/info/compatibility.html">Compatibility</a>
</div>
<div class="footer_right footer_block">
	<a href="https://twitter.com/CmdGolem" target="_blank" title="Twitter">
		<svg viewBox="0 0 246 200">
			<path d="M220.815 49.7895C220.965 51.9593 220.965 54.1292 220.965 56.3191C220.965 123.045 170.196 200 77.3628 200V199.96C49.9396 200 23.0859 192.141 0 177.321C3.98757 177.801 7.99513 178.041 12.0127 178.051C34.7388 178.071 56.8154 170.442 74.6945 156.393C53.0976 155.983 34.1592 141.894 27.5432 121.325C35.1086 122.785 42.9038 122.485 50.3293 120.455C26.7837 115.695 9.844 94.9966 9.844 70.9581C9.844 70.7382 9.844 70.5282 9.844 70.3182C16.8597 74.2279 24.7149 76.3978 32.75 76.6378C10.5736 61.8087 3.73772 32.2906 17.1296 9.21204C42.7539 40.7601 80.5609 59.9388 121.146 61.9687C117.079 44.4298 122.635 26.051 135.747 13.7218C156.075 -5.39704 188.045 -4.4171 207.154 15.9116C218.457 13.6818 229.29 9.53202 239.204 3.65239C235.436 15.3417 227.551 25.271 217.018 31.5806C227.022 30.4007 236.796 27.7209 246 23.6311C239.224 33.7905 230.689 42.6399 220.815 49.7895Z" fill="#1D9BF0"/>
		</svg>
	</a>
	<a href="https://www.youtube.com/channel/UCy8xWmgIga8nL1kPYJ8TD2g" target="_blank" title="YouTube">
		<svg viewBox="0 0 90 64">
			<rect x="31" y="17" width="30" height="30" fill="#FFFFFF"/>
			<path d="M44.9877 1.60527e-07C44.9877 1.60527e-07 16.8477 -0.00522923 9.83183 1.87656C5.96458 2.91377 2.90759 5.96336 1.87039 9.83809C-0.00398172 16.8541 7.12697e-08 31.5016 7.12697e-08 31.5016C7.12697e-08 31.5016 0.00091366 46.149 1.88269 53.1651C2.91989 57.0398 5.9633 60.0834 9.83798 61.1204C16.8539 63.0023 45 63.0031 45 63.0031C45 63.0031 73.1402 63.0023 80.1559 61.1204C84.0308 60.0834 87.0803 57.0398 88.1173 53.1651C89.9992 46.149 90 31.5016 90 31.5016C90 31.5016 89.9928 16.8541 88.1112 9.83809C87.0738 5.96336 84.0244 2.91377 80.1497 1.87656C73.1338 -0.00523768 44.9877 1.60527e-07 44.9877 1.60527e-07ZM35.9988 18.0027L59.3724 31.5016L35.9988 45.0005V18.0027Z" fill="#FF0000"/>
		</svg>
	</a>
	<a href="https://www.planetminecraft.com/member/cmd-golem" target="_blank" title="Planet Minecraft">
		<svg viewBox="0 0 56 58">
			<g id="water">
				<path d="M0 38V36H19V38H52V47H51V48H50V49H47V51H46V52H45V53H44V54H38V56H37V57H36V58H20V57H19V56H18V54H11V53H10V52H9V51H8V49H6V48H5V47H4V40H2V39H1V38H0Z" fill="#012647"/>
				<path d="M9 4H46V45H9V4Z" fill="#278EED"/><path d="M5 35H9V36H5V35Z" fill="#278EED"/>
				<path d="M10 8H37V36H10V8Z" fill="#3DA2FF"/><path d="M37 18H42V32H37V18Z" fill="#3DA2FF"/><path d="M28 36H33V41H28V36Z" fill="#3DA2FF"/>
				<path d="M33 36H37V41H33V36Z" fill="#2E95F4"/><path d="M37 32H42V36H37V32Z" fill="#2E95F4"/>
				<path d="M18 8H28V22H18V8Z" fill="#57AAFF"/><path d="M18 22H23V27H18V22Z" fill="#57AAFF"/>
				<path d="M33 8H37V18H33V8Z" fill="#4BA8FF"/><path d="M33 22H37V32H33V22Z" fill="#4BA8FF"/><path d="M28 27H33V36H28V27Z" fill="#4BA8FF"/><path d="M19 32H28V38H19V32Z" fill="#4BA8FF"/>
				<path d="M9 41H14V45H9V41Z" fill="#0D74D3"/><path d="M19 48H23V50H19V48Z" fill="#0D74D3"/><path d="M46 32H48V36H46V32Z" fill="#0D74D3"/><path d="M46 18H49V27H46V18Z" fill="#0D74D3"/><path d="M42 36H46V45H42V36Z" fill="#0D74D3"/><path d="M37 41H42V45H37V41Z" fill="#0D74D3"/>
				<path d="M9 45H19V50H9V45Z" fill="#014E96"/><path d="M19 50H37V55H19V50Z" fill="#014E96"/><path d="M37 45H46V50H37V45Z" fill="#014E96"/><path d="M46 36H51V45H46V36Z" fill="#014E96"/>
				<path d="M19 0H37V4H19V0Z" fill="#0157A9"/><path d="M0 18H5V36H0V18Z" fill="#0157A9"/><path d="M5 36H9V45H5V36Z" fill="#0157A9"/>
				<path d="M42 18H46V22H42V18Z" fill="#3198F7"/><path d="M51 38V36H56V38H55V39H54V40H52V38H51Z" fill="#132E2F"/>
			</g>
			<g id="land">
				<path d="M19 38H28V41H19V38Z" fill="#6EC310"/><path d="M23 14H24V16H23V14Z" fill="#6EC310"/><path d="M24 8H27V10H24V8Z" fill="#6EC310"/><path d="M24 18V16H25V17H26V18H24Z" fill="#6EC310"/><path d="M14 13V8H22V10H21V11H22V13H14Z" fill="#6EC310"/><path d="M14 22V13H9V22H5V35H9V36H14V34H12V33H10V30H11V29H14V30H15V31H16V27H18V22H14Z" fill="#6EC310"/>
				<path d="M19 45V41H34V45H19Z" fill="#57B10F"/><path d="M5 22V18H9V22H5Z" fill="#57B10F"/><path d="M9 13V8H14V13H9Z" fill="#57B10F"/><path d="M19 8V4H28V6H27V8H24V7H22V8H19Z" fill="#57B10F"/>
				<path d="M9 37V36H14V37H16V39H17V40H19V41H16V40H15V39H12V37H9Z" fill="#58AE01"/>
				<path d="M39 11V8H46V17H45V13H42V11H39Z" fill="#448001"/><path d="M49 18H51V36H48V32H46V27H49V18Z" fill="#448001"/><path d="M37 50V45H19V48H23V50H37Z" fill="#448001"/>
				<path d="M9 8V4H19V8H9V18H5V8H9Z" fill="#2A5401"/><path d="M37 8V4H46V8H51V18H56V36H51V18H46V8H37Z" fill="#2A5401"/><path d="M26 51V50H34V51H33V54H32V55H29V53H27V51H26Z" fill="#2A5401"/><path d="M51 38V36H49V37H50V38H51Z" fill="#2A5401"/>
			</g>
			<path d="M14 22V13H23V22H14Z" fill="#ffffff"/>
		</svg>
	</a>
</div>
`;

document.getElementsByTagName("footer")[0].innerHTML = footer;


// #####################################################################
// Prevent Scrolling
var body = document.getElementsByTagName("body")[0];
var prevents_scroll = false;

function preventScroll(prevent_scroll) {
	if (prevent_scroll && !prevents_scroll) {
		body.style.overflow = "hidden";
		prevents_scroll = true;
	}
	else if (!prevent_scroll && prevents_scroll) {
		body.style.overflow = "visible";
		prevents_scroll = false;
	}
}


// #####################################################################
// Footer
function spoiler(el) {
	el.classList.toggle("active");
	var panel = el.nextElementSibling;
	if (panel.style.maxHeight) {
		panel.style.maxHeight = null;
	}
	else {
		panel.style.maxHeight = panel.scrollHeight + "px";
	}
}

function closeSpoiler(el) {
	var other_el = document.getElementsByClassName("spoiler_title");
	if (el.classList.contains("active") == true) {
		var active_el = true;
	}

	for (var i = 0; i < other_el.length; i++) {
		other_el[i].classList.remove("active");
		other_el[i].nextElementSibling.style.maxHeight = null;
	}

	if (el.classList.contains("spoiler_title") == true) {
		var panel = el.nextElementSibling;
		if (active_el != true) {
			el.classList.add("active");
			panel.style.maxHeight = panel.scrollHeight + "px";
		}
	}
}