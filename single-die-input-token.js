const RollConfiguration = require('./roll-configuration.js');
const RollResult = require('./roll-result.js');

class SingleDieInputToken {
	constructor() {
		this.rollConfiguration = new RollConfiguration();
		this.result = null;
		this.type = 'single-die';
	}

	formatResult() {
		console.log('in format results', this.result);
		var res = '1d' + this.rollConfiguration.size + ' (';
		res += this.formatResultSimple();
		res += ')';
		return res;
	}

	getAmount() {
		var amount = 0;
		var results = this.result.getResults();
		for (var i = 0; i < results.length; i++) {
			amount += results[i];
		}
		return amount;
	}

	formatResultSimple() {
		return this.result.getResults().join(', ');
	}

	execute() {
		this.result = new RollResult();

		var max = this.rollConfiguration.size;
		var min = 1;
		var rerolls = 0;

		var keepGoing = true;

		while(keepGoing) {
			keepGoing = false;

			var dieResult = Math.floor(Math.random() * (max - min + 1)) + min;
			this.result.addResult(dieResult);

			if (this.rollConfiguration.rerollBreak > 0 && dieResult < this.rollConfiguration.rerollBreak) keepGoing = true;
			if (this.rollConfiguration.exploding && dieResult == this.rollConfiguration.size) keepGoing = true;
			if (this.rollConfiguration.maxRerolls !== -1 && rerolls > this.rollConfiguration.maxRerolls) keepGoing = false;

			rerolls++;
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = SingleDieInputToken;