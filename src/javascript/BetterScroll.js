import debounceScroll from "./../library/debounceScroll";
import passiveListener from "./../library/passiveListener";

const TIMEOUT = 20;

export default class BetterScroll {
	constructor() {
		let onScroll = debounceScroll(() => {
				console.log('%cBetterScroll, timout: ' + TIMEOUT + 'ms',  'color: green');
		}, TIMEOUT);
		window.addEventListener("scroll", () => onScroll(), passiveListener);
	}
}
