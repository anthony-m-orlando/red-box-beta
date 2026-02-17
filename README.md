The Old School RPG Demo
A browser-based, single-player tribute to the 1980s era of tabletop gaming. This "analog-digital" experience recreates the feeling of solo D&D Basic gameplay using a tactile "folder" interface, authentic 1980s mechanics, and an offline-first architecture.

📜 Vision & Core Principles
The project evokes the physical artifacts of 80s tabletop gaming—character sheets, handwritten notes, and graph-paper dungeon maps—spread across a desk.

Solo Experience: Designed for a single player controlling one character through a guided adventure.

Analog Aesthetics: The UI uses a "folder" metaphor with tabbed documents representing physical game materials.

Faithful Mechanics: Strict adherence to 1980s Basic Rules for calculations, including THAC0 and saving throws.

Offline-First: Fully functional without an internet connection after the initial load.

🛠️ Tech Stack
Built with a modern frontend stack designed for performance, responsiveness, and zero-cost hosting.

Framework: React 18 with Vite for a lightning-fast build system.

State Management: React Context API for managing character and adventure states.

Routing: React Router 6 for navigating between the Home screen and the game interface.

Persistence: IndexedDB (via idb-keyval) with localStorage fallback for zero-server data saving.

Styling: CSS Modules with custom properties for an aged paper/graph paper aesthetic.

Icons: Lucide React for minimalist, role-playing themed iconography.

📂 Project Features
1. The Folder Interface
Character Sheet: Stats, abilities, and derived combat values.

Inventory: Weight-based encumbrance tracking in coins.

Journal: Auto-generated adventure logs and manual player notes.

Map: Grid-based exploration with Fog of War.

Reference: In-game monster manual and spell quick-reference.

2. Authentic 80s Mechanics
Character Creation: 3d6 ability score generation and class-based Hit Die rolls.

Combat System: Turn-based initiative (1d6), THAC0-based hit resolution, and automated saving throws.

Integrated Dice Roller: A persistent widget for manual d4 through d20 rolls.

🚀 Installation & Setup
Prerequisites
Node.js (v18.0.0 or higher)

npm or yarn

1. Clone the Repository
Bash
git clone https://github.com/your-username/old-school-rpg-demo.git
cd old-school-rpg-demo
2. Install Dependencies
Bash
npm install
3. Start Development Server
Bash
npm run dev
Navigate to http://localhost:5173 to view the app.

4. Build for Production
Bash
npm run build
The production-ready files will be located in the /dist folder, ready for static hosting (GitHub Pages, Netlify, etc.).

🗺️ Roadmap
Phase 1: Project scaffold, foundation styling, and Home Page.

Phase 2: Character creation system and persistence logic.

Phase 3: "Your First Adventure" (Tutorial) implementation.

Phase 4: Main adventure "Bargle Wanted" and combat AI refinement.

📝 License
This project is for educational and nostalgic purposes. "In Search of the Unknown" and associated rules are inspired by the 1980s Basic Set.
