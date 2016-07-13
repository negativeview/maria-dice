const lexer = require('lex');
const MultiDieInputToken = require('./multi-die-input-token.js');
const NumericInputToken = require('./numeric-input-token.js');
const RollInput = require('./roll-input.js');
const RollInputGroupToken = require('./roll-input-group-token.js');
const RollInputMathToken = require('./roll-input-math-token.js');
const SingleDieInputToken = require('./single-die-input-token.js');

class RollParser {
	constructor() {
		this.lex = new lexer();

		/**
		 * When you generate things from code, you sometimes wind up with
		 * things like `1d20 + -5`. This collapses that down into just a
		 * negative.
		 */
		this.lex.addRule(
			/\+\-/,
			(lexeme) => {
				this.tokens.push({
					type: '-',
					lexeme: '-'
				});
			}
		);

		/**
		 * Handle negatives or plusses by themselves.
		 */
		this.lex.addRule(
			/[\-\+]/,
			(lexeme) => {
				this.tokens.push({
					type: lexeme,
					lexeme: lexeme
				});
			}
		);

		/**
		 * Handle comments surrounded by square brackets.
		 */
		this.lex.addRule(
			/\[([^\]]+)\]/,
			(lexeme, comment) => {
				this.tokens.push({
					type: 'comment',
					lexeme: lexeme,
					comment: comment
				});
			}
		);

		/**
		 * Ignore whitespace. This has to be after the commenents, so that we
		 * can have spaces in our comments.
		 */
		this.lex.addRule(/[ \n\t\r]/, function(lexeme) {
		});

		/**
		 * Reroll once if less than a specified value. Keep the higher result.
		 */
		this.lex.addRule(
			/ro<(\d+)/,
			(lexeme, num) => {
				this.tokens.push({
					type: 'ro<',
					lexeme: lexeme,
					num: parseInt(num)
				});
			}
		);

		/**
		 * Reroll until a the result is above the given value. Will eventually
		 * give up, but rolls something like 100 times before that.
		 */
		this.lex.addRule(
			/r<(\d+)/,
			(lexeme, num) => {
				this.tokens.push({
					type: 'r<',
					lexeme: lexeme,
					num: parseInt(num)
				});
			}
		);

		/**
		 * NdX
		 */
		this.lex.addRule(
			/(\d+)d(\d+)/i,
			(lexeme, num, size) => {
				this.tokens.push({
					type: 'die',
					lexeme: lexeme,
					number: parseInt(num),
					dieSize: parseInt(size)
				});
			}
		);

		/**
		 * -H syntax for advantage, for historical compatibility
		 */
		this.lex.addRule(
			/\-H/,
			(lexeme) => {
				this.tokens.push({
					type: 'keep-high',
					num: 1,
					lexeme: lexeme
				});
			}
		);

		/**
		 * Exploding dice.
		 */
		this.lex.addRule(
			/\!/,
			(lexeme) => {
				this.tokens.push({
					type: 'exploding',
					lexeme: lexeme
				});
			}
		);

		/**
		 * Keep highest N dice from the previous roll.
		 */
		this.lex.addRule(
			/kh(\d+)/,
			(lexeme) => {
				var matches = lexeme.match(/kh(\d+)/);
				var num = matches[1];

				this.tokens.push({
					type: 'keep-high',
					lexeme: lexeme,
					num: parseInt(num)
				});
			}
		);

		/**
		 * Keep lowest N from the previous roll.
		 */
		this.lex.addRule(
			/kl(\d+)/,
			(lexeme) => {
				var matches = lexeme.match(/kl(\d+)/);
				var num = matches[1];

				this.tokens.push({
					type: 'keep-low',
					lexeme: lexeme,
					num: parseInt(num)
				});
			}
		);

		/**
		 * Ignore parenthesis. I forget why this is here...
		 */
		this.lex.addRule(
			/[\(\)]/,
			(lexeme) => {
			}
		);

		this.lex.addRule(
			/\,/,
			(lexeme) => {
				this.tokens.push({
					type: 'comma'
				})
			}
		);

		this.lex.addRule(
			/\{/,
			(lexeme) => {
				this.tokens.push({
					type: 'start-group'
				});
			}
		);

		this.lex.addRule(
			/\}/,
			(lexeme) => {
				this.tokens.push({
					type: 'end-group'
				});
			}
		);

		/**
		 * -L is the historical way of doing disadvantage.
		 */
		this.lex.addRule(
			/\-L/,
			(lexeme) => {
				this.tokens.push({
					type: 'keep-low',
					num: 1
				});
			}
		);

		/**
		 * Just a raw number. Hopefully the subject of some addition or
		 * subtraction, otherwise it's likely an error.
		 */
		this.lex.addRule(
			/(\d+)/,
			(lexeme) => {
				this.tokens.push({
					type: 'number',
					lexeme: parseInt(lexeme)
				});
			}
		);
	}

	/**
	 * This can throw an exception from this.lex.lex();
	 */
	parse(string) {
		var rollInput = new RollInput();
		var tokenObjects = [];

		this.tokens = [];
		this.lex.setInput(string);
		this.lex.lex();

		var lastCommentable = null;
		var lastMultiDice = null;
		var lastOnePlusDice = null;
		for (var i = 0; i < this.tokens.length; i++) {
			var token = this.tokens[i];
			switch (token.type) {
				case 'r<':
					if (!lastOnePlusDice) {
						console.log('Cannot reroll things that are not dice.');
					} else {
						lastOnePlusDice.rerollBreak = token.num;
						lastOnePlusDice.maxRerolls = 100;
					}
					break;
				case 'ro<':
					if (!lastOnePlusDice) {
						console.log('Cannot reroll things that are not dice.');
					} else {
						lastOnePlusDice.rerollBreak = token.num;
						lastOnePlusDice.maxRerolls = 1;
					}
					break;				
				case 'exploding':
					if (!lastOnePlusDice) {
						console.log('Cannot explode without a thing to go boom.');
					} else {
						lastOnePlusDice.rollConfiguration.exploding = true;
					}
					break;
				case 'keep-high':
					if (!lastMultiDice) {
						console.log('Cannot modify with keep info without a die!');
					} else {
						lastMultiDice.rollConfiguration.keep = token.num;
					}
					break;
				case 'keep-low':
					if (!lastMultiDice) {
						console.log('Cannot modify with keep info without a die!');
					} else {
						lastMultiDice.rollConfiguration.keep = token.num;
						lastMultiDice.rollConfiguration.keepLow = true;
					}
					break;
				case 'comment':
					if (!lastCommentable) {
						console.log('Not able to add a comment. Bad person!');
					} else {
						lastCommentable.comment = token.comment;
					}
					break;
				case 'start-group':
					var t = new RollInputGroupToken(
						{
							operation: 'start'
						}
					);
					tokenObjects.push(t);
					break;
				case 'end-group':
					var t = new RollInputGroupToken(
						{
							operation: 'end'
						}
					);
					lastCommentable = t;
					lastMultiDice = t;
					lastOnePlusDice = t;
					tokenObjects.push(t);
					break;
				case 'comma':
					var t = new RollInputMathToken(
						{
							token: ','
						}
					);
					tokenObjects.push(t);
					break;
				case 'die':
					if (token.number == 1) {
						var t = new SingleDieInputToken();
						t.rollConfiguration.size = token.dieSize;
						lastCommentable = t;
						lastOnePlusDice = t;
						lastMultiDice = t;
					} else {
						var t = new MultiDieInputToken();
						t.rollConfiguration.number = token.number;
						t.rollConfiguration.size = token.dieSize;
						lastCommentable = t;
						lastMultiDice = t;
						lastOnePlusDice = t;
					}
					this._numDice++;
					tokenObjects.push(t);
					break;
				case '+':
					var t = new RollInputMathToken(
						{
							token: '+'
						}
					);
					tokenObjects.push(t);
					break;
				case '-':
					var t = new RollInputMathToken(
						{
							token: '-'
						}
					);
					tokenObjects.push(t);
					break;
				case 'number':
					var t = new NumericInputToken(token.lexeme);
					lastCommentable = t;
					tokenObjects.push(t);
					break;
				default:
					console.log(token);
			}
		}

		for (var i = 0; i < tokenObjects.length; i++) {
			rollInput.addToken(tokenObjects[i]);
		}

		return rollInput;
	}
}

module.exports = RollParser;