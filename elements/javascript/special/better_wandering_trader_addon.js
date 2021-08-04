function generate() {
	//Get elements
	var trade = document.getElementById("trade").value;
	var buy1 = document.getElementById("buy1").value;
	var buy2 = document.getElementById("buy2").value;
	var trade_id = document.getElementById("trade_id").value;

	var trade_output = document.getElementById("trade_output");

	// Set rarity
	var rarity = "common";
	if (document.getElementById("rare").checked == true) {
		rarity = "rare";
	}
	if (document.getElementById("epic").checked == true) {
		rarity = "epic";
	}
	if (document.getElementById("rare").checked == false && document.getElementById("epic").checked == false) {
		document.getElementById("common").checked = true;
	}

	

	// make background red if field need to be filled out but isn't or if wrong input is in
	if (trade.length == 0 || trade.includes("/summon item ~ ~ ~ {Item:") == false) {
		document.getElementById("trade").style.backgroundColor = "#A10000";
	}
	else {
		document.getElementById("trade").style.backgroundColor = "#333333";
	}

	if (buy1.length == 0 || buy1.includes("/summon item ~ ~ ~ {Item:") == false) {
		document.getElementById("buy1").style.backgroundColor = "#A10000";
	}
	else {
		document.getElementById("buy1").style.backgroundColor = "#333333";
	}

	if (buy2.length !== 0 && buy2.includes("/summon item ~ ~ ~ {Item:") == false) {
		document.getElementById("buy2").style.backgroundColor = "#A10000";
	}
	else {
		document.getElementById("buy2").style.backgroundColor = "#333333";
	}

	if (trade_id.length !== 0 && trade_id.includes("#") == false) {
		document.getElementById("trade_id").style.backgroundColor = "#A10000";
	}
	else {
		document.getElementById("trade_id").style.backgroundColor = "#333333";
	}

	// set buy 2 to air if nothing was written
	if (buy2.length == 0) {
		buy2 = '{id:"minecraft:air",Count:1b}}';
	}

	// Added command to disable trade
	if (trade_id.length > 1) {
		var trade_disable = 'execute unless score ' + trade_id + ' usftrader matches 1 run ';
	}
	else {
		var trade_disable = "";
	}

	// Write command
	if (trade.length !== 0 && buy1.length !== 0 && trade.includes("/summon item ~ ~ ~ {Item:") == true && buy1.includes("/summon item ~ ~ ~ {Item:") == true) {
		trade = trade.replace("/summon item ~ ~ ~ {Item:", "").slice(0, -1);
		buy1 = buy1.replace("/summon item ~ ~ ~ {Item:", "").slice(0, -1);
		buy2 = buy2.replace("/summon item ~ ~ ~ {Item:", "").slice(0, -1);

		//summon minecraft:armor_stand ~ ~ ~ {ArmorItems:[{tag:{usftrader:[{buy:{BUY1},buyB:{BUY2},sell:{TRADE}}]},id:"minecraft:emerald",Count:1b}],Tags:["usftrader_randomtrade_RARITY"],NoGravity:1b,Invulnerable:1b,Small:1b,Marker:1b,Invisible:1b,NoBasePlate:1b,PersistenceRequired:1b}
		trade_output.innerHTML = trade_disable + 'summon minecraft:armor_stand ~ ~ ~ {ArmorItems:[{tag:{usftrader:[{buy:' + buy1 + ',buyB:' + buy2 + ',sell:' + trade + '}]},id:"minecraft:emerald",Count:1b}],Tags:["usftrader_randomtrade_' + rarity + '"],NoGravity:1b,Invulnerable:1b,Small:1b,Marker:1b,Invisible:1b,NoBasePlate:1b,PersistenceRequired:1b}';
	}
}
