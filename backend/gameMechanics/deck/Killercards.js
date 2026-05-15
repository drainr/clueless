// select a killer with a randomized weapon and room (location)

const { Shuffle } = require('./shuffling');

function selectMurderCards(characters, weapons, rooms) {

  const shuffledCharacters = characters.map(c => ({
    ...c,
    isKiller: false
  }));

  const shuffledWeapons = weapons.map(w => ({
    ...w,
    murderWeapon: false
  }));

  const shuffledRooms = rooms.map(r => ({
    ...r,
    deathLocation: false
  }));

  // shuffle all arrays
  Shuffle(shuffledCharacters);
  Shuffle(shuffledWeapons);
  Shuffle(shuffledRooms);

  // select killer
  if (shuffledCharacters.length > 0) {
    shuffledCharacters[0].isKiller = true;
  }

  // select murder weapon
  if (shuffledWeapons.length > 0) {
    shuffledWeapons[0].murderWeapon = true;
  }

  // select murder location (room)
  if (shuffledRooms.length > 0) {
    shuffledRooms[0].deathLocation = true;
  }

  const killer = shuffledCharacters[0];
  const weapon = shuffledWeapons[0];
  const room = shuffledRooms[0];

  const remainingDeck = [...shuffledCharacters, ...shuffledWeapons, ...shuffledRooms].filter((card) => {
    return card.id !== killer?.id && card.id !== weapon?.id && card.id !== room?.id;
  });

  return {
    killer,
    weapon,
    room,

    characters: shuffledCharacters,
    weapons: shuffledWeapons,
    rooms: shuffledRooms,
    remainingDeck,
  };
}

// export for game start
module.exports = {
  selectMurderCards,
};