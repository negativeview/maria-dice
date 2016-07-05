"use strict";

const assert = require('assert');
const RollInput = require('./roll-input.js');

/**
 * Test the very very basics
 **/
var ri = new RollInput({});
assert.equal(ri.description, '');
assert.equal(typeof(ri.tokenObjects), 'object');
assert(Array.isArray(ri.tokenObjects));
assert(ri.tokens);
assert(Array.isArray(ri.tokens));

/**
 * Simplest possible case for a die input.
 **/
ri.addTokensFromString('1d20');
assert.equal(ri.tokenObjects.length, 1);
assert.equal(ri.tokenObjects[0].type, 'die');
assert.equal(ri.tokenObjects[0].number, 1);
assert.equal(ri.tokenObjects[0].size, 20);
assert.equal(ri.tokenObjects[0].keep, null);
assert.equal(ri.tokenObjects[0].keepLow, false);
assert.equal(ri.tokenObjects[0].exploding, false);
assert.equal(ri.tokenObjects[0].rerollBreak, null);
assert.equal(ri.tokenObjects[0].maxRerolls, 1);
assert.equal(ri.tokenObjects[0].formatResult(), '1d20 ()');

/**
 * Test adding a simple addition operator.
 **/
ri.addTokensFromString('+');
assert.equal(ri.tokenObjects.length, 2);
assert.equal(ri.tokenObjects[1].type, 'math');
assert.equal(ri.tokenObjects[1].token, '+');

/**
 * Advantage
 **/
ri.addTokensFromString('2d20-H');
assert.equal(ri.tokenObjects.length, 3);
assert.equal(ri.tokenObjects[2].type, 'die');
assert.equal(ri.tokenObjects[2].number, 2);
assert.equal(ri.tokenObjects[2].size, 20);
assert.equal(ri.tokenObjects[2].keep, 1);
assert.equal(ri.tokenObjects[2].keepLow, false);
assert.equal(ri.tokenObjects[2].exploding, false);
assert.equal(ri.tokenObjects[2].rerollBreak, null);
assert.equal(ri.tokenObjects[2].maxRerolls, 1);
assert.equal(ri.tokenObjects[2].formatResult(), '2d20kh1 ()');

/**
 * Test adding a simple subtraction operator.
 **/
ri.addTokensFromString('-');
assert.equal(ri.tokenObjects.length, 4);
assert.equal(ri.tokenObjects[3].type, 'math');
assert.equal(ri.tokenObjects[3].token, '-');

/**
 * Disadvantage
 **/
ri.addTokensFromString('2d20-L');
assert.equal(ri.tokenObjects.length, 5);
assert.equal(ri.tokenObjects[4].type, 'die');
assert.equal(ri.tokenObjects[4].number, 2);
assert.equal(ri.tokenObjects[4].size, 20);
assert.equal(ri.tokenObjects[4].keep, 1);
assert.equal(ri.tokenObjects[4].keepLow, true);
assert.equal(ri.tokenObjects[4].exploding, false);
assert.equal(ri.tokenObjects[4].rerollBreak, null);
assert.equal(ri.tokenObjects[4].maxRerolls, 1);
assert.equal(ri.tokenObjects[4].formatResult(), '2d20kl1 ()');

/**
 * Actually execute
 **/
ri.execute();

/**
 * The simple die token is pretty simple to test.
 **/
assert(ri.tokenObjects[0].result);
assert(ri.tokenObjects[0].kept);
assert(ri.tokenObjects[0].totalAdjustment() > 0);
assert.equal(ri.tokenObjects[0].kept.length, 1);
assert.equal(ri.tokenObjects[0].kept[0].total, ri.tokenObjects[0].totalAdjustment());

assert(ri.tokenObjects[2].result);
assert(ri.tokenObjects[2].kept);
assert(ri.tokenObjects[2].totalAdjustment() > 0);
assert.equal(ri.tokenObjects[2].kept.length, 1);
assert.equal(ri.tokenObjects[2].kept[0].total, ri.tokenObjects[2].totalAdjustment(), JSON.stringify(ri.tokenObjects[2], null, '  '));

assert(ri.tokenObjects[4].result);
assert(ri.tokenObjects[4].kept);
assert(ri.tokenObjects[4].totalAdjustment() > 0);
assert.equal(ri.tokenObjects[4].kept.length, 1);
assert.equal(ri.tokenObjects[4].kept[0].total, ri.tokenObjects[4].totalAdjustment(), JSON.stringify(ri.tokenObjects[4], null, '  '));
