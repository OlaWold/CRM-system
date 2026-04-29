import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Counts = {
    allOpen: number | null;
    open: number | null;
    waiting: number | null;
    inProgress: number | null;
    prevDays: number | null;
    closedLastThirty: number | null;
};

const initialCounts: Counts = {
    allOpen: null,
    open: null,
    waiting: null,
    inProgress: null,
    prevDays: null,
    closedLastThirty: null,
};

export default function CountTickets() {
    const [counts, setCounts] = useState<Counts>(initialCounts);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadCounts() {
            try {
                const [allOpen, open, waiting, inProgress, prevDays, closedLastThirty] = await Promise.all([
                    fetch("http://localhost:8080/api/v1/tickets/count/not-closed"),
                    fetch("http://localhost:8080/api/v1/tickets/count?status=OPEN"),
                    fetch("http://localhost:8080/api/v1/tickets/count?status=WAITING"),
                    fetch("http://localhost:8080/api/v1/tickets/count?status=IN_PROGRESS"),
                    fetch("http://localhost:8080/api/v1/tickets/previous-30-days"),
                    fetch("http://localhost:8080/api/v1/tickets/previous-30-days/closed"),
                ]);

                if (
                    !allOpen.ok || !open.ok || !waiting.ok ||
                    !inProgress.ok || !prevDays.ok || !closedLastThirty.ok
                ) {
                    throw new Error("Could not fetch counts");
                }

                setCounts({
                    allOpen: await allOpen.json(),
                    open: await open.json(),
                    waiting: await waiting.json(),
                    inProgress: await inProgress.json(),
                    prevDays: await prevDays.json(),
                    closedLastThirty: await closedLastThirty.json(),
                });
            } catch (error) {
                console.error(error);
            }
        }
        loadCounts();
    }, []);

    const stats: { label: string; value: number | null }[] = [
        { label: "Åpne tickets totalt", value: counts.allOpen },
        { label: "Status: Åpen", value: counts.open },
        { label: "Status: Venter", value: counts.waiting },
        { label: "Status: Pågår", value: counts.inProgress },
        { label: "Nye siste 30 dager", value: counts.prevDays },
        { label: "Lukket siste 30 dager", value: counts.closedLastThirty },
    ];

    return (
        <>
            {stats.map((stat) => (
                <div key={stat.label} className="rounded-md border bg-white p-4">
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold">{stat.value ?? "—"}</p>
                </div>
            ))}
            <div className="md:col-span-2 lg:col-span-4">
                <Button variant="outline" onClick={() => navigate("/tickets")}>
                    Gå til Tickets
                </Button>
            </div>
        </>
    );
}
