export default class WrongScroll {
	constructor() {
		let id = 0;
		$(window).scroll(() => {
			console.log('%cWrongScroll, id: ' + id, 'color: red');
			id++;
		});
	}
}
