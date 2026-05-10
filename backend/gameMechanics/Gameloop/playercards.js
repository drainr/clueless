// Creates player objects and deals their hands at game start.
// It builds the initial player list, assigns spawn positions, and then passes the players into the deal-hand helper.
// Use this when you want a ready-to-play player setup instead of creating players manually.

const { dealPlayerHands } = require('../Deck/DealHand');

const Players = {

  create(count) {

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
        x: positions[i].x,
        y: positions[i].y,
        hand: []
      }))
    };
  },

  createAndDeal(count, deck) {
    const { list: players } = Players.create(count);
    return dealPlayerHands(players, deck);
  }
};

module.exports = Players;