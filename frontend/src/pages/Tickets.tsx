import { GetTickets } from "@/components/Tickets/GetTickets";

export default function Tickets() {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Ticketliste</h1>
                <p className="text-sm text-slate-600">Oversikt over alle tickets.</p>
            </header>
            <GetTickets />
        </div>
    );
}
