import Layer from './javascript/Layer.js';
import Footer from './javascript/Footer.js';
import BetterScroll from './javascript/BetterScroll.js';
import WrongScroll from './javascript/WrongScroll.js';
import { getLang, getPageType } from './lib/utils.js';
import BasketProvider from "./javascript/BasketProvider.js";

// window.shoptet.dev.enableEventsMonitoring()
console.clear();

const layerOption = {
	cs: {
		message: "Akční nabídka na Apple produkty pro všechny stále zákazníky.",
		messageLink: "https://www.pobo.cz/",
		buttonClose: "Zavřít",
		cookieName: "poboLayerClosed"
	},
	en: {
		message: "Special offer on Apple products for all regular customers.",
		messageLink: "https://www.pobo.cz/",
		buttonClose: "Close",
		cookieName: "poboLayerClosed"
	},
	sk: {},
	de: {}
	// .. and more
}

const footerItems = {
	"cs": [
		{
			"title": "O nás",
			"description": "a naše vize",
			"img": null
		},
		{
			"title": "Kontakty",
			"description": "a podpora",
			"img": null
		},

		{
			"title": "Záruka",
			"description": "výměny zboží",
			"img": null
		}
	],

	"en": [
		{
			"title": "About us",
			"description": "and our vision",
			"img": null
		},
	],
	"de": [],
	"sk": [],
}

const lang = getLang();
const pageType = getPageType();

console.info("Language: ", lang);
console.info("Page type: ", pageType);

new Layer(layerOption, lang);
new Footer(footerItems, lang);
new BetterScroll();
new WrongScroll();
new BasketProvider();
