import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import SeoDefaults from "./components/seo/SeoDefaults";
import PublicOnly from "./routes/PublicOnly";

const Layout = lazy(() => import("./components/layout/Index"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center text-white/70">
        Loading…
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <SeoDefaults />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route
              path="/login"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnly>
                  <Register />
                </PublicOnly>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
