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
	}

	execute() {
		var singleDie = new SingleDieInputToken(this.dieSize);
		singleDie.exploding = this.exploding;
		singleDie.rerollBreak = this.rerollBreak;
		singleDie.maxRerolls = this.maxRerolls;
		this.result = new RollResult();

		for (var i = 0; i < this.dieNumber; i++) {
			singleDie.execute();
			this.result.addResult(singleDie.getResult());
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = MultiDieInputToken;