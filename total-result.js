"use strict";

class TotalResult {
	constructor() {
		this.resultParts = [];
	}

	addPart(resultPart) {
		this.resultParts.push(resultPart);
	}
}

module.exports = TotalResult;