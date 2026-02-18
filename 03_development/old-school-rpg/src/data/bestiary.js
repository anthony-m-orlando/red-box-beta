/**
 * Bestiary - Monster reference database
 * Contains detailed stats for all monsters in the tutorial adventure
 */

export const bestiary = {
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    type: 'humanoid',
    alignment: 'Chaotic',
    hp: { current: 4, max: 4 },
    hitDice: '1-1',
    ac: 6,
    thac0: 19,
    attacks: [
      { name: 'Short Sword', damage: '1d6' }
    ],
    xp: 5,
    movement: 60,
    morale: 7,
    saves: {
      death: 12,
      wands: 13,
      paralysis: 14,
      breath: 15,
      spells: 16
    },
    special: ['Infravision 60 feet', 'Prefer ambushes'],
    description: 'Small, wicked humanoids that dwell in dark places. Goblins are cowardly creatures with yellowish-green skin and sharp teeth. They stand about 3-4 feet tall and prefer to attack from the shadows.',
    tactics: 'Goblins prefer ambushes and overwhelming numbers. They flee if reduced to half strength or if their leader is killed. They fight best in darkness.',
    habitat: 'Caves, ruins, and underground lairs',
    treasure: 'Individual: 1d6 GP, 10% chance of rusty dagger',
    alignment: 'Chaotic',
    encounterSize: '2d4 individuals'
  },
  
  snake: {
    id: 'snake',
    name: 'Snake, Giant',
    type: 'beast',
    hp: { current: 6, max: 6 },
    hitDice: '2',
    ac: 6,
    thac0: 18,
    attacks: [
      { name: 'Bite', damage: '1d6', special: 'poison' }
    ],
    xp: 10,
    movement: 90,
    morale: 8,
    saves: {
      death: 12,
      wands: 13,
      paralysis: 14,
      breath: 15,
      spells: 16
    },
    special: [
      'Poison (save vs. Poison or die)',
      'Keen senses',
      'Can detect vibrations'
    ],
    description: 'A massive serpent measuring 10-15 feet in length with gleaming scales. Its fangs drip with deadly venom. These creatures are found in warm underground chambers and attack anything that enters their territory.',
    tactics: 'The giant snake strikes quickly, attempting to bite and inject venom. It then retreats and waits for the poison to take effect. If the prey survives, it strikes again.',
    habitat: 'Warm caves, underground chambers, tropical ruins',
    treasure: '2d6 GP, 5% chance of healing potion (often guarding treasure)',
    alignment: 'Neutral',
    encounterSize: '1d3 snakes'
  },
  
  rust_monster: {
    id: 'rust_monster',
    name: 'Rust Monster',
    type: 'aberration',
    hp: { current: 18, max: 18 },
    hitDice: '5',
    ac: 2,
    thac0: 15,
    attacks: [
      { name: 'Antenna Touch', damage: 'Special', special: 'rusts metal instantly' }
    ],
    xp: 50,
    movement: 120,
    morale: 12,
    saves: {
      death: 10,
      wands: 11,
      paralysis: 12,
      breath: 13,
      spells: 14
    },
    special: [
      'Rust Metal (any metal touching antennae rusts instantly)',
      'Immune to most weapons (metal weapons useless)',
      'Feeds on metal (attracted to armor and weapons)',
      'Fast movement (120 feet per round)'
    ],
    description: 'A bizarre creature resembling a lobster with a propeller-like tail. Its body is covered in yellow-brown plating, and two long antennae extend from its head. These antennae instantly rust any metal they touch. The rust monster feeds exclusively on metal and is drawn to heavily armored parties.',
    tactics: 'The rust monster actively seeks out metal to consume. It rushes toward the most heavily armored target, attempting to touch armor or weapons with its antennae. It is not aggressive toward creatures without metal, but will defend itself if attacked. Difficult to defeat without wooden or stone weapons.',
    habitat: 'Underground ruins, old fortifications, anywhere with abundant metal',
    treasure: '3d10 GP, 20% chance of wooden shield, 15% chance of healing potion (piles of rusted metal may contain intact items)',
    alignment: 'Neutral',
    encounterSize: '1d2 rust monsters',
    weakness: 'Vulnerable to wooden, stone, and magical weapons'
  }
};

/**
 * Get a specific monster by ID
 * @param {string} monsterId - The monster's unique identifier
 * @returns {object} Monster data
 */
export function getMonster(monsterId) {
  return bestiary[monsterId];
}

/**
 * Get all monsters as an array
 * @returns {array} Array of all monster objects
 */
export function getAllMonsters() {
  return Object.values(bestiary);
}

/**
 * Get monsters by type
 * @param {string} type - Monster type (humanoid, beast, aberration, etc.)
 * @returns {array} Array of monsters of that type
 */
export function getMonstersByType(type) {
  return Object.values(bestiary).filter(monster => monster.type === type);
}

/**
 * Get monsters by HD range
 * @param {number} minHD - Minimum hit dice
 * @param {number} maxHD - Maximum hit dice
 * @returns {array} Array of monsters in HD range
 */
export function getMonstersByHD(minHD, maxHD) {
  return Object.values(bestiary).filter(monster => {
    const hd = parseInt(monster.hitDice);
    return hd >= minHD && hd <= maxHD;
  });
}

export default bestiary;
