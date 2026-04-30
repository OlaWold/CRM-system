import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import "../index.css";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="relative h-screen overflow-hidden bg-background text-foreground">
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-56 border-r bg-card transition-transform duration-200 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <span className="text-base font-semibold">CRM-System</span>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="rounded-md p-1.5 transition hover:bg-accent"
                        aria-label="Lukk meny"
                    >
                        <X size={18} />
                    </button>
                </div>

                <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
            </aside>

            {isSidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-black/30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Lukk meny"
                />
            )}

            <div
                className={`flex h-full flex-col transition-[padding-left] duration-200 ease-in-out ${
                    isSidebarOpen ? "md:pl-56" : "md:pl-0"
                }`}
            >
                <header className="flex items-center gap-3 border-b bg-card px-4 py-2.5">
                    {!isSidebarOpen && (
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="rounded-md p-1.5 transition hover:bg-accent"
                            aria-label="Åpne meny"
                        >
                            <Menu size={20} />
                        </button>
                    )}
                    <span className="text-base font-semibold">CRM-System</span>
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
