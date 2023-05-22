import debounceScroll from "./../library/debounceScroll";
import passiveListener from "./../library/passiveListener.js"

export default class WrongScroll {
	constructor() {
		// Provdede danou fc při každém scrollu
		$(window).scroll(() => {
			// console.log('wrong scroll');
		});
	}
}
