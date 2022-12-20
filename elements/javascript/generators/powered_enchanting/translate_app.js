// load Enchantment Names
var article_list = document.getElementById("enchantments");
var tr_code = 0;

function loadEnch() {
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

loadEnch();


// Add current translation as value in inputs
var mis_level = document.getElementById("mis_level");
var table_dis = document.getElementById("table_dis");
var full_charge = document.getElementById("full_charge");
var lapis_slice = document.getElementById("lapis_slice");
var book_back = document.getElementById("book_back");
var level30 = document.getElementById("level30");
var level50 = document.getElementById("level50");

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
	if (input == "German") { tr_code = 1; }
	else if (input == "Korean") { tr_code = 2; }
	else { tr_code = 0; }

	loadEnch();
	var tr_array = tr_code - 1;

	// change text
	if (tr_code != 0) {
		mis_level.value = translation_array[tr_array].mis_level_txt;
		table_dis.value = translation_array[tr_array].table_dis;
		full_charge.value = translation_array[tr_array].full_charge;
		lapis_slice.value = translation_array[tr_array].lapis_slice;
		book_back.value = translation_array[tr_array].book_back;
		level30.value = translation_array[tr_array].level30;
		level50.value = translation_array[tr_array].level50;
	}
	else {
		mis_level.value = "";
		table_dis.value = "";
		full_charge.value = "";
		lapis_slice.value = "";
		book_back.value = "";
		level30.value = "";
		level50.value = "";
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


// create json for all Translation
var el_json = document.getElementById("json");
var lang_input = document.getElementById("lang_input");
var form_lang = document.getElementById("lang");

function createForm() {
	var tr_array = [];
	form_lang.value = lang_input.value;

	for (var i = 0; i < inputs.length; i++) {
		var article = inputs[i];
		if (article.classList.contains("edited")) {
			tr_array.push({id:article.id, tr:article.value});
		}
	}
	if (tr_array.length != 0) {
		el_json.value = JSON.stringify(tr_array);
	}
	else {
		alert("Translate at least one thing");
		return false;
	}
}


// Prevent sending when pressing enter in input elements
var el_input = document.getElementsByTagName("input");
for (var i = 0; i < el_input.length; i++) {
	el_input[i].addEventListener("keydown", e => {
		if ((e.which == 13 || e.keyCode == 13) ) {
			e.preventDefault();
		}
	});
}