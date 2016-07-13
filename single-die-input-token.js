"use strict";

const Roll = require('./roll.js');
const RollConfiguration = require('./roll-configuration.js');
const RollGroup = require('./roll-group.js');

class SingleDieInputToken {
	constructor() {
		this.rollConfiguration = new RollConfiguration();
		this.type = 'single-die';
		this.rollGroup = null;
	}

	formatResult() {
		var res = '1d' + this.rollConfiguration.size + ' (';
		res += this.formatResultSimple();
		res += ')';
		return res;
	}

	getAmount() {
		var amount = 0;
		return amount;
	}

	getResult() {
		return this.rollGroup;
	}

	execute() {
		var max = this.rollConfiguration.size;
		var min = 1;
		var rerolls = 0;

		var keepGoing = true;

		this.rollGroup = new RollGroup();
		this.rollGroup.configuration = this.rollConfiguration;

		while(keepGoing) {
			keepGoing = false;

			var dieResult = Math.floor(Math.random() * (max - min + 1)) + min;

			if (this.rollConfiguration.rerollBreak > 0 && dieResult < this.rollConfiguration.rerollBreak) keepGoing = true;
			if (this.rollConfiguration.exploding && dieResult == this.rollConfiguration.size) keepGoing = true;
			if (this.rollConfiguration.maxRerolls !== -1 && rerolls > this.rollConfiguration.maxRerolls) keepGoing = false;

			var roll = new Roll();
			roll.configuration = this.rollConfiguration;
			roll.why = 'why?';
			roll.result = dieResult;
			roll.rejected = NULL;

			this.rollGroup.addRoll(roll);

			rerolls++;
		}
	}
}

module.exports = SingleDieInputToken;