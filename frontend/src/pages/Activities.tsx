import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateActivity } from "@/components/Activities/CreateActivity";
import MonthCalendar from "@/components/Activities/MonthCalendar";
import ActivityDetail from "@/components/Activities/ActivityDetail";
import {
    Activity,
    ActivityStatus,
    activityStatusLabels,
    activityTypeColor,
    activityTypeLabels,
} from "@/types/Activities";

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const calendarGridRange = (monthAnchor: Date) => {
    const first = startOfMonth(monthAnchor);
    const offset = (first.getDay() + 6) % 7;
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - offset);
    const gridEnd = new Date(gridStart);
    gridEnd.setDate(gridStart.getDate() + 42);
    return { gridStart, gridEnd };
};

export default function Activities() {
    const [monthAnchor, setMonthAnchor] = useState(() => startOfMonth(new Date()));
    const [activities, setActivities] = useState<Activity[]>([]);
    const [upcoming, setUpcoming] = useState<Activity[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formDate, setFormDate] = useState<Date | undefined>(undefined);
    const [selected, setSelected] = useState<Activity | null>(null);

    const loadMonth = useCallback(async () => {
        const { gridStart, gridEnd } = calendarGridRange(monthAnchor);

        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/activities/range?from=${encodeURIComponent(
                    gridStart.toISOString()
                )}&to=${encodeURIComponent(gridEnd.toISOString())}`
            );
            if (!res.ok) throw new Error("Failed to load month activities");
            setActivities(await res.json());
        } catch (error) {
            console.error(error);
        }

        try {
            const res = await fetch("http://localhost:8080/api/v1/activities/upcoming");
            if (!res.ok) throw new Error("Failed to load upcoming activities");
            setUpcoming(await res.json());
        } catch (error) {
            console.error(error);
        }
    }, [monthAnchor]);

    useEffect(() => {
        loadMonth();
    }, [loadMonth]);

    async function changeStatus(id: number, status: ActivityStatus) {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/activities/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            const updated: Activity = await res.json();
            setSelected(updated);
            loadMonth();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteActivity(id: number) {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/activities/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");
            setSelected(null);
            loadMonth();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-4">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Aktiviteter</h1>
                    <p className="text-sm text-muted-foreground">Avtaler og oppfølginger med kunder.</p>
                </div>
                <Button
                    type="button"
                    onClick={() => {
                        setFormDate(undefined);
                        setShowForm(true);
                    }}
                >
                    Ny avtale
                </Button>
            </header>

            <MonthCalendar
                monthAnchor={monthAnchor}
                activities={activities}
                onChangeMonth={(d) => setMonthAnchor(startOfMonth(d))}
                onSelectActivity={(a) => setSelected(a)}
                onSelectDate={(d) => {
                    setFormDate(d);
                    setShowForm(true);
                }}
            />

            <section className="rounded-md border bg-card">
                <h2 className="border-b px-3 py-2 text-sm font-medium">Kommende avtaler</h2>
                {upcoming.length === 0 ? (
                    <p className="px-3 py-3 text-sm text-muted-foreground">Ingen planlagte avtaler.</p>
                ) : (
                    <ul className="divide-y">
                        {upcoming.map((a) => (
                            <li key={a.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelected(a)}
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
                                    <span className="text-muted-foreground">
                                        {a.customer?.companyName ?? "—"}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md border bg-card">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">Ny avtale</h2>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-md p-1.5 hover:bg-accent"
                                aria-label="Lukk"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <CreateActivity
                            defaultDate={formDate}
                            onSuccess={() => {
                                setShowForm(false);
                                loadMonth();
                            }}
                        />
                    </div>
                </div>
            )}

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md border bg-card">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-base font-semibold">
                                Avtale #{selected.activityNo} · {activityStatusLabels[selected.status]}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="rounded-md p-1.5 hover:bg-accent"
                                aria-label="Lukk"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <ActivityDetail
                            activity={selected}
                            onStatusChange={(status) => changeStatus(selected.id, status)}
                            onDelete={() => deleteActivity(selected.id)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
