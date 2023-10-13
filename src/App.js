import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import EventPage from './pages/EventPage';
import TaskPage from './pages/TaskPage';
import Header from './components/Header';

function App() {
  return (
 
   <Router>
    <div>
      <Header />
    <Routes>
      <Route path="/" exact element={<TaskPage />} />
      <Route path="/events" exact element={<EventPage />} />
    </Routes>
    </div>
 </Router>
  );
}

export default App;
