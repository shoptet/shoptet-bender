import debounceScroll from "./../library/debounceScroll";
import passiveListener from "./../library/passiveListener";

const TIMEOUT = 25;

export default class BetterScroll {
	constructor() {
		// Zpozdí danou fc až po uplynutí uvedené doby čekání v milisekundách od posledního volání
		let onScroll = debounceScroll(() => {
				console.log('Trigger: BetterScroll, timout: ' + TIMEOUT + 'ms');
		}, TIMEOUT);
		window.addEventListener("scroll", () => onScroll(), passiveListener);
	}
}
