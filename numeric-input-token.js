const InputToken = require('./input-token.js');

class NumericInputToken extends InputToken {
	constructor(number) {
		super();
		this.number = parseInt(number);
	}

	formatResult() {
		return this.number;
	}

	toValue() {
		return this.number;
	}
}

module.exports = NumericInputToken;