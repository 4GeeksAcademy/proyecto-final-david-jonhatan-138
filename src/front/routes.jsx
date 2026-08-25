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
import { AdminRoute } from "./components/AdminRoute"; // <-- 1. Importamos el protector de admin
import { ShowClients } from "./pages/ShowClients";
import { ResetPass } from "./pages/ResetPass";
import { TokenReset } from "./components/TokenReset";
import { AppointmentsView } from "./pages/AppointmentsView";
import { AdminUsersView } from "./pages/AdminUsersView"; // <-- 2. Importamos la vista del panel admin

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

      {/* --- 3. AÑADIMOS LA RUTA PROTEGIDA DE ADMINISTRACIÓN --- */}
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