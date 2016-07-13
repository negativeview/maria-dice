"use strict";

const ExplicitGroup = require('./explicit-group.js');
const RollConfiguration = require('./roll-configuration.js');

class RollInputGroupToken {
	constructor(data) {
		this.rollConfiguration = new RollConfiguration();
		data.type = 'group';
		this.operation = data.operation;
		this.explicitGroup = null;
	}

	execute() {
		this.explicitGroup = new ExplicitGroup();
		this.explicitGroup.configuration = this.rollConfiguration;

		for (var m = 0; m < this.repeat; m++) {
			for (var i = 0; i < this.internal.length - 1; i++) {
				var ob = this.internal[i];
				if (ob.execute) {
					ob.execute();
				}
				if ((ob.type !== 'math' && ob.type !== 'symbol') && (ob.rollGroup || ob.getResult)) {
					console.log('addingChild for', ob);
					this.explicitGroup.addChild(ob.rollGroup ? ob.rollGroup : ob.getResult());
				}
			}
		}
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
					this.rollConfiguration = arr[i].rollConfiguration;
					delete this.rollConfiguration.size;
					delete this.rollConfiguration.number;
					delete this.rollConfiguration.reroll;
					delete this.rollConfiguration.exploding;
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