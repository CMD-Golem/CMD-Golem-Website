function resize() {
	var table = document.getElementById("threecoltable");

	if (window.innerWidth == 500) {
		var row = table.getElementsByClassName("usf_row");

		for (i = 0; i < row.length; i++) {
			var cell = row[i].getElementsByClassName("usf_cell")[0];
			var clone = cell.cloneNode(true);
			clone.classList.remove("usf_cell");
			clone.classList.add("usf_border");
			var add = document.createElement("tr");
			add.appendChild(clone);
			row[i].parentNode.insertBefore(add, row[i].nextSibling);
		}
	}

	if (window.innerWidth == 501) {
		var remove = table.getElementsByClassName("usf_border");
		for (i = 0; i < remove.length; i++) {
			remove[i].remove();
		}
	}


}

window.addEventListener("resize", function(){
    resize();
});




window.addEventListener("load", function(){
    load();
});


function load() {
	var table = document.getElementById("threecoltable");

	if (window.innerWidth <= 500) {
		var row = table.getElementsByClassName("usf_row");

		for (i = 0; i < row.length; i++) {
			var cell = row[i].getElementsByClassName("usf_cell")[0];
			var clone = cell.cloneNode(true);
			clone.classList.remove("usf_cell");
			clone.classList.add("usf_border");
			var add = document.createElement("tr");
			add.appendChild(clone);
			row[i].parentNode.insertBefore(add, row[i].nextSibling);
		}
	}
}