import CountTickets from "@/components/Tickets/CountTickets";
import CountCustomers from "@/components/Customers/CountCustomers";
import SearchCustomers from "@/components/Customers/SearchCustomers";
import {useNavigate} from "react-router-dom";



const Dashboard = () => {

    const navigate = useNavigate();

    return (
<>
        <header className="flex flex-col items-start justify-center font-bold mb-10 text-3xl">
            Dashboard
        </header>
    <div className="relative mb-8 px-4"><SearchCustomers onSelect={(customer) => navigate(`/customers/${customer.id}`)} /> </div>
    <div className="flex">
        <div className="flex flex-col gap-6">
            <CountTickets />
        </div>
        <div>
            <CountCustomers />
        </div>
    </div>




</>
    )
};

export default Dashboard;