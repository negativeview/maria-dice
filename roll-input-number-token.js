const RollInputToken = require('./roll-input-token.js');

class RollInputNumberToken extends RollInputToken {
	constructor(data) {
		data.type = 'number';
		super(data);
		this.number = data.number;
	}

	execute() {
		// We do nothing in this stage
	}

	totalAdjustment() {
		return this.number;
	}

	toString() {
		return this.number;
	}

	formatResult() {
		return this.number;
	}
}

module.exports = RollInputNumberToken;