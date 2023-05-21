import debounceScroll from "./../libary/debounceScroll";
import passiveListener from "./../libary/passiveListener";

export default class WrongScroll {
	constructor() {
		$(window).scroll(() => {
			console.log('wrong scroll');
		});
	}
}
