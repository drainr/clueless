/*
responsible for taking player ui and 
update backend

*/

// Builds the payload from the UI state and posts it to your backend
async function submitPlayers(players) {
  const payload = players.map(p => ({
    id:      p.id,
    name:    p.name.trim(),
    suspect: p.suspect,
  }));

  const res = await fetch('/api/game/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ players: payload }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  return res.json(); // returns each player's own hand only
}