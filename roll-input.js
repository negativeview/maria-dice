class RollInput {
	constructor(data) {
		this.description = data ? data.description ? data.description : '' : '';
		this.tokenObjects = new Array();

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

	execute() {
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
			ob.execute();
		}

		console.log('tokenObjects', this.tokenObjects);
	}

	/**
	 * TODO: Make this able to do different formats?
	 **/
	formatResult(user) {
		var diceFormat = 'standard';
		if (user) {
			var userOverride = user.getSetting('diceFormat');
			if (userOverride) diceFormat = userOverride;
		}

		if (this['_format_' + diceFormat] && typeof(this['_format_' + diceFormat]) == 'function') {
			return this['_format_' + diceFormat]();
		}

		return this['_format_standard']();
	}

	_format_simple() {
		var total = 0;
		var modifier = 1;

		for (var i = 0; i < this.tokenObjects.length; i++) {
			total += this.tokenObjects[i].totalAdjustment() * modifier;
			modifier = 1;
			modifier = this.tokenObjects[i].modifier(modifier);
		}

		return total;		
	}

	_format_standard() {
		var result = '';
		var total = 0;
		var modifier = 1;

		for (var i = 0; i < this.tokenObjects.length; i++) {
			if (i != 0) {
				result += ' ';
			}
			if (this.tokenObjects[i].formatResult)
				result += this.tokenObjects[i].formatResult();
			if (this.tokenObjects[i].totalAdjustment)
				total += this.tokenObjects[i].totalAdjustment() * modifier;
			modifier = 1;
			if (this.tokenObjects[i].modifier)
				modifier = this.tokenObjects[i].modifier(modifier);
		}
		result += ' = ';
		result += total;

		return result;
	}
}

module.exports = RollInput;