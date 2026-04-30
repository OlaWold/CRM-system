import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Contacts from "./pages/Contacts";
import Activities from "./pages/Activities";
import Settings from "./pages/Settings";
import Tickets from "./pages/Tickets";
import Incoming from "./pages/Incoming";
import Products from "./pages/Products";
import DisplayTickets from "@/components/Tickets/DisplayTicket";
import DisplayCustomer from "@/components/Customers/DisplayCustomer";
import DisplayContact from "@/components/Contacts/DisplayContact";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="customers/:id" element={<DisplayCustomer />} />
                    <Route path="contacts" element={<Contacts />} />
                    <Route path="contacts/:id" element={<DisplayContact />} />
                    <Route path="tickets" element={<Tickets />} />
                    <Route path="tickets/:id" element={<DisplayTickets />} />
                    <Route path="incoming" element={<Incoming />} />
                    <Route path="products" element={<Products />} />
                    <Route path="activities" element={<Activities />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
