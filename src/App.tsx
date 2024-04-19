import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/react-router-v6"

import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";


import { authProvider } from "./providers/auth-provider";

import "./App.css";
import Register from "./pages/register";
import { Login } from "./pages/login";
import UserList from "./components/UserList";
import Header from "./components/navbar";
import DashBoard from "./components/sidebar";
import { dataProvider } from "./providers/data-provider"

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider}
          authProvider={authProvider}
          routerProvider={routerProvider}
          
        >

          <Routes >
            <Route element={
              <Authenticated key="authenticated-routes" redirectOnFail="/login">
                <Header />
                <DashBoard />
                <Outlet />
              </Authenticated>
            }>

              <Route index element={<Navigate to="/users" />} />
              <Route path="/users">
                <Route index element={<UserList/>}/>
                {/* <Route path="admin/register" element={<DashBoard/>}/> */}
              </Route>
              <Route path="/user" element={<UserList />} />
              <Route path="/dashboard" element={<DashBoard />} />
            </Route>
            <Route
              element={
                <Authenticated key="auth-pages" fallback={<Outlet />}>
                  {/* We're redirecting the user to `/` if they are authenticated and trying to access the `/login` route */}
                  <Navigate to="/" />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
