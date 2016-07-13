"use strict";

class RollGroup {
	constructor() {
		this.configuration = {};
		this.rolls = [];
		this.label = '';
	}

	addRoll(roll) {
		this.rolls.push(roll);
	}

	keepHighLow() {
		if (!this.configuration.keep) return;

		this._keepHighLow(
			this.configuration.keepLow ? this._keepLow : this._keepHigh
			this.configuration.keep
		);
		console.log('keepHighLow', this.configuration, this.rolls);
	}

	_keepHigh(a, b) {
		if (a.result > b.result) return true;
		return false;
	}

	_keepLow(a, b) {
		if (a.result < b.result) return true;
		return false;
	}

	_keepHighLow(comparator, numKeep) {
		var numBasics = 0;
		for (var i = 0; i < this.rolls.length; i++) {
			if (this.rolls[i].why == 'basic-roll') numBasics++;
		}

		var toRemove = numBasics - numKeep;

		while (toRemove) {
			var currentIndex = -1;

			for (var i = 0; i < this.rolls.length; i++) {
				var roll = this.rolls[i];
				if (roll.why != 'basic-roll') continue;
				if (roll.rejected) continue;

				if (currentIndex == -1) {
					currentIndex = i;
					continue;
				}

				if (comparator(this.rolls[currentIndex], this.rolls[i])) {
					currentIndex = i;
				}
			}

			if (currentIndex !== -1) {
				this.rolls[currentIndex].rejected = 'keep-high-low';
				currentIndex++;
				while (currentIndex <= this.rolls.length && this.rolls[currentIndex].why != 'basic-roll') {
					this.rolls[currentIndex].rejected = 'keep-high-low';
					currentIndex++;
				}
			}
			toRemove--;
		}
	}
}

module.exports = RollGroup;