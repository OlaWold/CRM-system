import CountTickets from "@/components/Tickets/CountTickets";
import CountCustomers from "@/components/Customers/CountCustomers";
import SearchCustomers from "@/components/Customers/SearchCustomers";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-slate-600">Oversikt over kunder og tickets.</p>
            </header>

            <div className="max-w-md">
                <SearchCustomers onSelect={(customer) => navigate(`/customers/${customer.id}`)} />
            </div>

            <CountTickets />
            <CountCustomers />
        </div>
    );
};

export default Dashboard;
