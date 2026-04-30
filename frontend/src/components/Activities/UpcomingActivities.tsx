import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, activityTypeColor, activityTypeLabels } from "@/types/Activities";

type Props = {
    limit?: number;
};

export default function UpcomingActivities({ limit = 5 }: Props) {
    const [upcoming, setUpcoming] = useState<Activity[] | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/activities/upcoming");
                if (!res.ok) throw new Error("Failed to load upcoming activities");
                setUpcoming(await res.json());
            } catch (error) {
                console.error(error);
                setUpcoming([]);
            }
        }
        load();
    }, []);

    const items = (upcoming ?? []).slice(0, limit);

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Kommende avtaler</h2>
                <Button variant="outline" size="sm" onClick={() => navigate("/activities")}>
                    Se alle
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                {upcoming === null ? (
                    <p className="px-3 py-3 text-sm text-muted-foreground">Laster...</p>
                ) : items.length === 0 ? (
                    <p className="px-3 py-3 text-sm text-muted-foreground">Ingen planlagte avtaler.</p>
                ) : (
                    <ul className="divide-y">
                        {items.map((a) => (
                            <li key={a.id}>
                                <button
                                    type="button"
                                    onClick={() => navigate("/activities")}
                                    className="flex w-full flex-col gap-1 px-3 py-2 text-left text-sm hover:bg-accent sm:flex-row sm:items-center sm:gap-4"
                                >
                                    <span className="w-40 shrink-0 text-muted-foreground">
                                        {new Date(a.scheduledAt).toLocaleString("no-NO", {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <span
                                        className={`inline-block w-fit rounded px-1.5 py-0.5 text-xs ${activityTypeColor[a.type]}`}
                                    >
                                        {activityTypeLabels[a.type]}
                                    </span>
                                    <span className="min-w-0 flex-1 truncate font-medium">{a.title}</span>
                                    <span className="text-muted-foreground">{a.customer?.companyName ?? "—"}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
