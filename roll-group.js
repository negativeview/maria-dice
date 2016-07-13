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
}

module.exports = RollGroup;