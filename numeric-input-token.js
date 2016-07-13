const InputToken = require('./input-token.js');

class NumericInputToken extends InputToken {
	constructor(number) {
		super();
		this.number = parseInt(number);
		this.type = 'number';
		this.rejected = null;
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
			numericValue: this.number
			rejected: this.rejected
		};
	}

	toValue() {
		return this.number;
	}
}

module.exports = NumericInputToken;