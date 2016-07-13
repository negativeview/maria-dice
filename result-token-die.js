"use strict";

class ResultTokenDie {
	constructor() {
		this.numericResults = [];
	}

	addNumericResult(number) {
		this.numericResults.push(number);
	}
}

module.exports = ResultTokenDie;