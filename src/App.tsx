
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contacts from "./pages/Contacts";
import Campaigns from "./pages/Campaigns";
import SimplifiedCampaigns from "./pages/SimplifiedCampaigns";
import { AppProvider } from "./contexts";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/simplified-campaigns" element={<SimplifiedCampaigns />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AppProvider>
  );
}

export default App;
