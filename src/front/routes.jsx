import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Professional } from "./pages/Professional";
import { Login } from "./pages/Login";
import Signin from "./pages/Signin";
import { PrivateRoute } from "./components/PrivateRoute";
import { AdminRoute } from "./components/AdminRoute";
import { ShowClients } from "./pages/ShowClients";
import { ResetPass } from "./pages/ResetPass";
import { TokenReset } from "./components/TokenReset";
import { AppointmentsView } from "./pages/AppointmentsView";
import { AdminUsersView } from "./pages/AdminUsersView";

// <-- NUEVO: Importamos la vista del Dashboard Principal de Admin
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/professional" element={<PrivateRoute><Professional /></PrivateRoute>} />
      <Route path="/appointments" element={<PrivateRoute><AppointmentsView /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/show-clients" element={<PrivateRoute><ShowClients /></PrivateRoute>} />
      <Route path="/reset-pass" element={<TokenReset><ResetPass /></TokenReset>} />

      {/* --- RUTAS PROTEGIDAS DE ADMINISTRACIÓN (DUEÑOS) --- */}

      {/* 1. Dashboard Principal (NUEVO) */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* 2. Gestión de Usuarios */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersView />
          </AdminRoute>
        }
      />
    </Route>
  )
)