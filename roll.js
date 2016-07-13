"use strict";

/**
 * The result of a roll.
 **/
class Roll {
	constructor() {
		this.why = 'basic-roll';
		this.configuration = {};
		this.result = -1;
		this.rejected = NULL;
	}
}

module.exports = Roll;