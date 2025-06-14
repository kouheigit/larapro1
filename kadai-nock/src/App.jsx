import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import HelloPage from "./pages/HelloPage";

function App() {


  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Navigate to="/hello" />} />
              <Route path="/hello" element={<HelloPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App
