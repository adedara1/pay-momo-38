import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Settings from "@/pages/Settings";
import Configuration from "@/pages/Configuration";
import Blog from "@/pages/Blog";
import Orders from "@/pages/Orders";
import Transaction from "@/pages/Transaction";
import Clients from "@/pages/Clients";
import Withdrawals from "@/pages/Withdrawals";
import Refunds from "@/pages/Refunds";
import Support from "@/pages/Support";
import PrivateRoute from "@/components/routes/PrivateRoute";
import PublicRoute from "@/components/routes/PublicRoute";
import { Toaster } from "@/components/ui/toaster";
import TryProductForm from "@/pages/TryProductForm";
import TryPayment from "@/pages/TryPayment";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/configuration"
          element={
            <PrivateRoute>
              <Configuration />
            </PrivateRoute>
          }
        />
        <Route
          path="/blog"
          element={
            <PrivateRoute>
              <Blog />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <PrivateRoute>
              <Transaction />
            </PrivateRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <Clients />
            </PrivateRoute>
          }
        />
        <Route
          path="/withdrawals"
          element={
            <PrivateRoute>
              <Withdrawals />
            </PrivateRoute>
          }
        />
        <Route
          path="/refunds"
          element={
            <PrivateRoute>
              <Refunds />
            </PrivateRoute>
          }
        />
        <Route
          path="/support"
          element={
            <PrivateRoute>
              <Support />
            </PrivateRoute>
          }
        />
        <Route
          path="/try-productform"
          element={
            <PrivateRoute>
              <TryProductForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/try/:id"
          element={
            <PrivateRoute>
              <TryPayment />
            </PrivateRoute>
          }
        />
        <Route
          path="/try"
          element={
            <PrivateRoute>
              <TryPayment />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;