# Old School RPG Demo

A faithful digital recreation of the 1983 Dungeons & Dragons Basic Rules (Set 1), designed as a solo adventure experience with an authentic analog paper aesthetic.

## 🎲 Project Overview

This React application brings the classic D&D Basic Rules to life as a browser-based solo adventure, featuring:
- **Character Creation**: Roll 3d6 for abilities, choose from 7 classic classes
- **Solo Adventures**: Tutorial adventure + main "Bargle Wanted" quest
- **Authentic Mechanics**: THAC0, saving throws, XP progression exactly as in the 1983 rules
- **Analog Aesthetic**: Cream paper backgrounds, graph paper maps, handwritten fonts
- **Zero Server Costs**: All data stored in browser (IndexedDB + localStorage)

## 📋 Current Status: Phase 1 Complete ✅

### What's Built
- ✅ Project scaffold with Vite + React
- ✅ Base styling system (paper textures, typography, color palette)
- ✅ Home Page with red dragon cover art
- ✅ Feature grid (4 cards: Character Creation, Continue, Dice Roller, Reference)
- ✅ Common components (PaperContainer, Button)
- ✅ Routing setup with React Router
- ✅ Responsive design (desktop, tablet, mobile)

### Screenshots
![Home Page with Dragon Cover](./screenshots/home-page.png) *(coming soon)*

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone or download project
cd old-school-rpg

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
old-school-rpg/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── HomePage.jsx          # Landing page with dragon cover
│   │   ├── character/                # (Phase 2)
│   │   ├── adventure/                # (Phase 3-4)
│   │   ├── combat/                   # (Phase 3-4)
│   │   ├── tools/                    # (Phase 2)
│   │   └── common/
│   │       ├── PaperContainer.jsx    # Paper texture wrapper
│   │       └── Button.jsx            # Styled button component
│   ├── contexts/                     # (Phase 2: Character, Adventure, Settings)
│   ├── hooks/                        # Custom React hooks
│   ├── utils/                        # Calculations, dice, storage
│   ├── data/                         # JSON rules data
│   ├── styles/
│   │   └── global.css                # Global styles & CSS variables
│   ├── assets/
│   │   └── images/
│   │       └── dragon-cover.png      # Red dragon cover art
│   ├── App.jsx                       # Main app with routing
│   └── main.jsx                      # React entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design System

### Color Palette
```css
--paper-cream: #f4f1e8    /* Primary background */
--paper-aged: #e8e3d3     /* Secondary background */
--ink-black: #1a1a1a      /* Primary text */
--ink-blue: #2c4a7c       /* Links, accents */
--ink-red: #8b2635        /* Danger, warnings */
--ink-brown: #4a3428      /* Secondary text */
```

### Typography
- **Body**: Courier Prime (monospace)
- **Headings**: Caveat (handwritten)
- **Numbers**: Special Elite (typewriter)
- **Flavor Text**: IM Fell English (serif)

### Components

#### PaperContainer
```jsx
<PaperContainer variant="cream" padding="md">
  Your content here
</PaperContainer>
```
- **Variants**: `cream`, `aged`, `graph`, `lined`
- **Padding**: `none`, `sm`, `md`, `lg`

#### Button
```jsx
<Button 
  variant="primary" 
  size="md" 
  icon={<Swords />}
  onClick={handleClick}
>
  Create Character
</Button>
```
- **Variants**: `primary`, `secondary`, `danger`, `ghost`
- **Sizes**: `sm`, `md`, `lg`

## 📖 Documentation

Complete architecture documentation:
1. **User Requirements** - Feature specifications
2. **System Design** - Game mechanics and rules
3. **Technical Architecture** - Component hierarchy, state management
4. **Adventure Engine Design** - Room system, combat, NPCs, narrative
5. **Gap Analysis** - Completeness validation

All docs located in `/docs` directory.

## 🗓️ Development Roadmap

### Phase 1: Foundation ✅ (Week 1)
- [x] Project setup
- [x] Base styling system
- [x] Home page with dragon cover
- [x] Common components
- [x] Routing

### Phase 2: Character System (Week 2)
- [ ] Ability score rolling (3d6)
- [ ] Class selection wizard (7 classes)
- [ ] Equipment packages
- [ ] Character sheet display
- [ ] Save/load character

### Phase 3: Tutorial Adventure (Weeks 3-4)
- [ ] Room system implementation
- [ ] Narration panel (collapsible)
- [ ] Combat system
- [ ] Tutorial adventure ("Your First Adventure")
- [ ] XP & treasure

### Phase 4: Main Adventure (Weeks 5-8)
- [ ] Full dungeon exploration
- [ ] NPC dialogue system (Aleena)
- [ ] Secret doors & traps
- [ ] Boss encounter (Bargle)
- [ ] Victory/defeat conditions

## 🎮 Features (Planned)

### Character Creation
- Roll 3d6 for 6 ability scores
- Choose from 7 classes: Cleric, Fighter, Magic-User, Thief, Dwarf, Elf, Halfling
- Select alignment (Lawful, Neutral, Chaotic)
- Equipment packages by class
- Auto-calculated HP, AC, THAC0

### Adventures
1. **Tutorial**: "Your First Adventure" (3 encounters, ~20 minutes)
2. **Main Quest**: "Bargle Wanted" (dungeon exploration, 1-2 hours)

### Combat System
- Turn-based with initiative rolls
- THAC0 attack resolution
- Saving throws (Poison, Wands, Paralysis, Breath, Spells)
- Monster AI with morale checks
- XP and treasure on victory

### Exploration
- Grid-based maps (graph paper aesthetic)
- Fog of war
- Room-by-room narration
- Secret doors (search mechanic)
- Traps and treasure

## 🔧 Technical Details

### Stack
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Styling**: CSS Modules + Custom Properties
- **Storage**: IndexedDB (idb-keyval) + localStorage fallback

### State Management
- React Context API for global state
- useReducer for complex flows
- Auto-save triggers on major events

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📦 Build Size
- Development: ~1.2 MB
- Production: ~180 KB (gzipped)

## 🤝 Contributing
This is a solo demonstration project, but feedback is welcome!

## 📜 License
Game mechanics based on the 1983 D&D Basic Rules by TSR, Inc.
This is a non-commercial fan project for educational purposes.

## 🙏 Credits
- Original game design: Gary Gygax & Dave Arneson
- Cover art inspiration: Larry Elmore (1983 red box)
- Rules: TSR Hobbies, Inc.

---

**Built with ❤️ for old-school RPG enthusiasts**
