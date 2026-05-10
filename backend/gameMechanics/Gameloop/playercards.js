// Creates player objects and deals their hands at game start.
// It can accept chosen character names, assigns spawn positions, and then passes the players into the deal-hand helper.
// Use this when you want a ready-to-play player setup instead of creating players manually.

const { dealPlayerHands } = require('../Deck/DealHand');

function getChosenCharacter(choice, fallbackName) {
  if (typeof choice === 'string' && choice.trim()) {
    return choice.trim();
  }

  if (choice && typeof choice === 'object') {
    return (choice.character || choice.suspect || choice.name || fallbackName || '').trim();
  }

  return fallbackName;
}

const Players = {

  create(count, chosenCharacters = []) {

    if (count < 3 || count > 4) {
      throw new Error("Player count must be 3 or 4");
    }

    // grid positions for up to 4 players
    const positions = [
      { x: 0, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
      { x: 4, y: 0 } // optional 4th spawn point
    ];

    return {
      list: Array.from({ length: count }, (_, i) => ({
        name: `P${i + 1}`,
        displayName: `P${i + 1}`,
        character: getChosenCharacter(chosenCharacters[i], `P${i + 1}`),
        x: positions[i].x,
        y: positions[i].y,
        hand: []
      }))
    };
  },

  createAndDeal(count, deck, chosenCharacters = []) {
    const { list: players } = Players.create(count, chosenCharacters);
    return dealPlayerHands(players, deck);
  }
};

module.exports = Players;