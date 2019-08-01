

/*
	Assumes that component has method called didClickOutside, which handles being clicked outside
*/

export default {
	// add event listener to document to dismiss when clicking
	componentDidMount: function () {
		document.addEventListener("click", () => {
			if (this.isMounted() && this.didClickOutside) {
				this.didClickOutside();
			}
		});
	},
};
