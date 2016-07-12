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
				return currentValue.keep + '(' + r.getResults()[0] + ')';
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

		console.log('a');
		if (this.keep > 0) {
			console.log('b', this.keep, this.innerDice);
			var toRemove = this.innerDice.length - this.keep;
			if (toRemove <= 0) return;

			console.log('c');
			for (; toRemove > 0; toRemove--) {
				console.log('d');
				var index = -1;
				for (var i = 0; i < this.result.length; i++) {
					console.log('e');
					if (this.result[i].keep == false) continue;
					console.log('f');
					if (index == -1) {
						index = i;
						continue;
					}
					console.log('g');

					if (this.keepLow && this.result[i].getResult() > this.result[index].getResult()) {
						index = i;
					}
					if (!this.keepLow && this.result[i].getResult() < this.result[index].getResult()) {
						index = i;
					}
				}

				console.log('h');
				if (index == -1) break;
				this.result[index].keep = false;
				console.log('i');
			}
		}
	}

	getResult() {
		return this.result;
	}
}

module.exports = MultiDieInputToken;