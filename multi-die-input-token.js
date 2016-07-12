const NumericInputToken = require('./numeric-input-token.js');
const RollResult = require('./roll-result.js');
const SingleDieInputToken = require('./single-die-input-token.js');

class MultiDieInputToken extends NumericInputToken {
	constructor(dieNumber, dieSize) {
		super(0);
		this.dieNumber = dieNumber;
		this.dieSize = dieSize;
		this.exploding = false;
		this.rerollBreak = -1;
		this.maxRerolls = -1;
		this.result = null;
		this.keep = -1;
		this.keepLow = false;
		this.innerDice = [];
	}

	formatResult() {
		var res = this.dieNumber + 'd' + this.dieSize + ' (';
		res += this.result.getResults().map(
			(currentValue, index, array) => {
				return currentValue.getResult();
			}
		).join(', ');
		res += ')';
		return res;
	}

	execute() {
		this.innerDice = [];
		this.result = new RollResult();
		for (var i = 0; i < this.dieNumber; i++) {
			var singleDie = new SingleDieInputToken(this.dieSize);
			singleDie.exploding = this.exploding;
			singleDie.rerollBreak = this.rerollBreak;
			singleDie.maxRerolls = this.maxRerolls;

			singleDie.execute();
			this.result.addResult(singleDie);
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = MultiDieInputToken;