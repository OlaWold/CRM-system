
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Activities from "./pages/Activities";
import Settings from "./pages/Settings";
import Tickets from "./pages/Tickets";
import DisplayTickets from "@/components/Tickets/DisplayTicket";
import DisplayCustomer from "@/components/Customers/DisplayCustomer";


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="activities" element={<Activities />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/tickets/:id" element={<DisplayTickets /> } />
            <Route path="/customers/:id" element={<DisplayCustomer /> } />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;