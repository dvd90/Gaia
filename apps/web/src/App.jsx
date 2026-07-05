import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Info from "./pages/Info";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import ChallengeForm from "./pages/ChallengeForm";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import EventForm from "./pages/EventForm";
import MyEvents from "./pages/MyEvents";

const priv = element => <ProtectedRoute>{element}</ProtectedRoute>;

const App = () => (
  <AuthProvider>
    <ToastProvider>
      <ConfirmProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/info" element={<Info />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz_result" element={<QuizResult />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:id" element={priv(<ChallengeDetail />)} />
            <Route path="/create_challenge" element={priv(<ChallengeForm />)} />
            <Route path="/edit_challenge/:id" element={priv(<ChallengeForm />)} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={priv(<EventDetail />)} />
            <Route path="/create_event" element={priv(<EventForm />)} />
            <Route path="/edit_event/:id" element={priv(<EventForm />)} />
            <Route path="/my_events" element={priv(<MyEvents />)} />
            <Route path="/dashboard" element={priv(<Dashboard />)} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </ConfirmProvider>
    </ToastProvider>
  </AuthProvider>
);

export default App;
