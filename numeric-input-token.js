const InputToken = require('./input-token.js');

class NumericInputToken extends InputToken {
	constructor(number) {
		super();
		this.number = parseInt(number);
		this.type = 'number';
	}

	formatResult() {
		return this.number;
	}

	getAmount() {
		return this.number;
	}

	getResult() {
		return {
			type: 'raw-number',
			number: this.number
		};
	}

	toValue() {
		return this.number;
	}
}

module.exports = NumericInputToken;