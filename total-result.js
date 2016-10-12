"use strict";

class TotalResult {
	constructor() {
		this.resultParts = [];

		Object.defineProperty(
			this,
			'simple',
			{
				configurable: false,
				enumerable: true,
				get: () => {
					this.stringify(this);
					return "`" + this.total + "`";
				}
			}
		);

		Object.defineProperty(
			this,
			'plain',
			{
				configurable: false,
				enumerable: true,
				get: () => {
					this.stringify(this);
					return this.total;
				}
			}
		);

		Object.defineProperty(
			this,
			'string',
			{
				configurable: false,
				enumerable: true,
				get: () => {
					return this.stringify(this);
				}
			}
		);

		Object.defineProperty(
			this,
			'tokens',
			{
				configurable: false,
				enumerable: true,
				get: () => {
					return this.resultParts
				}
			}
		);
	}

	addPart(resultPart) {
		this.resultParts.push(resultPart);
	}

	stringifyItem(item) {
		switch(item.type) {
			case 'symbol':
				if (item.symbol == '+') {
					this.negativeStatus = 0;
				} else if (item.symbol == '-') {
					this.negativeStatus = 1;
				}
				return item.symbol;
			case 'raw-number':
				var r = '';
				if (item.rejected) {
					r += '~~';
				}
				if (!item.rejected) {
					if (this.negativeStatus == 0) {
						this.total += item.numericValue;
					} else {
						this.total -= item.numericValue;
					}
				}
				r += item.numericValue;
				if (item.rejected) {
					r += '~~';
				}
				return r;
			case 'group':
				var r = '{';
				r += item.children.map(
					(item) => {
						return this.stringifyItem(item);
					}
				);
				r += '}';
				if (item.configuration.keep) {
					r += 'k';
					if (item.configuration.keepLow) {
						r += 'l';
					} else {
						r += 'h';
					}
					r += item.configuration.keep;
				}
				return r;
			case 'roll-group':
				var r = '';
				if (item.rejected) {
					r += '~~';
				}
				r += item.configuration.number + 'd' + item.configuration.size;
				if (item.configuration.exploding) {
					r += '!';
				}

				if (item.configuration.keep) {
					if (item.configuration.keepLow) {
						r += 'kl';
					} else {
						r += 'kh';
					}
					r += item.configuration.keep;
				}

				if (item.configuration.reroll.enabled) {
					r += 'r';
					if (item.configuration.reroll.max == 1) {
						r += 'o';
					}
					r += '<' + item.configuration.reroll.breakpoint;
				}
				r += ' (';

				r += item.rolls.map(
					(item) => {
						if (item.rejected) return '~~' + item.result + '~~';
						return item.result;
					}
				).join(', ');

				r += ')';
				if (item.rejected) {
					r += '~~';
				}

				if (!item.rejected) {
					if (this.negativeStatus == 0) {
						this.total += item.numericValue;
					} else {
						this.total -= item.numericValue;
					}
				}
				return r;
		}

	}

	stringify(result) {
		this.total = 0;
		this.negativeStatus = 0;

		var ret = '';
		ret += result.resultParts.map(
			(item) => {
				return this.stringifyItem(item);
			}
		).join(' ');

		ret += ' = ' + this.total;

		return ret;
	}
}

module.exports = TotalResult;