const NumericInputToken = require('./numeric-input-token.js');
const RollResult = require('./roll-result.js');

class MultiDieInputToken extends NumericInputToken {
	constructor(dieNumber, dieSize) {
		super(0);
		this.dieNumber = dieNumber;
		this.dieSize = dieSize;
		this.exploding = false;
		this.rerollBreak = -1;
		this.maxRerolls = -1;
		this.result = NULL;
	}

	execute() {
		var singleDie = new SingleDieInputToken(this.dieSize);
		singleDie.exploding = this.exploding;
		singleDie.rerollBreak = this.rerollBreak;
		singleDie.maxRerolls = this.maxRerolls;
		this.result = new RollResult();

		for (var i = 0; i < this.dieNumber; i++) {
			this.singleDie.execute();
			this.result.addResult(this.singleDie.getResult());
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = MultiDieInputToken;