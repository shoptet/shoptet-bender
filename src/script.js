import Layer from './javascript/Layer.js';
import Footer from './javascript/Footer.js';
import BetterScroll from './javascript/BetterScroll.js';
import WrongScroll from './javascript/WrongScroll.js';

const layerOption = {
	cs: {
		message: "Akční nabídka na Apple produkty pro všechny stále zákazníky.",
		messageLink: "https://www.alza.cz/apple/18842881.htm",
		buttonClose: "Zavřít",
		cookieName: "poboLayerClosed3"
	},
	en: {},
	de: {},
	// .. and more
}

const footerItems = {
	"cs": [
		{
			"title": "O nás",
			"description": "a na3e vize",
			"img": null
		},
		{
			"title": "Kontakty",
			"description": "a podpora",
			"img": null
		},

		{
			"title": "Záruka",
			"description": "Výměny zboží",
			"img": null
		}
	],

	"en": [],
	"de": [],
	// .. and more
}

new Layer(layerOption, "cs");
new Footer(footerItems, "cs");
new BetterScroll();
new WrongScroll();
