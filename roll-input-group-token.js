const RollInputToken = require('./roll-input-token.js');

class RollInputGroupToken extends RollInputToken {
	constructor(data) {
		data.type = 'group';
		super(data);
		this.operation = data.operation;
	}

	execute() {
		// We do nothing in this stage
	}

	totalAdjustment() {
		var lastToken = this.internal[this.internal.length-1];
		if (lastToken.keep) {
			var highestIndex = -1;
			for (var i = 0; i < this.internal.length - 1; i++) {
				var token = this.internal[i];
				if (
					highestIndex == -1 ||
					token.totalAdjustment() > this.internal[highestIndex].totalAdjustment()
				) {
					highestIndex = i;
				}
			}
			if (highestIndex == -1) {
				return 0;
			}
			return this.internal[highestIndex].totalAdjustment();
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
					this._doGroup(arr, index + 1, i);
					this.operation = 'full-group';
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
		var result = '{{';
		// NOTE: -1 because we don't want to formatResult on the ending token
		console.log('internal', this.internal);
		for (var i = 0; i < this.internal.length - 1; i++) {
			result += this.internal[i].formatResult();
		}
		result += '}}';
		result += this.internal[this.internal.length-1].formatTags();
		return result;
	}

	toString() {
		return this.operation;
	}
}

module.exports = RollInputGroupToken;