function Shuffle(deck) {
  const amount = deck.length;

  // Start from last index down to 1
  for (let lastIndex = amount - 1; lastIndex > 0; lastIndex--) {

    // Random index from 0 -> lastIndex
    const randomIndex = Math.floor(
      Math.random() * (lastIndex + 1)
    );

    // Swap
    [deck[lastIndex], deck[randomIndex]] = [
      deck[randomIndex],
      deck[lastIndex]
    ];
  }
}

module.exports = {
	Shuffle,
};