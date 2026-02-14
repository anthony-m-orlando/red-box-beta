/**
 * Character Calculations
 * Authentic 1983 D&D Basic Rules calculations
 */

/**
 * Calculate ability score modifier
 * Basic D&D uses straight modifiers (not modern d20 system)
 * @param {number} score - Ability score (3-18)
 * @returns {number} - Modifier (-3 to +3)
 */
export function calculateModifier(score) {
  if (score <= 3) return -3;
  if (score <= 5) return -2;
  if (score <= 8) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return +1;
  if (score <= 17) return +2;
  return +3; // 18
}

/**
 * Calculate maximum hit points for a character
 * @param {string} className - Character class
 * @param {number} constitution - Constitution score
 * @param {number} level - Character level
 * @returns {number} - Maximum HP
 */
export function calculateMaxHP(className, constitution, level = 1) {
  const conMod = calculateModifier(constitution);
  
  // Hit dice by class
  const hitDice = {
    'cleric': 6,
    'fighter': 8,
    'magic-user': 4,
    'thief': 4,
    'dwarf': 8,
    'elf': 6,
    'halfling': 6
  };
  
  const die = hitDice[className.toLowerCase()] || 6;
  
  // Level 1 = max die + con modifier (minimum 1)
  if (level === 1) {
    return Math.max(1, die + conMod);
  }
  
  // Higher levels would roll (not needed for demo, but included for completeness)
  let hp = die + conMod; // First level max
  for (let i = 2; i <= level; i++) {
    hp += Math.max(1, Math.floor(Math.random() * die) + 1 + conMod);
  }
  
  return Math.max(level, hp); // At least 1 HP per level
}

/**
 * Calculate Armor Class (lower is better in Basic D&D)
 * @param {number} baseAC - Base armor class (9 for no armor)
 * @param {number} dexterity - Dexterity score
 * @param {number} armorBonus - Bonus from armor/shield (negative numbers improve AC)
 * @returns {number} - Final AC
 */
export function calculateAC(baseAC = 9, dexterity = 10, armorBonus = 0) {
  const dexMod = calculateModifier(dexterity);
  // In Basic D&D, positive dex modifier LOWERS AC (makes it better)
  return baseAC - dexMod + armorBonus;
}

/**
 * Get armor class for equipment
 * @param {string} armorType - Type of armor
 * @param {boolean} hasShield - Whether character has a shield
 * @returns {number} - Armor class
 */
export function getArmorAC(armorType, hasShield = false) {
  const armorAC = {
    'none': 9,
    'leather': 7,
    'chain mail': 5,
    'plate mail': 3
  };
  
  let ac = armorAC[armorType.toLowerCase()] || 9;
  if (hasShield) {
    ac -= 1; // Shield improves AC by 1
  }
  
  return ac;
}

/**
 * Calculate THAC0 (To Hit Armor Class 0)
 * @param {string} className - Character class
 * @param {number} level - Character level
 * @param {number} strength - Strength score (for melee bonus)
 * @returns {number} - THAC0 value
 */
export function calculateTHAC0(className, level = 1, strength = 10) {
  // Base THAC0 by class at level 1
  const baseTHAC0 = {
    'cleric': 19,
    'fighter': 19,
    'magic-user': 19,
    'thief': 19,
    'dwarf': 19,
    'elf': 19,
    'halfling': 19
  };
  
  let thac0 = baseTHAC0[className.toLowerCase()] || 19;
  
  // Fighters improve faster (every 3 levels vs every 4)
  const isFighter = ['fighter', 'dwarf'].includes(className.toLowerCase());
  const improvement = isFighter ? Math.floor((level - 1) / 3) : Math.floor((level - 1) / 4);
  
  thac0 -= improvement;
  
  return thac0;
}

/**
 * Calculate attack roll needed to hit a target AC
 * @param {number} thac0 - Character's THAC0
 * @param {number} targetAC - Target's armor class
 * @returns {number} - D20 roll needed to hit
 */
export function calculateToHit(thac0, targetAC) {
  return thac0 - targetAC;
}

/**
 * Get prime requisite for a class
 * @param {string} className - Character class
 * @returns {string[]} - Array of prime requisite abilities
 */
export function getPrimeRequisite(className) {
  const primeReqs = {
    'cleric': ['wisdom'],
    'fighter': ['strength'],
    'magic-user': ['intelligence'],
    'thief': ['dexterity'],
    'dwarf': ['strength'],
    'elf': ['strength', 'intelligence'],
    'halfling': ['strength', 'dexterity']
  };
  
  return primeReqs[className.toLowerCase()] || [];
}

/**
 * Calculate XP bonus based on prime requisite
 * @param {string} className - Character class
 * @param {object} abilityScores - Object with all ability scores
 * @returns {number} - XP bonus percentage (0, 5, or 10)
 */
export function calculateXPBonus(className, abilityScores) {
  const primeReqs = getPrimeRequisite(className);
  
  if (primeReqs.length === 0) return 0;
  
  // For classes with multiple prime requisites (Elf), use lowest
  const scores = primeReqs.map(ability => abilityScores[ability] || 10);
  const lowestPrimeReq = Math.min(...scores);
  
  if (lowestPrimeReq >= 16) return 10;
  if (lowestPrimeReq >= 13) return 5;
  return 0;
}

/**
 * Check if character meets class requirements
 * @param {string} className - Character class
 * @param {object} abilityScores - Object with all ability scores
 * @returns {object} - { allowed: boolean, reason: string }
 */
export function meetsClassRequirements(className, abilityScores) {
  const requirements = {
    'cleric': { constitution: 9 },
    'fighter': { strength: 9 },
    'magic-user': { intelligence: 9 },
    'thief': { dexterity: 9 },
    'dwarf': { constitution: 9, strength: 9 },
    'elf': { intelligence: 9, strength: 9 },
    'halfling': { constitution: 9, dexterity: 9 }
  };
  
  const reqs = requirements[className.toLowerCase()];
  if (!reqs) {
    return { allowed: true };
  }
  
  for (const [ability, minScore] of Object.entries(reqs)) {
    if (abilityScores[ability] < minScore) {
      return {
        allowed: false,
        reason: `Requires ${ability.charAt(0).toUpperCase() + ability.slice(1)} ${minScore}+`
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Get starting gold by class
 * @param {string} className - Character class
 * @returns {number} - Starting gold pieces
 */
export function getStartingGold(className) {
  // All classes start with 3d6 x 10 gold in Basic D&D
  const roll = Math.floor(Math.random() * 6) + 1 +
               Math.floor(Math.random() * 6) + 1 +
               Math.floor(Math.random() * 6) + 1;
  return roll * 10;
}

/**
 * Calculate encumbrance in coins
 * @param {object[]} items - Array of items with weight property
 * @returns {number} - Total weight in coins (cn)
 */
export function calculateEncumbrance(items) {
  return items.reduce((total, item) => {
    return total + (item.weight || 0) * (item.quantity || 1);
  }, 0);
}

/**
 * Get movement rate based on encumbrance
 * @param {number} encumbrance - Total encumbrance in coins
 * @param {number} baseMovement - Base movement rate (120 for most characters)
 * @returns {number} - Movement rate in feet per turn
 */
export function getMovementRate(encumbrance, baseMovement = 120) {
  if (encumbrance <= 400) return baseMovement;
  if (encumbrance <= 800) return 90;
  if (encumbrance <= 1200) return 60;
  if (encumbrance <= 1600) return 30;
  return 0; // Over-encumbered, cannot move
}

export default {
  calculateModifier,
  calculateMaxHP,
  calculateAC,
  getArmorAC,
  calculateTHAC0,
  calculateToHit,
  getPrimeRequisite,
  calculateXPBonus,
  meetsClassRequirements,
  getStartingGold,
  calculateEncumbrance,
  getMovementRate
};
