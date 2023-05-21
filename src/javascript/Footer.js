export default class Footer {
	constructor(grid = {}, lang = "cs") {
		const data = grid[lang];

		if (data.length === 0) {
			console.warn(`Warning, grid is empty via. class Footer`);
		}

		const footer = document.createElement("div");
		footer.classList.add("row");

		Array.from(data).forEach((item) => {
			footer.innerHTML += `
				<div class="col-12 col-md-4 text-center">
					<h2 class="pobo-footer">${item.title}</h2>
					<span>${item.description}</span>
				</div>
			`;
		});

		document.getElementById('footer').appendChild(footer);
}
