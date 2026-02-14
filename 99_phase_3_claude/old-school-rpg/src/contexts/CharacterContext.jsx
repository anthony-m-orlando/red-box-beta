import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  calculateModifier, 
  calculateMaxHP, 
  calculateAC,
  calculateTHAC0,
  getPrimeRequisite,
  calculateXPBonus,
  meetsClassRequirements,
  getStartingGold
} from '../utils/calculations';

/**
 * CharacterContext - Global character state
 */
const CharacterContext = createContext();

/**
 * Initial character state
 */
const initialState = {
  // Basic Info
  name: '',
  class: null,
  level: 1,
  xp: 0,
  alignment: null,
  
  // Ability Scores
  abilities: {
    strength: null,
    intelligence: null,
    wisdom: null,
    dexterity: null,
    constitution: null,
    charisma: null
  },
  
  // Combat Stats
  hp: {
    current: 0,
    max: 0
  },
  ac: 9,
  thac0: 19,
  
  // Equipment
  inventory: [],
  gold: 0,
  armor: 'none',
  hasShield: false,
  
  // Progress
  isCreated: false,
  creationStep: 1 // 1: Abilities, 2: Class, 3: Alignment, 4: Equipment, 5: Finalize
};

/**
 * Character reducer
 */
function characterReducer(state, action) {
  switch (action.type) {
    case 'SET_ABILITIES':
      return {
        ...state,
        abilities: action.payload,
        creationStep: 2
      };
    
    case 'SET_CLASS': {
      const className = action.payload;
      const maxHP = calculateMaxHP(className, state.abilities.constitution, 1);
      const ac = calculateAC(9, state.abilities.dexterity);
      const thac0 = calculateTHAC0(className, 1, state.abilities.strength);
      const gold = getStartingGold(className);
      
      return {
        ...state,
        class: className,
        hp: { current: maxHP, max: maxHP },
        ac,
        thac0,
        gold,
        creationStep: 3
      };
    }
    
    case 'SET_ALIGNMENT':
      return {
        ...state,
        alignment: action.payload,
        creationStep: 4  // Skip equipment, go to finalization
      };
    
    case 'SET_EQUIPMENT': {
      const { armor, hasShield, inventory } = action.payload;
      const ac = calculateAC(9, state.abilities.dexterity);
      
      return {
        ...state,
        armor,
        hasShield,
        inventory,
        ac,
        creationStep: 5
      };
    }
    
    case 'SET_NAME':
      return {
        ...state,
        name: action.payload
      };
    
    case 'FINALIZE_CHARACTER':
      return {
        ...state,
        isCreated: true
      };
    
    case 'UPDATE_HP': {
      const { current, max } = action.payload;
      return {
        ...state,
        hp: {
          current: Math.max(0, Math.min(current, max || state.hp.max)),
          max: max || state.hp.max
        }
      };
    }
    
    case 'DAMAGE': {
      const damage = action.payload;
      return {
        ...state,
        hp: {
          ...state.hp,
          current: Math.max(0, state.hp.current - damage)
        }
      };
    }
    
    case 'HEAL': {
      const healing = action.payload;
      return {
        ...state,
        hp: {
          ...state.hp,
          current: Math.min(state.hp.max, state.hp.current + healing)
        }
      };
    }
    
    case 'ADD_XP': {
      const xpGained = action.payload;
      const newXP = state.xp + xpGained;
      // Level up logic would go here (not needed for demo)
      return {
        ...state,
        xp: newXP
      };
    }
    
    case 'ADD_ITEM':
      return {
        ...state,
        inventory: [...state.inventory, action.payload]
      };
    
    case 'REMOVE_ITEM': {
      const itemId = action.payload;
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== itemId)
      };
    }
    
    case 'UPDATE_GOLD': {
      const amount = action.payload;
      return {
        ...state,
        gold: Math.max(0, state.gold + amount)
      };
    }
    
    case 'LOAD_CHARACTER':
      return {
        ...action.payload,
        isCreated: true
      };
    
    case 'RESET_CHARACTER':
      return initialState;
    
    case 'GO_TO_STEP':
      return {
        ...state,
        creationStep: action.payload
      };
    
    default:
      return state;
  }
}

/**
 * CharacterProvider component
 */
export function CharacterProvider({ children }) {
  const [state, dispatch] = useReducer(characterReducer, initialState);
  
  // Auto-save to localStorage on state changes
  useEffect(() => {
    if (state.isCreated) {
      try {
        localStorage.setItem('rpg-character', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save character:', error);
      }
    }
  }, [state]);
  
  // Load character on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rpg-character');
      if (saved) {
        const character = JSON.parse(saved);
        dispatch({ type: 'LOAD_CHARACTER', payload: character });
      }
    } catch (error) {
      console.error('Failed to load character:', error);
    }
  }, []);
  
  const value = {
    character: state,
    dispatch,
    
    // Helper functions
    setAbilities: (abilities) => dispatch({ type: 'SET_ABILITIES', payload: abilities }),
    setClass: (className) => dispatch({ type: 'SET_CLASS', payload: className }),
    setAlignment: (alignment) => dispatch({ type: 'SET_ALIGNMENT', payload: alignment }),
    setEquipment: (equipment) => dispatch({ type: 'SET_EQUIPMENT', payload: equipment }),
    setName: (name) => dispatch({ type: 'SET_NAME', payload: name }),
    finalizeCharacter: () => dispatch({ type: 'FINALIZE_CHARACTER' }),
    
    // Combat actions
    takeDamage: (damage) => dispatch({ type: 'DAMAGE', payload: damage }),
    heal: (amount) => dispatch({ type: 'HEAL', payload: amount }),
    updateHP: (current, max) => dispatch({ type: 'UPDATE_HP', payload: { current, max } }),
    
    // Inventory
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (itemId) => dispatch({ type: 'REMOVE_ITEM', payload: itemId }),
    updateGold: (amount) => dispatch({ type: 'UPDATE_GOLD', payload: amount }),
    
    // Experience
    addXP: (amount) => dispatch({ type: 'ADD_XP', payload: amount }),
    
    // Utility
    resetCharacter: () => dispatch({ type: 'RESET_CHARACTER' }),
    goToStep: (step) => dispatch({ type: 'GO_TO_STEP', payload: step }),
    
    // Calculated properties
    getModifier: (ability) => calculateModifier(state.abilities[ability]),
    getPrimeRequisite: () => getPrimeRequisite(state.class),
    getXPBonus: () => calculateXPBonus(state.class, state.abilities),
    canChooseClass: (className) => meetsClassRequirements(className, state.abilities),
    
    // Export/Import
    exportCharacter: () => {
      const data = JSON.stringify(state, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.name || 'character'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    importCharacter: (jsonString) => {
      try {
        const character = JSON.parse(jsonString);
        dispatch({ type: 'LOAD_CHARACTER', payload: character });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };
  
  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

/**
 * Hook to use character context
 */
export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within CharacterProvider');
  }
  return context;
}

export default CharacterContext;
