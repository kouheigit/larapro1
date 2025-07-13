import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import HelloPage from "./pages/HelloPage";
import CountPages from "./pages/CountPages";
import TodoPage from "./pages/TodoPage";
import Timerpage from "./pages/Timerpage";
import Review from "./pages/review";

function App() {


  return (
        <BrowserRouter>
            <nav>
                <Link to="/hello">課題1Hello</Link> | <Link to="/count">課題2Count</Link>| <Link to="/todo">課題3Todo</Link>
            </nav>
            <nav>
                <Link to="/timer">課題4タイマー</Link>
            </nav>
            <nav><Link to="/review">復習課題1</Link></nav>
            <Routes>
                <Route path="/hello" element={<HelloPage />} />
                <Route path="/count" element={<CountPages />} />
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/timer" element={<Timerpage />} />
                <Route path="/Review" element={<Review />} />
            </Routes>
        </BrowserRouter>


  );
}

export default App
