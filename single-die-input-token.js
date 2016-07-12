const NumericInputToken = require('./numeric-input-token.js');
const RollResult = require('./roll-result.js');

class SingleDieInputToken extends NumericInputToken {
	constructor(dieSize) {
		super(0);
		this.dieSize = dieSize;
		this.exploding = false;
		this.rerollBreak = -1;
		this.maxRerolls = -1;
		this.result = NULL;
	}

	execute() {
		this.result = new RollResult();

		var max = this.dieSize;
		var min = 1;
		var rerolls = 0;

		while(true) {
			var dieResult = Math.floor(Math.random() * (max - min + 1)) + min;
			this.result.addResult(dieResult);

			if (rerollBreak < 0) break;
			if (dieResult >= rerollBreak) break;
			if (rerolls > maxRerolls) break;

			rerolls++;
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = SingleDieInputToken;