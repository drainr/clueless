const { weapons } = require('./deck');
const { Shuffle } = require('./shuffling');

function randomizeWeaponChoice(weaponList = weapons) {
	const shuffledWeapons = weaponList.map((weapon) => ({ ...weapon, murderWeapon: false }));

	Shuffle(shuffledWeapons);

	if (shuffledWeapons.length > 0) {
		shuffledWeapons[0].murderWeapon = true;
	}

	return shuffledWeapons;
}

module.exports = randomizeWeaponChoice;
