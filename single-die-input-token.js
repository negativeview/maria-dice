"use strict";

const ResultTokenDie = require('./result-token-die.js');
const RollConfiguration = require('./roll-configuration.js');

class SingleDieInputToken {
	constructor() {
		this.rollConfiguration = new RollConfiguration();
		this.type = 'single-die';
		this.resultToken = null;
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

	getResultToken() {
		return this.resultToken;
	}

	execute() {
		var max = this.rollConfiguration.size;
		var min = 1;
		var rerolls = 0;

		var keepGoing = true;

		this.resultToken = new ResultTokenDie();

		while(keepGoing) {
			keepGoing = false;

			var dieResult = Math.floor(Math.random() * (max - min + 1)) + min;

			if (this.rollConfiguration.rerollBreak > 0 && dieResult < this.rollConfiguration.rerollBreak) keepGoing = true;
			if (this.rollConfiguration.exploding && dieResult == this.rollConfiguration.size) keepGoing = true;
			if (this.rollConfiguration.maxRerolls !== -1 && rerolls > this.rollConfiguration.maxRerolls) keepGoing = false;

			this.resultToken.rolls++;
			this.resultToken.addNumericResult(dieResult);

			rerolls++;
		}
	}
}

module.exports = SingleDieInputToken;