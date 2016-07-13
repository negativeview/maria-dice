"use strict";

const ExplicitGroup = require('./explicit-group.js');
const RollInputToken = require('./roll-input-token.js');

class RollInputGroupToken extends RollInputToken {
	constructor(data) {
		data.type = 'group';
		super(data);
		this.operation = data.operation;
		this.explicitGroup = null;
	}

	execute() {
		this.explicitGroup = new ExplicitGroup();

		for (var m = 0; m < this.repeat; m++) {
			for (var i = 0; i < this.internal.length - 1; i++) {
				var ob = this.internal[i];
				if (ob.execute) {
					ob.execute();
					this.explicitGroup.addRoll(ob);
				}
			}
		}
		console.log('post execute', this);
	}

	getResult() {
		return this.explicitGroup;
	}

	_doGroup(arr, start, e) {
		var end = arr[e];

		this.internal = arr.splice(start, e - start + 1);
	}

	group(arr, index) {
		if (this.operation == 'start') {
			for (var i = index + 1; i < arr.length; i++) {
				if (arr[i].operation == 'end') {
					this.comment = arr[i].comment;
					this.keep = arr[i].keep;
					this.keepLow = arr[i].keepLow;
					this.exploding = arr[i].exploding;
					this.rerollBreak = arr[i].rerollBreak;
					this.maxRerolls = arr[i].maxRerolls;
					this.operation = 'full-group';
					this._doGroup(arr, index + 1, i);

					if (index != 0 && arr[index - 1].type == 'number') {
						this.repeat = arr[index - 1].number;
						arr.splice(index - 1, 1);
					} else {
						this.repeat = 1;
					}
					return true;
				} else if (arr[i].operation == 'start') {
					return false;
				}
			}
		}

		console.log('post group', this);
	}
}

module.exports = RollInputGroupToken;