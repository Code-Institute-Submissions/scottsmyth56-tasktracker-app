import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import EventPage from './pages/EventPage';
import TaskPage from './pages/TaskPage';
import Header from './components/Header';
import Task from './components/Task';
import Event from './components/Event';

function App() {
  return (
 
   <Router>
    <div>
      <Header />
    <Routes>
      <Route path="/" exact element={<TaskPage />} />
      <Route path="/events" exact element={<EventPage />} />
      <Route path="/tasks/:taskId" element={<Task />} />
      <Route path="/events/:eventId" element={<Event />} />

    </Routes>
    </div>
 </Router>
  );
}

export default App;
