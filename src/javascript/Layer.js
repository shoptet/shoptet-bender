import Cookies from "js-cookie";

const BODY_CLASS = "is-active-layer-pobo";

export default class Layer {
	constructor(options = {}, lang = "cs") {
		const data = {
			message: options[lang].message || "",
			messageLink: options[lang].messageLink || "",
			buttonClose: options[lang].buttonClose || "Zavřít",
			cookieName: options[lang].cookieName || "poboLayerClosed",
		}

		if(!isActiveLayer({
			cookieName: data.cookieName
		})) {
			return;
		}

		const header = document.createElement("div");

		header.innerHTML = `
				<div class='layer-pobo' id="js-header">
					<div class='container'>
						<div class="row layer-pobo-container">
							<div class="col-12 col-md-8 layer-pobo-content">
								<a href="${data.messageLink}">
									${data.message}
								</a>
							</div>
	
							<div class="col-12 col-md-4 text-right">
								<a href='#' class='layer-trigger-close' id="js-layer-close">
									${data.buttonClose}
								</a>
							</div>
						</div>
					</div>
				</div>
			`;


		document.body.classList.add(BODY_CLASS);
		document.body.appendChild(header);

		document.getElementById("js-layer-close").addEventListener("click", (e) => {
			e.preventDefault();
			closeLayer(data);
		});

		function closeLayer(data) {
			Cookies.set(data.cookieName, true);
			document.getElementById('js-header').remove();
			document.body.classList.remove(BODY_CLASS)
		}

		function isActiveLayer(data) {
			return Cookies.get(data.cookieName) === undefined;
		}
	}
}
