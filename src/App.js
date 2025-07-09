import React, { useEffect } from 'react'; // Import useEffect
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation, useNavigate
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import useAuth
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
import CompleteProfilePage from './pages/CompleteProfilePage'; // Import CompleteProfilePage

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

// Component to handle redirection logic
const ProfileCompletionRedirect = () => {
  const { isAuthenticated, user, isProfileComplete, loading, isFetchingUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait for auth loading and user fetching to complete before making decisions
    if (loading || isFetchingUser) {
      return;
    }

    if (isAuthenticated && user && !isProfileComplete) {
      // Allow access to complete-profile, login, and register pages without redirecting
      if (location.pathname !== '/complete-profile' && location.pathname !== '/login' && location.pathname !== '/register') {
        console.log('Redirecting to /complete-profile. isProfileComplete:', isProfileComplete, 'User:', user);
        navigate('/complete-profile', { replace: true });
      }
    }
  }, [isAuthenticated, user, isProfileComplete, loading, isFetchingUser, navigate, location.pathname]);

  return null; // This component does not render anything itself
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileCompletionRedirect /> {/* Add the redirect handler component here */}
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
          <Header />
          <main className="flex-grow container mx-auto px-6 py-12">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/complete-profile" element={<CompleteProfilePage />} /> {/* Add route for complete profile */}
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
