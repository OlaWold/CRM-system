import CountTickets from "@/components/Tickets/CountTickets";
import WeeklyTicketChart from "@/components/Tickets/WeeklyTicketChart";
import CountCustomers from "@/components/Customers/CountCustomers";
import SearchCustomers from "@/components/Customers/SearchCustomers";
import UpcomingActivities from "@/components/Activities/UpcomingActivities";
import ActivityFeed from "@/components/Activities/ActivityFeed";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Oversikt over kunder og tickets.
        </p>
      </header>

      <div className="max-w-md">
        <SearchCustomers
          onSelect={(customer) => navigate(`/customers/${customer.id}`)}
        />
      </div>

      <UpcomingActivities limit={5} />
      <CountTickets />
      <ActivityFeed />
      <CountCustomers />
      <WeeklyTicketChart />
    </div>
  );
};

export default Dashboard;
