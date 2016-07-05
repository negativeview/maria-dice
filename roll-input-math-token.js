const RollInputToken = require('./roll-input-token.js');

class RollInputMathToken extends RollInputToken {
	constructor(data) {
		data.type = 'math';
		super(data);
		this.token = data.token;
	}

	execute() {
		// We do nothing in this stage
	}

	toString() {
		return this.token;
	}

	formatResult() {
		if (this.token == ',') return ', ';
		return this.token;
	}

	modifier(modifier) {
		if (this.token == '-') {
			return -1;
		} else if (this.token == '+') {
			return 1;
		} else {
			return modifier;
		}
	}
}

module.exports = RollInputMathToken;