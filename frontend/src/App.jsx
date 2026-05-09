import './App.css'
import MainRoute from "../src/routes/MainRoute.jsx";
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <MainRoute />
    </BrowserRouter>
  );
}

export default App;