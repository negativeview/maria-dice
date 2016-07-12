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
}

module.exports = RollResult;