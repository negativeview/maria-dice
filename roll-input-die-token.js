const RollInputToken = require('./roll-input-token.js');

class RollInputDieToken extends RollInputToken {
	constructor(data) {
		data.type = 'die';
		
		super(data);

		this.number = data.number ? data.number : 1;
		this.size = data.size ? data.size : 20;
		this.keep = data.keep;
		this.keepLow = data.keepLow ? true : false;
		this.exploding = data.exploding ? true : false;
		this.rerollBreak = data.rerollBreak ? data.rerollBreak : null;
		this.maxRerolls = data.maxRerolls ? data.maxRerolls : 1;
		this._debug = [];
	}

	formatResult() {
		var result = '';
		result += this.number + 'd' + this.size;
		if (this.keep) {
			result += 'k';
			if (this.keepLow) {
				result += 'l';
			} else {
				result += 'h';
			}
			result += this.keep;
		}
		result += ' (';
		if (this.result) {
			console.log('result', this.result);
			console.log('kept', this.kept);
			for (var i = 0; i < this.result.length; i++) {
				if (i != 0) {
					result += ', ';
				}
				result += this.result[i].total;
			}
		}
		result += ')';
		return result;
	}

	execute() {
		var initialDice = [];
		for (var i = 0; i < this.number; i++) {
			var token = {
				type: 'roll-result',
				diceThrows: [],
				diceKeeps: []
			};

			var max = this.size;
			var min = 1;

			var totalRolls = 0;
			while (true) {
				totalRolls++;
				var dieResult = Math.floor(Math.random() * (max - min + 1)) + min;
				token.diceThrows.push(dieResult);

				var doContinue = false;
				if (this.exploding && dieResult == max) {
					token.diceKeeps.push(dieResult);
					doContinue = true;
				} else if (this.rerollBreak && dieResult < this.rerollBreak) {
					doContinue = true;
				} else {
					token.diceKeeps.push(dieResult);
				}

				if (!doContinue || totalRolls >= 100) break;
			}

			token.total = 0;
			token.kept = false;
			for (var m = 0; m < token.diceKeeps.length; m++) {
				token.total += token.diceKeeps[m];
			}
			initialDice.push(token);
		}

		if (this.keep) {
			var toKeep = [];
			for (var i = 0; i < initialDice.length; i++) {
				if (toKeep.length < this.keep) {
					toKeep.push(initialDice[i]);
				} else {
					if (this.keepLow) {
						var curHighest = -1;
						for (var m = 0; m < toKeep.length; m++) {
							if (
								toKeep[m].total > initialDice[i].total &&
								(
									curHighest == -1 ||
									toKeep[m].total > toKeep[curHighest].total
								)
							) {
								curHighest = m;
							}
						}
						if (curHighest !== -1) {
							toKeep[curHighest] = initialDice[i];
						}
					} else {
						var curLowest = -1;
						for (var m = 0; m < toKeep.length; m++) {
							if (
								toKeep[m].total < initialDice[i].total &&
								(
									curLowest == -1 ||
									toKeep[m].total > toKeep[curLowest].total
								)
							) {
								curLowest = m;
							}
						}
						if (curLowest !== -1) {
							toKeep[curLowest] = initialDice[i];
						}

					}
				}
			}
			for (var i = 0; i < toKeep.length; i++) {
				for (var m = 0; m < initialDice; m++) {
					if (
						!initialDice[m].kept &&
						initialDice[m].total == toKeep[i].total
					) {
						initialDice[m].kept = true;
						break;
					}
				}
			}
			this.kept = toKeep;
		} else {
			var toKeep = [];
			for (var i = 0; i < initialDice.length; i++) {
				toKeep.push(initialDice[i]);
			}
			this.kept = toKeep;
		}

		for (var i = 0; i < this.kept.length; i++) {
			this.kept[i].kept = true;
		}

		this.result = initialDice;
	}

	totalAdjustment() {
		var result = 0;
		for (var i = 0; i < this.kept.length; i++) {
			result += this.kept[i].total;
		}
		return result;
	}

	toString() {
		return JSON.stringify(this.result, null, '  ') + ' = ' + JSON.stringify(this.kept, null, '  ');
	}
}

module.exports = RollInputDieToken;