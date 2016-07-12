const RollInputToken = require('./roll-input-token.js');
const RollResult = require('./roll-result.js');

class RollInputGroupToken extends RollInputToken {
	constructor(data) {
		data.type = 'group';
		super(data);
		this.operation = data.operation;
		this.result = null;
	}

	execute() {
		this.result = new RollResult();
		console.log('internal', this.internal);
		for (var i = 0; i < this.internal.length - 1; i++) {
			var ob = this.internal[i];
			if (ob.execute)
				ob.execute();
			if (ob.getResult) {
				this.result.addResult(ob.getResult());
			}
		}
	}

	getAmount() {
		var lastToken = this.internal[this.internal.length-1];
		if (lastToken.keep) {
			var highestIndex = -1;
			for (var i = 0; i < this.internal.length - 1; i++) {
				var token = this.internal[i];
				if (
					highestIndex == -1 ||
					token.getAmount() > this.internal[highestIndex].getAmount()
				) {
					highestIndex = i;
				}
			}
			if (highestIndex == -1) {
				return 0;
			}
			return this.internal[highestIndex].getAmount();
		}
	}

	_doGroup(arr, start, e) {
		var end = arr[e];

		this.internal = arr.splice(start, e - start + 1);
	}

	group(arr, index) {
		if (this.operation == 'start') {
			for (var i = index + 1; i < arr.length; i++) {
				if (arr[i].operation == 'end') {
					this.comment = arr[i].comment;
					this.keep = arr[i].keep;
					this.keepLow = arr[i].keepLow;
					this.exploding = arr[i].exploding;
					this.rerollBreak = arr[i].rerollBreak;
					this.maxRerolls = arr[i].maxRerolls;
					this.operation = 'full-group';
					this._doGroup(arr, index + 1, i);

					if (index != 0 && arr[index - 1].type == 'number') {
						this.repeat = arr[index - 1].number;
						arr.splice(index - 1, 1);
					} else {
						this.repeat = 1;
					}
					return true;
				} else if (arr[i].operation == 'start') {
					return false;
				}
			}
		}
	}

	formatTags() {
		var res = '';
		if (this.keep) {
			if (this.keepLow) {
				res += 'kl' + this.keep;
			} else {
				res += 'kh' + this.keep;
			}
		}
		return res;
	}

	formatResult() {
		var result = '';
		if (this.repeat !== 1) {
			result += this.repeat + ' ';
		}
		result += '{';
		// NOTE: -1 because we don't want to formatResult on the ending token
		for (var i = 0; i < this.internal.length - 1; i++) {
			result += this.internal[i].formatResult();
		}
		result += '}';
		result += this.internal[this.internal.length-1].formatTags();
		return result;
	}

	toString() {
		return this.operation;
	}
}

module.exports = RollInputGroupToken;