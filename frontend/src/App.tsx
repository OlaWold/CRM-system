
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import DashboardT from "./pages/DashboardT";
import CustomersT from "./pages/CustomersT";
import Activities from "./pages/Activities";
import Settings from "./pages/Settings";
import Tickets from "./pages/Tickets";
import DisplayTickets from "@/components/DisplayTicket";


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardT />} />
            <Route path="customers" element={<CustomersT />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="activities" element={<Activities />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/tickets/:ticketNo" element={<DisplayTickets />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;