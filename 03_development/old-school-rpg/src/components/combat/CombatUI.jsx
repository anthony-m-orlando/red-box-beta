import React, { useState, useEffect } from 'react';
import { Swords, Shield, AlertTriangle, Sparkles } from 'lucide-react';
import { useCharacter } from '../../contexts/CharacterContext';
import { useAdventure } from '../../contexts/AdventureContext';
import { rollAttack, rollDamage, rollInitiative, checkMorale, applyStrengthDamage, getStrengthAttackBonus } from '../../utils/combat';
import { applySpellEffect, hasSpellsAvailable } from '../../utils/spells';
import { getSpell } from '../../data/spells';
import Button from '../common/Button';
import PaperContainer from '../common/PaperContainer';
import SpellMenu from './SpellMenu';
import './CombatUI.css';

/**
 * CombatUI - Turn-based combat interface
 */
export function CombatUI({ enemy }) {
  const { character, takeDamage, heal, addXP, updateGold, useSpellSlot } = useCharacter();
  const adventure = useAdventure();
  const { endCombat, addNarration } = adventure;
  
  const [combatState, setCombatState] = useState('initiative'); // initiative, playerTurn, enemyTurn, victory, defeat
  const [enemyHP, setEnemyHP] = useState(enemy.hp.current);
  const [playerInitiative, setPlayerInitiative] = useState(0);
  const [enemyInitiative, setEnemyInitiative] = useState(0);
  const [round, setRound] = useState(1);
  const [combatLog, setCombatLog] = useState([]);
  const [showSpellMenu, setShowSpellMenu] = useState(false);

  const [combatStarted, setCombatStarted] = useState(false);

  // Roll initiative on mount
  useEffect(() => {
    if (combatStarted) return; // Prevent double execution
    setCombatStarted(true);
    
    const pInit = rollInitiative();
    const eInit = rollInitiative();
    setPlayerInitiative(pInit);
    setEnemyInitiative(eInit);
    
    addLogEntry(`Combat begins! Rolling initiative...`);
    addLogEntry(`You rolled ${pInit}, ${enemy.name} rolled ${eInit}`);
    
    if (pInit > eInit) {
      addLogEntry(`You go first!`);
      setCombatState('playerTurn');
    } else if (eInit > pInit) {
      addLogEntry(`${enemy.name} goes first!`);
      // Delay enemy turn slightly for dramatic effect
      setTimeout(() => setCombatState('enemyTurn'), 1000);
    } else {
      addLogEntry(`Tied initiative! You go first.`);
      setCombatState('playerTurn');
    }
  }, [combatStarted]);

  // Check for victory/defeat
  useEffect(() => {
    if (enemyHP <= 0 && combatState !== 'victory') {
      handleVictory();
    }
    if (character.hp.current <= 0 && combatState !== 'defeat') {
      handleDefeat();
    }
  }, [enemyHP, character.hp.current]);

  // Auto-execute enemy turn
  useEffect(() => {
    if (combatState === 'enemyTurn' && enemyHP > 0) {
      console.log('Auto-triggering enemy turn via useEffect');
      const timer = setTimeout(() => {
        handleEnemyTurn();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [combatState]);

  const addLogEntry = (message) => {
    setCombatLog(prev => [...prev, { id: Date.now() + Math.random(), text: message }]);
  };

  const handlePlayerAttack = () => {
    console.log('Player attack - combat state:', combatState);
    
    // Calculate attack
    const attackBonus = getStrengthAttackBonus(character.abilities.strength);
    const attackRoll = rollAttack(character.thac0, enemy.ac, attackBonus);
    
    if (attackRoll.hit) {
      // Roll damage
      let damage = rollDamage('1d8'); // Basic sword damage
      damage = applyStrengthDamage(damage, character.abilities.strength);
      
      if (attackRoll.critical) {
        damage = damage * 2;
        addLogEntry(`⚔️ CRITICAL HIT! You strike ${enemy.name} for ${damage} damage!`);
      } else {
        addLogEntry(`⚔️ You hit ${enemy.name} for ${damage} damage!`);
      }
      
      setEnemyHP(prev => Math.max(0, prev - damage));
      
      // Add to narration
      addNarration('combat_action', `You hit the ${enemy.name} for ${damage} damage!`, { emphasis: true });
    } else {
      if (attackRoll.fumble) {
        addLogEntry(`💥 FUMBLE! Your attack goes wild!`);
        addNarration('combat_action', 'Your attack misses wildly!');
      } else {
        addLogEntry(`⚔️ Your attack misses!`);
        addNarration('combat_action', 'Your attack misses.');
      }
    }
    
    // Enemy turn next (don't use setTimeout here)
    setCombatState('enemyTurn');
  };

  const handlePlayerDefend = () => {
    addLogEntry(`🛡️ You take a defensive stance! (AC improved)`);
    addNarration('combat_action', 'You defend, improving your armor class.');
    
    // Temporary AC bonus (would need to track this in state for full implementation)
    setCombatState('enemyTurn');
    setTimeout(handleEnemyTurn, 1500);
  };

  const handlePlayerFlee = () => {
    // 50% chance to flee successfully
    const fleeRoll = Math.random();
    
    if (fleeRoll > 0.5) {
      addLogEntry(`🏃 You successfully flee from combat!`);
      addNarration('combat_action', 'You flee from the battle!');
      endCombat(false, enemy.id);
    } else {
      addLogEntry(`🏃 You fail to escape! ${enemy.name} gets a free attack!`);
      addNarration('combat_action', 'Failed to flee!');
      setCombatState('enemyTurn');
      setTimeout(handleEnemyTurn, 1000);
    }
  };

  const handleCastSpell = (spellId) => {
    console.log('Casting spell:', spellId);
    
    const spell = getSpell(spellId);
    if (!spell) {
      console.error('Spell not found:', spellId);
      return;
    }
    
    // Close spell menu
    setShowSpellMenu(false);
    
    // Determine target based on spell type
    const spellType = spell.implementation.type;
    const target = (spellType === 'healing' || spellType === 'buff') 
      ? character  // Self-target for healing/buffs
      : { hp: { current: enemyHP, max: enemy.hp.max }, ...enemy }; // Enemy for damage
    
    // Apply spell effect
    const result = applySpellEffect(spell, character, target, 'combat');
    
    // Log spell cast
    addLogEntry(`✨ You cast ${spell.name}!`);
    addNarration('combat_action', `You cast ${spell.name}!`, { emphasis: true });
    
    // Apply effects based on type
    switch (result.type) {
      case 'healing':
        heal(result.healAmount);
        addLogEntry(`💚 ${spell.name} heals ${result.healAmount} HP!`);
        addNarration('combat_action', `${spell.name} restores ${result.healAmount} hit points!`);
        break;
        
      case 'damage':
        setEnemyHP(result.newHP);
        addLogEntry(`⚡ ${spell.name} deals ${result.damage} damage!`);
        addNarration('combat_action', `${spell.name} strikes for ${result.damage} damage!`, { emphasis: true });
        break;
        
      case 'buff':
        // TODO: Apply buff to character (would need buff tracking system)
        addLogEntry(`🛡️ ${spell.name} grants ${result.bonus > 0 ? '+' : ''}${result.bonus} ${result.stat.toUpperCase()}!`);
        addNarration('combat_action', result.message);
        break;
        
      case 'utility':
        addLogEntry(`✨ ${result.message}`);
        addNarration('combat_action', result.message);
        break;
        
      default:
        addLogEntry(`✨ ${result.message}`);
        addNarration('combat_action', result.message);
    }
    
    // Use spell slot
    useSpellSlot(spell.level);
    
    // Enemy turn next
    setCombatState('enemyTurn');
  };

  const handleEnemyTurn = () => {
    // Double-check combat is still active
    if (combatState !== 'enemyTurn') {
      console.log('Enemy turn skipped - wrong state:', combatState);
      return;
    }
    
    if (enemyHP <= 0) {
      console.log('Enemy turn skipped - enemy defeated');
      return;
    }
    
    if (character.hp.current <= 0) {
      console.log('Enemy turn skipped - player defeated');
      return;
    }
    
    console.log('Enemy turn executing...');
    
    // Check morale if badly wounded
    if (enemyHP < enemy.hp.max * 0.25) {
      if (checkMorale(enemy.morale || 9)) {
        addLogEntry(`${enemy.name} flees in terror!`);
        addNarration('combat_action', `The ${enemy.name} flees!`);
        handleVictory();
        return;
      }
    }
    
    // Enemy attacks
    const attackRoll = rollAttack(enemy.thac0, character.ac);
    
    if (attackRoll.hit) {
      const damage = rollDamage(enemy.damage);
      
      if (attackRoll.critical) {
        const critDamage = damage * 2;
        addLogEntry(`💀 CRITICAL! ${enemy.name} hits you for ${critDamage} damage!`);
        addNarration('combat_action', `The ${enemy.name} scores a critical hit for ${critDamage} damage!`, { emphasis: true });
        takeDamage(critDamage);
      } else {
        addLogEntry(`💢 ${enemy.name} hits you for ${damage} damage!`);
        addNarration('combat_action', `The ${enemy.name} hits you for ${damage} damage!`);
        takeDamage(damage);
      }
    } else {
      if (attackRoll.fumble) {
        addLogEntry(`${enemy.name} fumbles its attack!`);
        addNarration('combat_action', `The ${enemy.name} attacks wildly and misses!`);
      } else {
        addLogEntry(`${enemy.name} misses!`);
        addNarration('combat_action', `The ${enemy.name}'s attack misses.`);
      }
    }
    
    // Check if player is still alive before continuing
    setTimeout(() => {
      if (character.hp.current > 0 && enemyHP > 0) {
        setRound(prev => prev + 1);
        setCombatState('playerTurn');
      }
    }, 500);
  };

  const handleVictory = () => {
    setCombatState('victory');
    addLogEntry(`🎉 Victory! ${enemy.name} is defeated!`);
    
    // Award XP
    addXP(enemy.xp);
    addLogEntry(`You gain ${enemy.xp} XP!`);
    
    // Narration
    addNarration('system_message', enemy.defeatedText || `The ${enemy.name} falls defeated!`, { emphasis: true });
    addNarration('system_message', `You gain ${enemy.xp} experience points!`);
    
    // End combat after delay
    setTimeout(() => {
      endCombat(true, enemy.id);
    }, 3000);
  };

  const handleDefeat = () => {
    setCombatState('defeat');
    addLogEntry(`💀 You have been defeated!`);
    addNarration('combat_action', 'You fall unconscious...', { emphasis: true });
    
    // Trigger defeat state
    setTimeout(() => {
      adventure.dispatch({ type: 'SET_DEFEAT' });
    }, 2000);
  };

  return (
    <div className="combat-ui">
      <PaperContainer variant="aged" padding="lg" className="combat-container">
        {/* Enemy Status */}
        <div className="enemy-status">
          <h3>{enemy.name}</h3>
          <div className="enemy-hp-bar">
            <div 
              className="enemy-hp-fill"
              style={{ width: `${(enemyHP / enemy.hp.max) * 100}%` }}
            />
            <span className="enemy-hp-text number">
              {enemyHP}/{enemy.hp.max} HP
            </span>
          </div>
          <div className="enemy-stats">
            <span>AC: {enemy.ac}</span>
            <span>THAC0: {enemy.thac0}</span>
          </div>
        </div>

        <div className="combat-divider"></div>

        {/* Combat Log */}
        <div className="combat-log">
          <h4>Round {round}</h4>
          <div className="log-entries">
            {combatLog.slice(-6).map(entry => (
              <div key={entry.id} className="log-entry">
                {entry.text}
              </div>
            ))}
          </div>
        </div>

        <div className="combat-divider"></div>

        {/* Combat Actions */}
        {combatState === 'playerTurn' && (
          <div className="combat-actions">
            <h4>Your Turn</h4>
            <div className="action-buttons">
              <Button
                variant="danger"
                icon={<Swords />}
                onClick={handlePlayerAttack}
                fullWidth
              >
                Attack
              </Button>
              
              {/* Cast Spell Button - only if character has spells */}
              {character.spells && character.spells.length > 0 && hasSpellsAvailable(character) && (
                <Button
                  variant="primary"
                  icon={<Sparkles />}
                  onClick={() => setShowSpellMenu(true)}
                  fullWidth
                >
                  Cast Spell
                </Button>
              )}
              
              <Button
                variant="secondary"
                icon={<Shield />}
                onClick={handlePlayerDefend}
                fullWidth
              >
                Defend
              </Button>
              
              <Button
                variant="ghost"
                icon={<AlertTriangle />}
                onClick={handlePlayerFlee}
                fullWidth
              >
                Flee
              </Button>
            </div>
          </div>
        )}
        
        {/* Spell Menu Modal */}
        {showSpellMenu && (
          <SpellMenu
            character={character}
            onCastSpell={handleCastSpell}
            onClose={() => setShowSpellMenu(false)}
          />
        )}

        {combatState === 'enemyTurn' && (
          <div className="combat-waiting">
            <h4>Enemy Turn</h4>
            <p className="flavor-text">{enemy.name} is attacking...</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('Manual enemy turn trigger');
                handleEnemyTurn();
              }}
            >
              [Debug: Skip Enemy Turn]
            </Button>
          </div>
        )}

        {combatState === 'victory' && (
          <div className="combat-result victory-result">
            <h2>🎉 Victory!</h2>
            <p>You defeated the {enemy.name}!</p>
            <p className="xp-award">+{enemy.xp} XP</p>
          </div>
        )}

        {combatState === 'defeat' && (
          <div className="combat-result defeat-result">
            <h2>💀 Defeated</h2>
            <p>You have fallen...</p>
          </div>
        )}
      </PaperContainer>
    </div>
  );
}

export default CombatUI;
