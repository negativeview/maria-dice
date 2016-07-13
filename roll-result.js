class RollResult {
	constructor() {
		this.results = [];
	}

	addResult(num) {
		this.results.push(num);
	}

	getResults() {
		return this.results;
	}

	_flatResults(arr) {
		var res = [];

		for (var i = 0; i < this.results.length; i++) {
			var item = this.rseults[i];
			switch (typeof(item)) {
				case 'number':
					res.push(item);
					break;
				case 'object':
					console.log(item);
					break;
			}
		}

		return res;
	}

	getFlatResults() {
		return this._flatResults(this.results);
	}
}

module.exports = RollResult;