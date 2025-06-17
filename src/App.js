import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import PersonalAccount from './pages/PersonalAccount';
import ModulesHub from './pages/ModulesHub';
import GamesHub from './pages/GamesHub';

// Feature Components (Modules)
import CulturalProverbsModule from './features/modules/CulturalProverbsModule';
import DebatingModule from './features/modules/DebatingModule';
import FactOpinionModule from './features/modules/FactOpinionModule';
import FakeNewsAnalysisModule from './features/modules/FakeNewsAnalysisModule';
import EthicalDilemmasModule from './features/modules/EthicalDilemmasModule';

// Feature Components (Games)
import FactOrFakeGame from './features/games/FactOrFakeGame';
import FindBiasGame from './features/games/FindBiasGame';
import MoralCompassGame from './features/games/MoralCompassGame';
import EmojiDebateGame from './features/games/EmojiDebateGame';
import DebateAi from './features/games/DebateAi';
import MisinformationMazeGame from './features/games/MisinformationMazeGame'; // <-- 1. IMPORT new game
import LogicalFallacyHuntGame from './features/games/LogicalFallacyHuntGame'; // <-- 1. IMPORT new game
import PropagandaDetectorGame from './features/games/PropagandaDetectorGame'; // <-- 1. IMPORT new game
import LeaderSimulationGame from './features/games/LeaderSimulationGame'; // <-- 1. IMPORT final game




// --- Other Page Placeholders ---
const NotFound = () => <div className="text-center"><h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p></div>;
// --- End of Placeholders ---


/**
 * The main App component.
 * It sets up the application's layout and routing.
 */
function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
        <Header />
        <main className="flex-grow container mx-auto px-6 py-12">
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<PersonalAccount />} />
            <Route path="/modules" element={<ModulesHub />} />
            <Route path="/games" element={<GamesHub />} />

            {/* Module Pages */}
            <Route path="/modules/cultural-proverbs" element={<CulturalProverbsModule />} />
            <Route path="/modules/debating" element={<DebatingModule />} />
            <Route path="/modules/fact-opinion" element={<FactOpinionModule />} />
            <Route path="/modules/fake-news-analysis" element={<FakeNewsAnalysisModule />} />
            <Route path="/modules/ethical-dilemmas" element={<EthicalDilemmasModule />} />
            
            {/* Game Pages */}
            <Route path="/games/fact-or-fake" element={<FactOrFakeGame />} />
            <Route path="/games/find-bias" element={<FindBiasGame />} />
            <Route path="/games/moral-compass" element={<MoralCompassGame />} />
            <Route path="/games/emoji-debate" element={<EmojiDebateGame />} />
            <Route path="/games/debate-ai" element={<DebateAi />} />
            <Route path="/games/misinformation-maze" element={<MisinformationMazeGame />} /> {/* <-- 2. ADD new game route */}
            <Route path="/games/logical-fallacy-hunt" element={<LogicalFallacyHuntGame />} /> {/* <-- 2. ADD new game route */}
            <Route path="/games/propaganda-detector" element={<PropagandaDetectorGame />} /> {/* <-- 2. ADD new game route */}
            <Route path="/games/leader-simulation" element={<LeaderSimulationGame />} /> {/* <-- 2. ADD final game route */}


            {/* Fallback for non-existent routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
