import { Outlet } from "react-router";

export default function Template() {
    return (
        <div className="flex w-screen bg-gray-50 dark:bg-gray-900">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forest</h1>
            <Outlet />
        </div>
    );
}