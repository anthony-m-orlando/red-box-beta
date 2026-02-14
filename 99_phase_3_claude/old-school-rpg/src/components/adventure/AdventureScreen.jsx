import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Swords } from 'lucide-react';
import { useCharacter } from '../../contexts/CharacterContext';
import { useAdventure } from '../../contexts/AdventureContext';
import NarrationPanel from './NarrationPanel';
import MapDisplay from './MapDisplay';
import ActionPanel from './ActionPanel';
import Button from '../common/Button';
import './AdventureScreen.css';

/**
 * AdventureScreen - Main adventure gameplay screen
 * Layout: Narration (top) | Map (bottom-left) | Actions (bottom-right)
 */
export function AdventureScreen() {
  const navigate = useNavigate();
  const { character } = useCharacter();
  const { adventure, getCurrentRoom, addNarration } = useAdventure();
  
  // Check if player has a character
  useEffect(() => {
    if (!character.isCreated) {
      navigate('/character/create');
    }
  }, [character.isCreated, navigate]);
  
  // Add initial narration
  useEffect(() => {
    if (adventure.narrationHistory.length === 0) {
      const room = getCurrentRoom();
      addNarration('room_description', room.description);
      addNarration('system_message', 'Your adventure begins! Explore the dungeon and defeat all monsters to win.');
    }
  }, []); // Empty deps - only run once on mount
  
  // Check for victory or defeat
  if (adventure.isVictorious) {
    return <VictoryScreen />;
  }
  
  if (adventure.isDefeated) {
    return <DefeatScreen />;
  }
  
  return (
    <div className="adventure-screen">
      {/* Narration Panel (top) */}
      <NarrationPanel />
      
      {/* Main Content Area */}
      <div className="adventure-content">
        {/* Map (left) */}
        <div className="adventure-map-section">
          <MapDisplay />
        </div>
        
        {/* Actions (right) */}
        <div className="adventure-action-section">
          <ActionPanel />
        </div>
      </div>
      
      {/* Footer */}
      <div className="adventure-footer">
        <Button
          variant="ghost"
          size="sm"
          icon={<Home />}
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}

/**
 * VictoryScreen - Shown when player wins
 */
function VictoryScreen() {
  const navigate = useNavigate();
  const { character, addXP } = useCharacter();
  const { adventure, resetAdventure } = useAdventure();
  
  // Award XP for defeated monsters
  useEffect(() => {
    const totalXP = 65; // 5 (goblin) + 10 (snake) + 50 (rust monster)
    addXP(totalXP);
  }, []);
  
  return (
    <div className="adventure-screen victory-screen">
      <div className="victory-content">
        <div className="victory-header">
          <h1>🎉 Victory! 🎉</h1>
          <p className="victory-subtitle">
            You have completed "Your First Adventure"!
          </p>
        </div>
        
        <div className="victory-stats">
          <h2>Adventure Summary</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Monsters Defeated:</span>
              <span className="stat-value number">{adventure.defeatedMonsters.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rooms Explored:</span>
              <span className="stat-value number">{adventure.visitedRooms.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">XP Earned:</span>
              <span className="stat-value number">65</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Gold Collected:</span>
              <span className="stat-value number">60</span>
            </div>
          </div>
        </div>
        
        <div className="victory-message">
          <p>
            Congratulations, {character.name}! You have proven yourself a capable adventurer.
            You've learned the basics of dungeon exploration, combat, and treasure hunting.
          </p>
          <p>
            This concludes the tutorial adventure. In a full version of the game,
            you would continue to "Bargle Wanted" and other exciting quests!
          </p>
        </div>
        
        <div className="victory-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              resetAdventure();
              navigate('/character/create');
            }}
          >
            Create New Character
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * DefeatScreen - Shown when player dies
 */
function DefeatScreen() {
  const navigate = useNavigate();
  const { character } = useCharacter();
  const { resetAdventure } = useAdventure();
  
  return (
    <div className="adventure-screen defeat-screen">
      <div className="defeat-content">
        <div className="defeat-header">
          <h1>💀 Defeat 💀</h1>
          <p className="defeat-subtitle">
            {character.name} has fallen in the dungeon...
          </p>
        </div>
        
        <div className="defeat-message">
          <p>
            Your adventure has come to a tragic end. The dungeon has claimed another brave soul.
          </p>
          <p>
            But fear not! In the world of D&D, death is not always the end.
            You can try again with a new character, or even attempt to resurrect this one!
          </p>
        </div>
        
        <div className="defeat-actions">
          <Button
            variant="danger"
            size="lg"
            onClick={() => {
              resetAdventure();
              navigate('/character/create');
            }}
          >
            Create New Character
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdventureScreen;
