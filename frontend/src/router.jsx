import {createBrowserRouter, RouterProvider} from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forest from "./pages/Forest";
import ForestSession from "./pages/ForestSession";
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
            },
            {
                path : ":sessionId",
                Component : ForestSession
            }
        ]
    }
])

export default router;