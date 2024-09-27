import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import FormOffer from "./components/FormOffer";
import OfferList from "./components/OfferList";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import Candidates from "./components/Candidates";
import ProfileReclutier from "./components/ProfileReclutier";
import Chats from "./components/Chats";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <OfferList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-offer"
            element={
              <ProtectedRoute>
                <FormOffer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <Candidates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<OfferList />} />
          <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileReclutier/>
          </ProtectedRoute>
          
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
