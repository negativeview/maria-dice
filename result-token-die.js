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
				get: () => {
					return '(' + this.numericResults.join(', ') + ')';
				}
			}
		);
	}

	addNumericResult(number) {
		this.numericResults.push(number);
	}
}

module.exports = ResultTokenDie;