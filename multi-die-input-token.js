const RollResult = require('./roll-result.js');
const SingleDieInputToken = require('./single-die-input-token.js');

class MultiDieInputToken {
	constructor(dieNumber, dieSize) {
		this.dieNumber   = dieNumber;
		this.dieSize     = dieSize;
		this.rerollBreak = -1;
		this.maxRerolls  = -1;
		this.keep        = -1;
		this.exploding   = false;
		this.keepLow     = false;
		this.result      = null;
		this.innerDice   = [];
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
		var res = this.dieNumber + 'd' + this.dieSize + ' (';
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

					if (this.keepLow && this.innerDice[i].getAmount() > this.innerDice[index].getAmount()) {
						index = i;
					}
					if (!this.keepLow && this.innerDice[i].getAmount() < this.innerDice[index].getAmount()) {
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