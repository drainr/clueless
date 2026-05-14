const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

const Players = require('../gameMechanics/Gameloop/playercards');
const TurnSystem = require('../gameMechanics/Gameloop/TurnSystem');
const deck = require('../gameMechanics/Deck/deck');
describe('gameloop test', () => {
  // this checks for fewer than 3 players
  test('number of players should not be fewer than 3', () => {
    assert.throws(() => Players.create(2), /Player count must be 3 or 4/);
  });

  // this checks for more than 4 players
  test('number of players should not be more than 4', () => {
    assert.throws(() => Players.create(5), /Player count must be 3 or 4/);
  });

  // this checks for a legit dice total
  test('dice roll should return a legit total', () => {
    const roll = TurnSystem.roll();

    assert.ok(roll.die1 >= 1 && roll.die1 <= 6);
    assert.ok(roll.die2 >= 1 && roll.die2 <= 6);
    assert.equal(roll.total, roll.die1 + roll.die2);
    assert.ok(roll.total >= 2 && roll.total <= 12);
  });

  // this checks for weapon cards
  test('weapon cards should exist in the deck', () => {
    assert.ok(Array.isArray(deck.weapons));
    assert.ok(deck.weapons.length > 0);
    assert.ok(deck.weapons.every((card) => card.type === 'weapon'));
  });

  // this checks for location cards
  test('location cards should exist in the deck', () => {
    assert.ok(Array.isArray(deck.rooms));
    assert.ok(deck.rooms.length > 0);
    assert.ok(deck.rooms.every((card) => card.type === 'room'));
  });
});

