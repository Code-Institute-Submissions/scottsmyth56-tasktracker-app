import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import EventPage from './pages/EventPage';
import TaskPage from './pages/TaskPage';

function App() {
  return (
   <Router>
    <Routes>
      <Route path="/tasks" exact element={<TaskPage />} />
      <Route path="/events" exact element={<EventPage />} />
    </Routes>
 </Router>
  );
}

export default App;
