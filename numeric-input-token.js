const InputToken = require('./input-token.js');

class NumericInputToken extends InputToken {
	constructor(number) {
		super();
		this.number = parseInt(number);
	}

	toValue() {
		return number;
	}
}

module.exports = NumericInputToken;