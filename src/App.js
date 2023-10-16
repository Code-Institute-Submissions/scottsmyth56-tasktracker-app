import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import EventPage from './pages/events/EventPage';
import TaskPage from './pages/events/TaskPage';
import Header from './components/Header';
import Task from './components/Task';
import Event from './components/Event';
import LoginForm from './pages/auth/LoginForm';


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
      <Route path='/login' element={<LoginForm />} />

    </Routes>
    </div>
 </Router>
  );
}

export default App;
