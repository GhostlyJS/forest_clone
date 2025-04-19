import { Outlet } from "react-router";

export default function Template() {
    return (
        <div className="flex w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Outlet />
        </div>
    );
}