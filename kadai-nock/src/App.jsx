import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import HelloPage from "./pages/HelloPage";
import CountPages from "./pages/CountPages";
import TodoPage from "./pages/TodoPage";

function App() {


  return (
        <BrowserRouter>
            <nav>
                <Link to="/hello">課題1Hello</Link> | <Link to="/count">課題2Count</Link>
            </nav>
            <Routes>
                <Route path="/hello" element={<HelloPage />} />
                <Route path="/count" element={<CountPages />} />
                <Route path="/count" element={<CountPages />} />
                <Route path="/count" element={<TodoPage />} />
            </Routes>
        </BrowserRouter>

  );
}

export default App
