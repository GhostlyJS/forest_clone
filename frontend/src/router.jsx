import {createBrowserRouter, RouterProvider} from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forest from "./pages/Forest";
import Template from "./Outlet";

let router = createBrowserRouter([
    {
        path : "/register",
        Component : Register
    },
    {
        path : "/login",
        Component : Login
    },
    {
        path : "/forest",
        Component : Template,
        children : [
            {
                path : "",
                Component : Forest
            }
        ]
    }
])

export default router;