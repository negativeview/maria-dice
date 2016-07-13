"use strict";

class ExplicitGroup {
	constructor() {
		this.type = 'group';
		this.configuration = {};
		this.children = [];

		Object.defineProperty(
			this,
			'numericValue',
			{
				enumerable: true,
				get: () => {
					var value = 0;
					for (var i = 0; i < this.children.length; i++) {
						if (!this.children[i].rejected)
							value += this.children[i].numericValue;
					}
					return value;
				}
			}
		);
	}

	addChild(roll) {
		this.children.push(roll);
	}

	keepHighLow() {
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.keepHighLow) child.keepHighLow();
		}

		if (!this.configuration.keep) return;

		this._keepHighLow(
			this.configuration.keepLow ? this._keepLow : this._keepHigh,
			this.configuration.keep
		);
	}

	_keepHigh(a, b) {
		if (a.numericValue > b.numericValue) return true;
		return false;
	}

	_keepLow(a, b) {
		if (a.numericValue < b.numericValue) return true;
		return false;
	}

	_keepHighLow(comparator, numKeep) {
		console.log('in explicit group keep high low, before deciding');
		var numBasics = 0;
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].why == 'basic-roll' || this.children[i].numericValue !== undefined) numBasics++;
		}

		var toRemove = numBasics - numKeep;
		if (toRemove <= 0) return;

		console.log('in explicit group keep high low', toRemove);
		while (toRemove) {
			var currentIndex = -1;

			for (var i = 0; i < this.children.length; i++) {
				var child = this.children[i];
				if (child.rejected) continue;
				if (child.why != 'basic-roll' && this.children[i].numericValue == undefined) continue;

				if (currentIndex == -1) {
					currentIndex = i;
					continue;
				}

				if (comparator(this.children[currentIndex], this.children[i])) {
					currentIndex = i;
				}
			}

			if (currentIndex !== -1) {
				this.children[currentIndex].rejected = 'keep-high-low';
			}
			toRemove--;
		}
	}
}

module.exports = ExplicitGroup;