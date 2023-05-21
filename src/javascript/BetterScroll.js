import debounceScroll from "./../libary/debounceScroll";
import passiveListener from "./../libary/passiveListener";

export default class BetterScroll {
	constructor() {
		let onScroll = debounceScroll(() => {
				console.log('better debounce');
		}, 10);

		window.addEventListener("scroll", () => onScroll(), passiveListener);
	}
}
