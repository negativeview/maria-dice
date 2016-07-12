class RollInputToken {
	constructor(data) {
		this.description = data.description;
		this.type = data.type;
		this.comment = data.comment;
	}

	getAmount() {
		return 0;
	}

	modifier(modifier) {
		return modifier;
	}

	group() {
		return false;
	}
}

module.exports = RollInputToken;