import './App.css'
import MainRoute from "../src/routes/MainRoute.jsx";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainRoute />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;