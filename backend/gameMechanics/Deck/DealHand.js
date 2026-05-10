const { Shuffle } = require('./shuffling');

/**
 * Validates player count (3–4 players only)
 */
function validatePlayers(players) {

  if (!Array.isArray(players)) {
    throw new Error("Players must be an array");
  }

  if (players.length < 3) {
    throw new Error("Minimum 3 players required");
  }

  if (players.length > 4) {
    throw new Error("Maximum 4 players allowed");
  }
}

/**
 * Deals remaining cards evenly to players
 * note that killer cards are removed from deck already
 * 
 * @param {Array} players - array of player objects
 * @param {Array} deck - remaining cards after removing murder set
 * @returns {Array} updated players with hands
 */
function dealPlayerHands(players, deck) {

  // enforce rules
  validatePlayers(players);

  // clone + shuffle deck
  const shuffledDeck = Shuffle([...deck]);

  // initialize players with empty hands
  const updatedPlayers = players.map(p => ({
    ...p,
    hand: []
  }));

  // round-robin distribution
  let index = 0;

  for (const card of shuffledDeck) {

    updatedPlayers[index].hand.push(card);

    index = (index + 1) % updatedPlayers.length;
  }

  return updatedPlayers;
}

module.exports = {
  dealPlayerHands
};