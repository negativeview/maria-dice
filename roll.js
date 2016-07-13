"use strict";

/**
 * The result of a roll.
 **/
class Roll {
	constructor() {
		this.why = 'basic-roll';
		this.result = -1;
		this.rejected = null;
	}
}

module.exports = Roll;