"use strict";

const TotalResult = require('./total-result.js');

class RollInput {
	constructor(data) {
		this.description = data ? data.description ? data.description : '' : '';
		this.tokenObjects = new Array();
		this.result = null;

		Object.defineProperty(
			this,
			'tokens',
			{
				enumerable: false,
				value: [],
				writable: true
			}
		);

		Object.defineProperty(
			this,
			'simple',
			{
				enumerable: false,
				get: () => {
					return this._format_simple()
				}
			}
		);

		Object.defineProperty(
			this,
			'toString',
			{
				enumerable: false,
				writable: false,
				value: () => {
					return this.formatResult()
				}
			}
		);

		Object.defineProperty(
			this,
			'_numDice',
			{
				enumerable: false,
				writable: true,
				value: 0
			}
		);
	}

	addToken(token) {
		this.tokenObjects.push(token);
	}

	getResult() {
		return this.result;
	}

	execute() {
		this.result = new TotalResult();
		while(true) {
			var didUpdate = false;
			for (var i = 0; i < this.tokenObjects.length; i++) {
				var ob = this.tokenObjects[i];
				if (ob.group) {
					didUpdate = ob.group(this.tokenObjects, i);
				}
				if (didUpdate) break;
			}
			if (!didUpdate) break;
		}

		for (var i = 0; i < this.tokenObjects.length; i++) {
			var ob = this.tokenObjects[i];
			if (ob.execute) {
				ob.execute();
			}
			if (ob.getResultToken) {
				this.result.addPart(ob.getResultToken());
			}
		}
	}
}

module.exports = RollInput;