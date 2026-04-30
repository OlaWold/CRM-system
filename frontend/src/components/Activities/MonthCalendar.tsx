import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity, activityTypeColor } from "@/types/Activities";

const WEEKDAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

type Props = {
    monthAnchor: Date;
    activities: Activity[];
    onChangeMonth: (next: Date) => void;
    onSelectActivity: (activity: Activity) => void;
    onSelectDate: (date: Date) => void;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const dayKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

export default function MonthCalendar({
    monthAnchor,
    activities,
    onChangeMonth,
    onSelectActivity,
    onSelectDate,
}: Props) {
    const first = startOfMonth(monthAnchor);

    const offset = (first.getDay() + 6) % 7;
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - offset);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);
        days.push(d);
    }

    const byDay = new Map<string, Activity[]>();
    for (const a of activities) {
        const key = dayKey(new Date(a.scheduledAt));
        const list = byDay.get(key) ?? [];
        list.push(a);
        byDay.set(key, list);
    }

    const goToMonth = (delta: number) => {
        const next = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + delta, 1);
        onChangeMonth(next);
    };

    const today = new Date();
    const monthLabel = monthAnchor.toLocaleString("no-NO", { month: "long", year: "numeric" });

    return (
        <div className="rounded-md border bg-card">
            <div className="flex items-center justify-between border-b px-3 py-2">
                <h2 className="text-base font-semibold capitalize">{monthLabel}</h2>
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => onChangeMonth(new Date())}>
                        I dag
                    </Button>
                    <Button variant="outline" size="icon-sm" aria-label="Forrige måned" onClick={() => goToMonth(-1)}>
                        <ChevronLeft />
                    </Button>
                    <Button variant="outline" size="icon-sm" aria-label="Neste måned" onClick={() => goToMonth(1)}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b text-xs font-medium text-muted-foreground">
                {WEEKDAYS.map((d) => (
                    <div key={d} className="px-2 py-1.5 text-center">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {days.map((day, idx) => {
                    const inMonth = day.getMonth() === monthAnchor.getMonth();
                    const isToday = isSameDay(day, today);
                    const dayActivities = byDay.get(dayKey(day)) ?? [];

                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => onSelectDate(day)}
                            className={`flex min-h-24 flex-col gap-1 border-b border-r p-1.5 text-left text-xs transition hover:bg-accent ${
                                idx % 7 === 6 ? "border-r-0" : ""
                            } ${idx >= 35 ? "border-b-0" : ""} ${
                                inMonth ? "bg-card" : "bg-muted/40 text-muted-foreground/60"
                            }`}
                        >
                            <span
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                                    isToday ? "bg-primary text-primary-foreground" : ""
                                }`}
                            >
                                {day.getDate()}
                            </span>
                            <div className="flex flex-col gap-0.5">
                                {dayActivities.slice(0, 3).map((a) => (
                                    <span
                                        key={a.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectActivity(a);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onSelectActivity(a);
                                            }
                                        }}
                                        className={`truncate rounded px-1.5 py-0.5 text-left text-[11px] ${
                                            activityTypeColor[a.type]
                                        } ${a.status !== "PLANNED" ? "opacity-60 line-through" : ""}`}
                                    >
                                        {new Date(a.scheduledAt).toLocaleTimeString("no-NO", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}{" "}
                                        {a.title}
                                    </span>
                                ))}
                                {dayActivities.length > 3 && (
                                    <span className="text-[11px] text-muted-foreground">
                                        +{dayActivities.length - 3} til
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
