const NumericInputToken = require('./numeric-input-token.js');
const RollResult = require('./roll-result.js');
const SingleDieInputToken = require('./single-die-input-token.js');

class MultiDieInputToken extends NumericInputToken {
	constructor(dieNumber, dieSize) {
		super(0);
		this.dieNumber   = dieNumber;
		this.dieSize     = dieSize;
		this.rerollBreak = -1;
		this.maxRerolls  = -1;
		this.keep        = -1;
		this.exploding   = false;
		this.keepLow     = false;
		this.result      = null;
		this.innerDice   = [];
	}

	formatResult() {
		var res = this.dieNumber + 'd' + this.dieSize + ' (';
		res += this.result.getResults().map(
			(currentValue, index, array) => {
				var r = currentValue.getResult();
				return r.keep + '(' + r.getResults()[0] + ')';
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
			singleDie.keep = true;

			singleDie.execute();
			this.result.addResult(singleDie);
		}

		if (this.keep > 0) {
			var toRemove = this.innerDice.length - this.keep;
			if (toRemove <= 0) return;

			for (; toRemove > 0; toRemove--) {
				var index = -1;
				for (var i = 0; i < this.result.length; i++) {
					if (this.result[i].keep == false) continue;
					if (index == -1) {
						index = i;
						continue;
					}

					if (this.keepLow && this.result[i].getResult() > this.result[index].getResult()) {
						index = i;
					}
					if (!this.keepLow && this.result[i].getResult() < this.result[index].getResult()) {
						index = i;
					}
				}

				if (index == -1) break;
				this.result[index].keep = false;
			}
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = MultiDieInputToken;