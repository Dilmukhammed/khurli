import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Import ProtectedRoute

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
import LibraryPage from './pages/LibraryPage'; // Import the new LibraryPage component
import ContactPage from './pages/ContactPage'; // Import the ContactPage component

// ... (other imports for modules and games remain the same) ...
import CulturalProverbsModule from './features/modules/CulturalProverbsModule';
import DebatingModule from './features/modules/DebatingModule';
import FactOpinionModule from './features/modules/FactOpinionModule';
import FakeNewsAnalysisModule from './features/modules/FakeNewsAnalysisModule';
import EthicalDilemmasModule from './features/modules/EthicalDilemmasModule';

import FactOrFakeGame from './features/games/FactOrFakeGame';
import FindBiasGame from './features/games/FindBiasGame';
import MoralCompassGame from './features/games/MoralCompassGame';
import EmojiDebateGame from './features/games/EmojiDebateGame';
import DebateAi from './features/games/DebateAi';
import MisinformationMazeGame from './features/games/MisinformationMazeGame';
import LogicalFallacyHuntGame from './features/games/LogicalFallacyHuntGame';
import PropagandaDetectorGame from './features/games/PropagandaDetectorGame';
import LeaderSimulationGame from './features/games/LeaderSimulationGame';


const NotFound = () => <div className="text-center"><h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p></div>;


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
          <Header />
          <main className="flex-grow container mx-auto px-6 py-12">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <PersonalAccount />
                  </ProtectedRoute>
                }
              />
              <Route path="/modules" element={<ModulesHub />} />
              <Route path="/games" element={<GamesHub />} />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <LibraryPage />
                  </ProtectedRoute>
                }
              />

              {/* Module Pages */}
              <Route path="/modules/cultural-proverbs" element={<CulturalProverbsModule />} />
              <Route path="/modules/debating" element={<DebatingModule />} />
              <Route path="/modules/fact-opinion" element={<FactOpinionModule />} />
              <Route path="/modules/fake-news" element={<FakeNewsAnalysisModule />} />
              <Route path="/modules/ethical-dilemmas" element={<EthicalDilemmasModule />} />

              {/* Game Pages */}
              <Route path="/games/fact-or-fake" element={<FactOrFakeGame />} />
              <Route path="/games/find-bias" element={<FindBiasGame />} />
              <Route path="/games/moral-compass" element={<MoralCompassGame />} />
              <Route path="/games/emoji-debate" element={<EmojiDebateGame />} />
              <Route path="/games/debate-ai" element={<DebateAi />} />
              <Route path="/games/misinformation-maze" element={<MisinformationMazeGame />} />
              <Route path="/games/logical-fallacy-hunt" element={<LogicalFallacyHuntGame />} />
              <Route path="/games/propaganda-detector" element={<PropagandaDetectorGame />} />
              <Route path="/games/leader-simulation" element={<LeaderSimulationGame />} />

              {/* Contact Page Route */}
              <Route path="/contact" element={<ContactPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
