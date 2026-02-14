import React from 'react';
import { Sword, Scroll, Package, ArrowRight } from 'lucide-react';
import { useCharacter } from '../../contexts/CharacterContext';
import { useAdventure } from '../../contexts/AdventureContext';
import Button from '../common/Button';
import PaperContainer from '../common/PaperContainer';
import './ActionPanel.css';

/**
 * ActionPanel - Shows current room status and available actions
 */
export function ActionPanel() {
  const { character } = useCharacter();
  const { adventure, getCurrentRoom, enterRoom } = useAdventure();
  
  const currentRoom = getCurrentRoom();
  const availableExits = currentRoom.exits.filter(exit => {
    // Show all discovered exits
    return exit.discovered || adventure.visitedRooms.includes(exit.targetRoomId);
  });
  
  // Check if room is cleared
  const monstersInRoom = currentRoom.contents.monsters || [];
  const monstersAlive = monstersInRoom.filter(mId => 
    !adventure.defeatedMonsters.includes(mId)
  );
  const roomCleared = monstersAlive.length === 0;
  
  return (
    <div className="action-panel">
      <PaperContainer variant="cream" padding="lg" className="action-container">
        {/* Character Status */}
        <div className="character-status">
          <h3>{character.name}</h3>
          <div className="status-bars">
            <div className="status-item">
              <span className="status-label">HP:</span>
              <div className="hp-bar">
                <div 
                  className="hp-fill"
                  style={{ width: `${(character.hp.current / character.hp.max) * 100}%` }}
                />
                <span className="hp-text number">
                  {character.hp.current}/{character.hp.max}
                </span>
              </div>
            </div>
            
            <div className="status-row">
              <div className="status-compact">
                <span className="status-label">AC:</span>
                <span className="number">{character.ac}</span>
              </div>
              <div className="status-compact">
                <span className="status-label">Gold:</span>
                <span className="number">{character.gold}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="section-divider"></div>
        
        {/* Current Room */}
        <div className="current-room-info">
          <h4>Current Location</h4>
          <p className="room-name">{currentRoom.name}</p>
          
          {monstersAlive.length > 0 && (
            <div className="danger-warning">
              <Sword size={16} />
              <span>{monstersAlive.length} monster(s) present!</span>
            </div>
          )}
          
          {roomCleared && (
            <div className="cleared-notice">
              <span>✓ Room Cleared</span>
            </div>
          )}
        </div>
        
        <div className="section-divider"></div>
        
        {/* Combat Section (placeholder) */}
        {adventure.inCombat ? (
          <div className="combat-section">
            <h4>⚔️ Combat!</h4>
            <p>Combat system coming in next update...</p>
            <p className="flavor-text">
              For now, exploring the dungeon and viewing the map demonstrates
              the core adventure mechanics.
            </p>
          </div>
        ) : (
          <>
            {/* Available Actions */}
            <div className="available-actions">
              <h4>Available Actions</h4>
              
              {/* Movement */}
              {availableExits.length > 0 && (
                <div className="action-group">
                  <p className="action-group-label">Movement:</p>
                  {availableExits.map((exit, index) => (
                    <Button
                      key={index}
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight />}
                      onClick={() => enterRoom(exit.targetRoomId)}
                      fullWidth
                    >
                      Go {exit.direction}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Other Actions (placeholders) */}
              <div className="action-group">
                <p className="action-group-label">Other Actions:</p>
                
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Scroll />}
                  fullWidth
                  disabled
                >
                  Search Room
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Package />}
                  fullWidth
                  disabled
                >
                  Use Item
                </Button>
              </div>
            </div>
          </>
        )}
        
        {/* Progress */}
        <div className="adventure-progress">
          <h4>Quest Progress</h4>
          <div className="progress-item">
            <span>Monsters Defeated:</span>
            <span className="number">{adventure.defeatedMonsters.length}/3</span>
          </div>
          <div className="progress-item">
            <span>Rooms Explored:</span>
            <span className="number">{adventure.visitedRooms.length}/5</span>
          </div>
        </div>
      </PaperContainer>
    </div>
  );
}

export default ActionPanel;
