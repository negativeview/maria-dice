"use strict"

class RollConfiguration {
	constructor() {
		this.size = 20;
		this.number = 1;
		this.exploding = false;
		this.keep = null;
		this.keepLow = false;
		this.reroll = {
			enabled: false,
			max: 100,
			breakpoint: -1
		}
	}
}

module.exports = RollConfiguration;