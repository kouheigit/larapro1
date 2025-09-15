import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import HelloPage from "./pages/HelloPage";
import CountPages from "./pages/CountPages";
import TodoPage from "./pages/TodoPage";
import Timerpage from "./pages/Timerpage";
import Review from "./pages/review";
import Review1 from "./components/review1";
import Profilecard from "./components/Profilecard";
import Pokemon from "./components/Pokemon";
import Pokemon1 from "./components/Pokemon1";
import Pokemon3 from "./components/Pokemon3";
import Todo1 from "./components/Todo1.jsx";
import Osero from "./components/Osero.jsx";


function App() {


  return (
        <BrowserRouter>
            <nav>
                <Link to="/hello">課題1Hello</Link> | <Link to="/count">課題2Count</Link>| <Link to="/todo">課題3Todo</Link>
            </nav>
            <nav>
                <Link to="/timer">課題4タイマー</Link><Link to="/Profilecard">課題5プロフィールカード</Link>
            </nav>
            <nav><Link to="/review">復習課題1</Link><Link to="/review">復習課題2</Link><Link to="/Pokemon3">ポケモン3</Link></nav>
            <nav><Link to="/Pokemon">ポケモン</Link><Link to="/Pokemon1">ポケモン1</Link><Link to="/Todo1">Todo1</Link><Link to="/Osero">オセロ</Link></nav>
            <Routes>
                <Route path="/hello" element={<HelloPage />} />
                <Route path="/count" element={<CountPages />} />
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/timer" element={<Timerpage />} />
                <Route path="/Review" element={<Review />} />
                <Route path="/Review" element={<Review1 />} />
                <Route path="/Profilecard" element={<Profilecard />} />
                <Route path="/Pokemon" element={<Pokemon />} />
                <Route path="/Pokemon1" element={<Pokemon1 />} />
                <Route path="/Pokemon3" element={<Pokemon3 />} />
                <Route path="/Todo1" element={<Todo1 />} />
                <Route path="/Osero" element={<Osero />} />
            </Routes>
        </BrowserRouter>


  );
}

export default App
