import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login
from "../pages/auth/Login";

import Dashboard
from "../pages/dashboard/Dashboard";
import Users
from "../pages/users/Users";
import Profile
from "../pages/profile/Profile";
import Settings
from "../pages/settings/Settings";
import Leads
from "../pages/crm/Leads";
import Customers
from "../pages/crm/Customers";
import BusinessAccounts
from "../pages/b2b/BusinessAccounts";
import Products
from "../pages/inventory/Products";
import Inventory
from "../pages/inventory/Inventory";
import Orders
from "../pages/orders/Orders";

import DashboardLayout
from "../layouts/DashboardLayout";
import StoreLayout
from "../layouts/StoreLayout";

import ProtectedRoute
from "./ProtectedRoute";
import CustomerProtectedRoute
from "./CustomerProtectedRoute";
import CustomerRegister
from "../pages/auth/CustomerRegister";
import ForgotPassword
from "../pages/auth/ForgotPassword";
import ResetPassword
from "../pages/auth/ResetPassword";
import ProductsPage
from "../pages/store/ProductsPage";
import CartPage
from "../pages/store/CartPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<CustomerRegister />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route element={<StoreLayout />}>
          <Route
            path="/store"
            element={<Navigate to="/store/products" replace />}
          />
          <Route
            path="/store/products"
            element={<ProductsPage />}
          />
          <Route
            path="/cart"
            element={<CartPage />}
          />
          <Route
            path="/store/about"
            element={<ProductsPage />}
          />
          <Route
            path="/store/contact"
            element={<ProductsPage />}
          />
        </Route>

        <Route
          path="/checkout"
          element={
            <CustomerProtectedRoute>
              <StoreLayout />
            </CustomerProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />

          <Route
            path="/users"
            element={
              <Users />
            }
          />

          <Route
            path="/profile"
            element={
              <Profile />
            }
          />

          <Route
            path="/settings"
            element={
              <Settings />
            }
          />

          <Route
            path="/leads"
            element={
              <Leads />
            }
          />

          <Route
            path="/customers"
            element={
              <Customers />
            }
          />

          <Route
            path="/b2b/accounts"
            element={
              <BusinessAccounts />
            }
          />

          <Route
            path="/products"
            element={
              <Products />
            }
          />

          <Route
            path="/inventory"
            element={
              <Inventory />
            }
          />

          <Route
            path="/orders"
            element={
              <Orders />
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;
