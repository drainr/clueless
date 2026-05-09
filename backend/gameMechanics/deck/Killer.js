const { Shuffle } = require('./shuffling');

function selectMurderCards(characters, weapons) {
  const shuffledCharacters = characters.map((character) => ({ ...character, isKiller: false }));
  const shuffledWeapons = weapons.map((weapon) => ({ ...weapon, murderWeapon: false }));

  Shuffle(shuffledCharacters);
  Shuffle(shuffledWeapons);

  if (shuffledCharacters.length > 0) {
    shuffledCharacters[0].isKiller = true;
  }

  if (shuffledWeapons.length > 0) {
    shuffledWeapons[0].murderWeapon = true;
  }

  return {
    killer: shuffledCharacters[0],
    weapon: shuffledWeapons[0],
    characters: shuffledCharacters,
    weapons: shuffledWeapons,
  };
}

module.exports = {
  selectMurderCards,
};