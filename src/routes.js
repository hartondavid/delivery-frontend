import Login from "./views/Login.js";
import Dashboard from "./views/dashboard/Index.js";
import AddEditOrder from "./views/dashboard/AddEditOrder.js";
import Orders from "./views/dashboard/Orders.js";
import Deliveries from "./views/dashboard/Deliveries.js";
import AddRoute from "./views/dashboard/AddRoute.js";
import Routes from "./views/dashboard/Routes.js";
import Couriers from "./views/dashboard/Couriers.js";
import AddEditIssue from "./views/dashboard/AddEditIssue.js";
import Issues from "./views/dashboard/Issues.js";
import AddCourier from "./views/dashboard/AddCourier.js";
var routes = [
    {
        path: "/login",
        name: "Login",
        icon: "ni ni-key-25 text-info",
        component: <Login />,
        layout: "/auth",
    },

    {
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: Dashboard,
        layout: "/dashboard",
    },
    {
        path: "/addEditOrder/:orderId",
        name: "Add Order",
        icon: "ni ni-cart-simple text-primary",
        component: AddEditOrder,
        layout: "/dashboard",
    },
    {
        path: "/orders",
        name: "Orders",
        icon: "ni ni-cart-simple text-primary",
        component: Orders,
        layout: "/dashboard",
    },
    {
        path: "/deliveries",
        name: "Deliveries",
        icon: "ni ni-cart-simple text-primary",
        component: Deliveries,
        layout: "/dashboard",
    },
    {
        path: "/addRoute",
        name: "Add Route",
        icon: "ni ni-cart-simple text-primary",
        component: AddRoute,
        layout: "/dashboard",
    },
    {
        path: "/routes",
        name: "Routes",
        icon: "ni ni-cart-simple text-primary",
        component: Routes,
        layout: "/dashboard",
    },
    {
        path: "/couriers",
        name: "Couriers",
        icon: "ni ni-cart-simple text-primary",
        component: Couriers,
        layout: "/dashboard",
    },
    {
        path: "/addEditIssue/:issueId",
        name: "Add Issue",
        icon: "ni ni-cart-simple text-primary",
        component: AddEditIssue,
        layout: "/dashboard",
    },
    {
        path: "/issues",
        name: "Issues",
        icon: "ni ni-cart-simple text-primary",
        component: Issues,
        layout: "/dashboard",
    },
    {
        path: "/addCourier",
        name: "Add Courier",
        icon: "ni ni-cart-simple text-primary",
        component: AddCourier,
        layout: "/dashboard",
    },


]

export default routes;  