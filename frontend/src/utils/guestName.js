const adjectives = [
  'Silly', 'Sneaky', 'Clumsy', 'Grumpy', 'Witty', 'Jolly', 'Crafty',
  'Daring', 'Fuzzy', 'Lucky', 'Quirky', 'Spooky', 'Dizzy', 'Fancy',
  'Clever', 'Bouncy', 'Sleepy', 'Wobbly', 'Cheeky', 'Jumpy', 'Misty',
  'Brave', 'Shady', 'Hasty', 'Zippy', 'Nosy', 'Rusty', 'Grouchy'
]

const animals = [
  'Armadillo', 'Mongoose', 'Platypus', 'Wombat', 'Narwhal', 'Capybara',
  'Axolotl', 'Quokka', 'Pangolin', 'Fennec', 'Tapir', 'Binturong',
  'Meerkat', 'Caracal', 'Okapi', 'Numbat', 'Kinkajou', 'Fossa',
  'Parakeet', 'Wolverine', 'Porcupine', 'Salamander', 'Chameleon',
  'Albatross', 'Flamingo', 'Weasel', 'Hedgehog', 'Badger'
]

export const generateGuestName = () => {
  const adj    = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  return `${adj} ${animal}`
}