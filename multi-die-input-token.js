"use strict";

const RollConfiguration = require('./roll-configuration.js');
const RollGroup = require('./roll-group.js');
const SingleDieInputToken = require('./single-die-input-token.js');

class MultiDieInputToken {
	constructor() {
		this.rollConfiguration = new RollConfiguration();
		this.rollGroup = new RollGroup();
		Object.defineProperty(
			this,
			'innerDice',
			{
				enumerable: false,
				configurable: true,
				writable: true,
				value: []
			}
		);
		this.type = 'multi-die';
	}

	getResult() {
		return this.rollGroup;
	}

	execute() {
		this.innerDice = [];
		for (var i = 0; i < this.rollConfiguration.number; i++) {
			var singleDie = new SingleDieInputToken();
			singleDie.rollConfiguration = this.rollConfiguration;
			singleDie.rollConfiguration.number = 1;
			singleDie.execute(this.rollGroup);
			this.innerDice.push(singleDie);
		}
	}
}

module.exports = MultiDieInputToken;