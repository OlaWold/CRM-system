import { Outlet } from "react-router-dom";
import '../index.css';
import Sidebar from "../components/Sidebar";

export default function MainLayout() {


    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-6 h-full overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}