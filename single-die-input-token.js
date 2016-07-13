"use strict";

const Roll = require('./roll.js');
const RollConfiguration = require('./roll-configuration.js');
const RollGroup = require('./roll-group.js');

class SingleDieInputToken {
	constructor() {
		this.rollConfiguration = new RollConfiguration();
		this.type = 'single-die';
		this.rollGroup = null;
	}

	getResult() {
		return this.rollGroup;
	}

	execute(rollGroup) {
		var max = this.rollConfiguration.size;
		var min = 1;
		var rerolls = 0;

		var keepGoing = true;

		if (rollGroup) {
			this.rollGroup = rollGroup;
		} else {
			this.rollGroup = new RollGroup();
			this.rollGroup.configuration = this.rollConfiguration;
		}

		var why = 'basic-roll';
		var nextWhy = 'basic-roll';

		while (keepGoing) {
			keepGoing = false;
			var rejected = null;

			var dieResult = Math.floor(Math.random() * (max - min + 1)) + min;

			if (this.rollConfiguration.reroll.enabled && dieResult < this.rollConfiguration.reroll.breakpoint) {
				keepGoing = true;
				nextWhy = 'rolled-too-low';
				rejected = 'rolled-too-low';
			}
			if (this.rollConfiguration.exploding && dieResult == this.rollConfiguration.size) {
				keepGoing = true;
				nextWhy = 'exploded';
			}
			if (this.rollConfiguration.reroll.max !== -1 && rerolls >= this.rollConfiguration.reroll.max) {
				keepGoing = false;
				rejected = null;
			}

			var roll = new Roll();
			roll.why = why;
			roll.result = dieResult;
			roll.rejected = rejected;

			this.rollGroup.addRoll(roll);

			rerolls++;

			why = nextWhy;
		}
	}
}

module.exports = SingleDieInputToken;