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
		console.log('keepHighLow', this.configuration, this.rolls);
	}
}

module.exports = RollGroup;