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
		var res = '1d' + this.dieSize + ' (';
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

		var max = this.dieSize;
		var min = 1;
		var rerolls = 0;

		var keepGoing = true;

		while(keepGoing) {
			keepGoing = false;

			var dieResult = Math.floor(Math.random() * (max - min + 1)) + min;
			this.result.addResult(dieResult);

			if (this.rerollBreak > 0 && dieResult < this.rerollBreak) keepGoing = true;
			if (this.exploding && dieResult == this.dieSize) keepGoing = true;
			if (this.maxRerolls !== -1 && rerolls > this.maxRerolls) keepGoing = false;

			console.log('single die debug', 'exploding: ' + this.exploding, 'result: ' + dieResult, 'keepGoing: ' + keepGoing);

			rerolls++;
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = SingleDieInputToken;