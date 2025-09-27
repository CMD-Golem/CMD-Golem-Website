// load Enchantment Names
var article_list = document.getElementById("enchantments");
var lang_list = document.getElementById("lang_list");
var lang_list_html = "";

function loadEnch(tr_code) {
	var html = "";

	for (var i = 0; i < article_array.length; i++) {
		var article = article_array[i];
		var tr_current = "";

		if (article.style.includes("vanilla")) { continue; }
		else if (article.style.includes("nooptions")) { continue; }
		else if (tr_code != 0) {
			tr_current = ' value="' + article.title[tr_code] + '\"';
		}
		
		html += `<input type="text" id="${article.ench[0]}" placeholder="${article.title[0]}"${tr_current} onkeyup="inputEdited(this)" class="autofillable">\n`;
	}

	article_list.innerHTML = html;
}

// load existing languages
loadEnch(0);

for (var i = 0; i < translation_array.length; i++) {
	lang_list_html += `<option value="${translation_array[i].lang}", id="${i}"></option>`;
}
lang_list.innerHTML = lang_list_html;


// Add current translation as value in inputs
var mis_level_comb = document.getElementById("mis_level_comb");
var table_dis = document.getElementById("table_dis");
var full_charge = document.getElementById("full_charge");
var lapis_slice = document.getElementById("lapis_slice");
var book_back = document.getElementById("book_back");
var mis_level_ench = document.getElementById("mis_level_comb");
var enchanting_cost = document.getElementById("enchanting_cost");
var levels = document.getElementById("levels");

var input_box = document.getElementById("input_box");
var inputs = document.getElementsByClassName("autofillable");

function changeLang(input) {
	// check if something is entered and show inputs
	if (input == "") {
		input_box.style.display = "none";
		return;
	}
	else { input_box.style.display = "block"; }

	// clear not manually edited inputs and nothing else
	if (document.getElementsByClassName("edited").length > 0) {
		for (var i = 0; i < inputs.length; i++) {
			if (!inputs[i].classList.contains("edited")) {
				inputs[i].value = "";
			}
		}
		return;
	}

	// get language codes
	var lang_list_options = lang_list.children;
	var tr_array = -1;

	for (var i = 0; i < lang_list_options.length; i++){
		if (lang_list_options[i].value == input) {
			tr_array = parseInt(lang_list_options[i].id);
			break;
		}
	}

	// change text
	loadEnch(tr_array + 1);

	if (tr_array != -1) {
		mis_level_comb.value = translation_array[tr_array].mis_level_comb_txt;
		table_dis.value = translation_array[tr_array].table_dis;
		full_charge.value = translation_array[tr_array].full_charge;
		lapis_slice.value = translation_array[tr_array].lapis_slice;
		book_back.value = translation_array[tr_array].book_back;
		mis_level_ench.value = translation_array[tr_array].mis_level_ench_txt;
		enchanting_cost.value = translation_array[tr_array].enchanting_cost;
		levels.value = translation_array[tr_array].levels;
	}
	else {
		mis_level_comb.value = "";
		table_dis.value = "";
		full_charge.value = "";
		lapis_slice.value = "";
		book_back.value = "";
		mis_level_ench.value = "";
		enchanting_cost.value = "";
		levels.value = "";
	}
}


function inputEdited(el) {
	if (el.value == "") {
		el.classList.remove("edited");
	}
	else {
		el.classList.add("edited");
	}
}


// send Translation
var el_mains = document.getElementsByTagName("main");

async function sendForm() {
	var tr_array = [];

	for (var i = 0; i < inputs.length; i++) {
		var article = inputs[i];
		if (article.classList.contains("edited")) {
			tr_array.push({id:article.id, tr:article.value});
		}
	}
	if (tr_array.length == 0) {
		alert("Translate at least one thing");
		return false;
	}

	var form_body = {
		subject: "Powered Enchanting Translation",
		body: `
			<p>Language: ${document.getElementById("lang_input").value}</p>
			<p>Credit: ${document.getElementById("credit").value}</p>
			<p>Translation:<br>${tr_array}</p>`
	};

	var response = await fetch("https://api.tabq.ch/forms-fg/mail", {
		method: "POST",
		body: JSON.stringify(form_body),
	});

	if (response.ok) {
		el_mains[0].style.display = "none";
		el_mains[1].style.display = "block";
	}
	else {
		var error = response.text();
		console.error(error);
		alert("An error has occurred: " + error);
	}
}

function goBack() {
	var history_length = history.length;
	if (history_length >= 2) window.history.go(-1);
	else window.location.href = "/";
}