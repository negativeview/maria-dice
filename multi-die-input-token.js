"use strict";

const RollConfiguration = require('./roll-configuration.js');
const RollResult = require('./roll-result.js');
const SingleDieInputToken = require('./single-die-input-token.js');

class MultiDieInputToken {
	constructor() {
		this.rollConfiguration = new RollConfiguration();
		this.result      = null;
		Object.defineProperty(
			this,
			'innerDice',
			{
				enumerable: false,
				configurable: true,
				writable: true,
				value: []
			}
		);
		this.type = 'multi-die';
	}

	getAmount() {
		var amount = 0;
		var results = this.result.getResults();
		for (var i = 0; i < results.length; i++) {
			if (results[i].keep) {
				amount += results[i].getAmount();
			}
		}
		return amount;
	}

	formatResult() {
		var res = this.rollConfiguration.number + 'd' + this.rollConfiguration.size + ' (';
		res += this.result.getResults().map(
			(currentValue, index, array) => {
				var r = currentValue.formatResultSimple();
				if (!currentValue.keep) {
					return '~~' + r + '~~';
				} else {
					return r;
				}
			}
		).join(', ');
		res += ')';
		return res;
	}

	execute() {
		this.innerDice = [];
		this.result = new RollResult();
		for (var i = 0; i < this.rollConfiguration.number; i++) {
			var singleDie = new SingleDieInputToken();
			singleDie.rollConfiguration.size = this.rollConfiguration.size;
			singleDie.rollConfiguration.exploding = this.rollConfiguration.exploding;
			singleDie.rollConfiguration.rerollBreak = this.rollConfiguration.rerollBreak;
			singleDie.rollConfiguration.maxRerolls = this.rollConfiguration.maxRerolls;
			singleDie.rollConfiguration.keep = true;

			singleDie.execute();
			this.innerDice.push(singleDie);
			this.result.addResult(singleDie);
		}

		if (this.keep > 0) {
			var toRemove = this.innerDice.length - this.keep;
			if (toRemove <= 0) return;

			for (; toRemove > 0; toRemove--) {
				var index = -1;
				for (var i = 0; i < this.innerDice.length; i++) {
					if (this.innerDice[i].keep == false) continue;
					if (index == -1) {
						index = i;
						continue;
					}

					if (this.rollConfiguration.keepLow && this.innerDice[i].getAmount() > this.innerDice[index].getAmount()) {
						index = i;
					}
					if (!this.rollConfiguration.keepLow && this.innerDice[i].getAmount() < this.innerDice[index].getAmount()) {
						index = i;
					}
				}

				if (index == -1) break;
				this.innerDice[index].keep = false;
			}
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = MultiDieInputToken;