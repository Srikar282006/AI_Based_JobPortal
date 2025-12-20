import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Register from "./components/Register.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import Editjob from "./components/Editjob.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DetailPage from "./pages/DetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RecommemderPage from "./pages/RecommemderPage.jsx";
import EditPage from "./pages/EditPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/jobspost" element={<ProtectedRoute><JobsPage/></ProtectedRoute>}/>
          <Route path="/job/edit/:id" element={<ProtectedRoute><EditPage/></ProtectedRoute>}/>
          <Route path="/details/:jobid" element={<ProtectedRoute><DetailPage/></ProtectedRoute>}/>
          <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
          <Route path="/recommend/:jobId" element={<ProtectedRoute><RecommemderPage/></ProtectedRoute>}/>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
