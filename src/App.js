import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import EventPage from "./pages/events/EventPage";
import TaskPage from "./pages/tasks/TaskPage";
import Header from "./components/Header";
import Task from "./components/Task";
import Event from "./components/Event";
import LoginForm from "./pages/auth/LoginForm";
import { CurrentUserProvider } from "./contexts/UserContext";
import RegisterForm from "./pages/auth/RegisterForm";
import CreateTaskForm from "./pages/tasks/CreateTaskForm";
function App() {
  return (
    <CurrentUserProvider>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" exact element={<TaskPage />} />
            <Route path="/events" exact element={<EventPage />} />
            <Route path="/tasks/:taskId" element={<Task />} />
            <Route path="/events/:eventId" element={<Event />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/createTask" element={<CreateTaskForm />} />
          </Routes>
        </div>
      </Router>
    </CurrentUserProvider>
  );
}

export default App;
