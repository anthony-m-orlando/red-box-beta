import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacter } from '../../contexts/CharacterContext';
import AbilityRoller from './AbilityRoller';
import ClassSelector from './ClassSelector';
import AlignmentSelector from './AlignmentSelector';
import CharacterFinalization from './CharacterFinalization';
import './CharacterCreator.css';

/**
 * CharacterCreator - Multi-step wizard for character creation
 * Steps:
 * 1. Roll Abilities (AbilityRoller)
 * 2. Choose Class (ClassSelector) - Coming next
 * 3. Choose Alignment - Coming next
 * 4. Select Equipment - Coming next
 * 5. Finalize & Name - Coming next
 */
export function CharacterCreator() {
  const { character, resetCharacter } = useCharacter();
  const navigate = useNavigate();
  const currentStep = character.creationStep;
  const [hasCheckedReset, setHasCheckedReset] = useState(false);

  // Reset character when component mounts if we're creating a new character
  useEffect(() => {
    if (!hasCheckedReset) {
      // Check if we entered this page with intent to create NEW character
      // If character is already created (isCreated = true), reset it
      if (character.isCreated) {
        console.log('CharacterCreator: Resetting completed character for new creation');
        resetCharacter();
      }
      setHasCheckedReset(true);
    }
  }, [character.isCreated, hasCheckedReset, resetCharacter]);

  // Progress indicator
  const steps = [
    { number: 1, label: 'Abilities', active: currentStep >= 1, complete: currentStep > 1 },
    { number: 2, label: 'Class', active: currentStep >= 2, complete: currentStep > 2 },
    { number: 3, label: 'Alignment', active: currentStep >= 3, complete: currentStep > 3 },
    { number: 4, label: 'Equipment', active: currentStep >= 4, complete: currentStep > 4 },
    { number: 5, label: 'Finalize', active: currentStep >= 5, complete: character.isCreated }
  ];

  return (
    <div className="character-creator">
      {/* Progress Bar */}
      <div className="creation-progress">
        <div className="progress-bar">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`progress-step ${step.active ? 'active' : ''} ${step.complete ? 'complete' : ''}`}>
                <div className="step-number">{step.number}</div>
                <div className="step-label">{step.label}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`progress-line ${step.complete ? 'complete' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="creation-content">
        {currentStep === 1 && <AbilityRoller />}
        
        {currentStep === 2 && <ClassSelector />}
        
        {currentStep === 3 && <AlignmentSelector />}
        
        {/* Skip step 4 (equipment) for now and go straight to finalization */}
        {currentStep >= 4 && <CharacterFinalization />}
      </div>

      {/* Back to Home Button */}
      <div className="creator-footer">
        <button 
          className="back-home-link" 
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

/**
 * Placeholder for coming soon steps
 */
function ComingSoonStep({ title, description }) {
  return (
    <div className="coming-soon-step">
      <div className="coming-soon-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="coming-soon-badge">
          Coming Soon in Phase 2
        </div>
      </div>
    </div>
  );
}

export default CharacterCreator;
