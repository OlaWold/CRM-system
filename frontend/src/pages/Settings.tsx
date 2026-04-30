import ThemeToggle from "@/components/ThemeToggle";

const Settings = () => {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-xl font-semibold">Innstillinger</h1>
                <p className="text-sm text-muted-foreground">Tilpass utseende og preferanser.</p>
            </header>

            <section className="rounded-md border bg-card">
                <h2 className="border-b px-4 py-3 text-sm font-medium">Utseende</h2>
                <div className="flex items-center justify-between px-4 py-3">
                    <div>
                        <p className="text-sm font-medium">Mørk modus</p>
                        <p className="text-sm text-muted-foreground">
                            Bytt mellom lys og mørk fargepalett.
                        </p>
                    </div>
                    <ThemeToggle />
                </div>
            </section>
        </div>
    );
};

export default Settings;
