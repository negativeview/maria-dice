"use strict";

class ResultTokenDie {
	constructor() {
		this.numericResults = [];
		this.rolls = 0;
	}

	addNumericResult(number) {
		this.numericResults.push(number);
	}
}

module.exports = ResultTokenDie;