const NumericInputToken = require('./numeric-input-token.js');
const RollResult = require('./roll-result.js');

class SingleDieInputToken extends NumericInputToken {
	constructor(dieSize) {
		super(0);
		this.dieSize = dieSize;
		this.exploding = false;
		this.rerollBreak = -1;
		this.maxRerolls = -1;
		this.result = null;
	}

	formatResult() {
		var res = '1d' + this.dieSize + ' (';
		res += this.result.getResults()[0];
		res += ')';
		return res;
	}

	execute() {
		this.result = new RollResult();

		var max = this.dieSize;
		var min = 1;
		var rerolls = 0;

		while(true) {
			var dieResult = Math.floor(Math.random() * (max - min + 1)) + min;
			this.result.addResult(dieResult);

			if (this.rerollBreak < 0) break;
			if (dieResult >= this.rerollBreak) break;
			if (rerolls > this.maxRerolls) break;

			rerolls++;
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = SingleDieInputToken;