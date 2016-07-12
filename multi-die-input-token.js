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
				var r = currentValue.formatResult();
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
		for (var i = 0; i < this.dieNumber; i++) {
			var singleDie = new SingleDieInputToken(this.dieSize);
			singleDie.exploding = this.exploding;
			singleDie.rerollBreak = this.rerollBreak;
			singleDie.maxRerolls = this.maxRerolls;
			singleDie.keep = true;

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

					if (this.keepLow && this.innerDice[i].getResult().getResults()[0] > this.innerDice[index].getResult().getResults()[0]) {
						index = i;
					}
					if (!this.keepLow && this.innerDice[i].getResult().getResults()[0] < this.innerDice[index].getResult().getResults()[0]) {
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