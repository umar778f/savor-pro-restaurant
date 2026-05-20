import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { POSProvider } from "./context/POSContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import History from "./pages/History";

export default function App() {
  return (
    <ThemeProvider>
      <POSProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="pos" element={<POS />} />
              <Route path="history" element={<History />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </POSProvider>
    </ThemeProvider>
  );
}
