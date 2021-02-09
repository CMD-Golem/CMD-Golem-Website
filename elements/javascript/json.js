// Add article to list
var getjson = new XMLHttpRequest();
getjson.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText);
			const article = document.getElementById('article-list');

		const html = data.map(item => `
			<a class="filterme ${item.search} ${item.versions}" href="${item.link}.html">
				<div class="img_container">
					<img src="elements/pictures/${item.link}/logo_1.png" loading="lazy">
				</div>
				<p class="description">${item.description}</p>
				<div class="info">
					<p>${item.type}</p>
					<p>${item.compatibility}</p>
				</div>
			</a>

			`).join('');

		article.innerHTML = html;
		siteSearch();
		loadFilter();
	}
};
getjson.open("GET", "https://raw.githubusercontent.com/CMD-Golem/CMD-Golem/master/elements/creations.json", true);
getjson.send();