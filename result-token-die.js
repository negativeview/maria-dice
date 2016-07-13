"use strict";

class ResultTokenDie {
	constructor() {
		this.numericResults = [];
		this.rolls = 0;
		this.type = 'die';

		this.format = {};

		Object.defineProperty(
			this.format,
			'simple',
			{
				enumerable: true,
				get: () => {
					var rollString = this.configuration.number + 'd' + this.configuration.size;
					if (this.configuration.exploding)
						rollString += '!';
					if (this.configuration.keep) {
						rollString += 'k';
						rollString += this.configuration.keepLow ? 'h' : 'l';
						rollString += this.configuration.keep;
					}
					if (this.configuration.reroll.enabled) {
						rollString += 'r';
						rollString += this.configuration.reroll.max == 1 ? 'o' : '';
						rollString += '<' + this.configuration.reroll.breakpoint;
					}
					return rollString + ' (' + this.numericResults.join(', ') + ')';
				}
			}
		);
	}

	addNumericResult(number) {
		this.numericResults.push(number);
	}
}

module.exports = ResultTokenDie;