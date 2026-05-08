export const CHARACTERS = [
  { id: 'scarlet',  name: 'Miss Scarlet',   color: '#DC2626' },
  { id: 'mustard',  name: 'Col. Mustard',   color: '#D97706' },
  { id: 'white',    name: 'Mrs. White',     color: '#F9FAFB' },
  { id: 'green',    name: 'Mr. Green',      color: '#059669' },
  { id: 'peacock',  name: 'Mrs. Peacock',   color: '#2563EB' },
  { id: 'plum',     name: 'Prof. Plum',     color: '#7C3AED' },
];

export const WEAPONS = [
  'Candlestick', 'Knife', 'Lead Pipe', 'Revolver', 'Rope', 'Wrench'
];

export const ROOMS = [
  { id: 'kitchen',       name: 'Kitchen',       adjacent: ['ballroom', 'study'] },
  { id: 'ballroom',      name: 'Ballroom',      adjacent: ['kitchen', 'conservatory'] },
  { id: 'library',       name: 'Library',       adjacent: ['study', 'conservatory'] },
  { id: 'study',         name: 'Study',         adjacent: ['kitchen', 'library'] },
  { id: 'conservatory',  name: 'Conservatory',  adjacent: ['ballroom', 'library'] },
];