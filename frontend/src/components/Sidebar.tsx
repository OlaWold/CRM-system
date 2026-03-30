import { Link, useLocation } from "react-router-dom";
import "../index.css";

interface NavItem {
    label: string;
    path: string;
}

interface SidebarProps {
    onNavigate?: () => void;
}

const navItems: NavItem[] = [
    { label: "Dashboard", path: "/" },
    { label: "Kunder", path: "/customers" },
    { label: "Tickets", path: "/tickets" },
    { label: "Aktiviteter", path: "/activities" },
    { label: "Innstillinger", path: "/settings" },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="h-full px-3 py-4 text-xl">
            <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            onClick={onNavigate}
                            aria-current={isActive(item.path) ? "page" : undefined}
                            className={`block rounded-md px-4 py-2 text-center transition ${
                                isActive(item.path)
                                    ? "bg-slate-100 text-gray-500"
                                    : "hover:bg-slate-50 hover:text-grey-200"
                            }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
