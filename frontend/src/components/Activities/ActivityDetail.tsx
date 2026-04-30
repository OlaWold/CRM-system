import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Activity,
    ActivityStatus,
    activityStatusLabels,
    activityTypeLabels,
} from "@/types/Activities";

type Props = {
    activity: Activity;
    onStatusChange: (status: ActivityStatus) => void;
    onDelete: () => void;
};

export default function ActivityDetail({ activity, onStatusChange, onDelete }: Props) {
    const start = new Date(activity.scheduledAt);
    const end = new Date(start.getTime() + activity.durationMinutes * 60000);

    return (
        <div className="space-y-4 p-4">
            <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                    {activityTypeLabels[activity.type]} · {activityStatusLabels[activity.status]}
                </p>
                <h2 className="text-base font-semibold break-words">{activity.title}</h2>
                <p className="text-sm text-slate-600">
                    {start.toLocaleString("no-NO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {end.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>

            {activity.description && (
                <p className="whitespace-pre-wrap break-words text-sm">{activity.description}</p>
            )}

            <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
                <dt className="text-slate-600">Kunde</dt>
                <dd>
                    {activity.customer ? (
                        <Link
                            to={`/customers/${activity.customer.id}`}
                            className="text-slate-900 underline-offset-2 hover:underline"
                        >
                            {activity.customer.companyName}
                        </Link>
                    ) : (
                        "—"
                    )}
                </dd>
                {activity.contact && (
                    <>
                        <dt className="text-slate-600">Kontakt</dt>
                        <dd>{activity.contact.firstName} {activity.contact.lastName}</dd>
                    </>
                )}
            </dl>

            <div>
                <p className="mb-2 text-sm font-medium">Endre status</p>
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(activityStatusLabels) as ActivityStatus[]).map((status) => (
                        <Button
                            key={status}
                            size="sm"
                            variant={activity.status === status ? "default" : "outline"}
                            onClick={() => onStatusChange(status)}
                        >
                            {activityStatusLabels[status]}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end border-t pt-3">
                <Button size="sm" variant="outline" onClick={onDelete}>
                    Slett avtale
                </Button>
            </div>
        </div>
    );
}
