import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Paises from "../pages/Paises/Paises.vue";
import EdicionPaises from "../pages/Paises/EdicionPaises.vue";

import Estados from "../pages/Estados/Estados.vue";
import EdicionEstados from "../pages/Estados/EdicionEstados.vue";

import Typography from "@/pages/Typography.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Notifications from "@/pages/Notifications.vue";
import UpgradeToPRO from "@/pages/UpgradeToPRO.vue";
import SignIn from '../pages/SignIn.vue'

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { auth: false }
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile,
        meta: { auth: true }
      },
      {
        path: "table",
        name: "Table List",
        component: TableList,
        meta: { auth: true }
      },
      {
        path: "paises",
        name: "Paises",
        component: Paises,
        meta: { auth: true }
      },
      {
        path: "paises/:id",
        name: "Edicion de Pais",
        component: EdicionPaises,
        meta: { auth: true }
      },
      {
        path: "estados",
        name: "Estados",
        component: Estados,
        meta: { auth: true }
      },
      {
        path: "estados/:paisid/:id",
        name: "Edición de Estado",
        component: EdicionEstados,
        meta: { auth: true }
      },
      {
        path: "typography",
        name: "Typography",
        component: Typography,
        meta: { auth: true }
      },
      {
        path: "icons",
        name: "Icons",
        component: Icons,
        meta: { auth: true }
      },
      {
        path: "maps",
        name: "Maps",
        meta: {
          hideFooter: true
        },
        component: Maps
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
        meta: { auth: true }
      },
      {
        path: "upgrade",
        name: "Upgrade to PRO",
        component: UpgradeToPRO,
        meta: { auth: true }
      }
    ]
  },
  {
    path: "/signin",
    component : SignIn,
    meta: { auth: false }
  }
];

export default routes;
