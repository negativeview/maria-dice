"use strict";

class ResultPart {
	constructor() {
	}

	toString() {
	}

	isGroup() {
		return false;
	}

	isDie() {
		return false;
	}

	isNumeric() {
		return false;
	}
}

module.exports = ResultPart;