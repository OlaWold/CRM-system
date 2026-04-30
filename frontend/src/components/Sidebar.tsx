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
    { label: "Kontakter", path: "/contacts" },
    { label: "Tickets", path: "/tickets" },
    { label: "Produkter", path: "/products" },
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
        <nav className="h-full px-2 py-3 text-sm">
            <ul className="flex flex-col gap-0.5">
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            onClick={onNavigate}
                            aria-current={isActive(item.path) ? "page" : undefined}
                            className={`block rounded-md px-3 py-2 transition ${
                                isActive(item.path)
                                    ? "bg-slate-100 font-medium text-slate-900"
                                    : "text-slate-700 hover:bg-slate-50"
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
