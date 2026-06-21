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
import ProfessionalRequest
from "../pages/b2b/ProfessionalRequest";
import ProfessionalDashboard
from "../pages/b2b/ProfessionalDashboard";
import BulkOrderPage
from "../pages/b2b/BulkOrderPage";
import B2BInvoicesPage
from "../pages/b2b/B2BInvoicesPage";
import Products
from "../pages/inventory/Products";
import Inventory
from "../pages/inventory/Inventory";
import Orders
from "../pages/orders/Orders";
import CmsAdmin
from "../pages/cms/CmsAdmin";
import AcademyPage
from "../pages/cms/AcademyPage";
import CommerceAdmin
from "../pages/commerce/CommerceAdmin";
import MarketingAdmin
from "../pages/marketing/MarketingAdmin";
import IntegrationsAdmin
from "../pages/integrations/IntegrationsAdmin";
import LegalPage
from "../pages/legal/LegalPage";
import CookieConsent
from "../components/CookieConsent";
import AnalyticsDashboard
from "../pages/analytics/AnalyticsDashboard";

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
import ProductDetailPage
from "../pages/store/ProductDetailPage";
import CheckoutPage
from "../pages/store/CheckoutPage";
import OrderSuccessPage
from "../pages/store/OrderSuccessPage";
import CustomerAccount
from "../pages/account/CustomerAccount";
import CustomerOrders
from "../pages/account/CustomerOrders";
import CustomerProfile
from "../pages/account/CustomerProfile";

const AppRoutes = () => {
  const adminPrefix =
    import.meta.env.VITE_ADMIN_ROUTE_PREFIX ||
    "admin-console";

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
          path={`/${adminPrefix}`}
          element={<Navigate to="/dashboard" replace />}
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
            path="/store/products/:id"
            element={<ProductDetailPage />}
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
          <Route
            path="/privacy"
            element={<LegalPage />}
          />
          <Route
            path="/terms"
            element={<LegalPage />}
          />
          <Route
            path="/legal/:slug"
            element={<LegalPage />}
          />
          <Route
            path="/academy"
            element={<AcademyPage />}
          />
        </Route>

        <Route
          element={
            <CustomerProtectedRoute>
              <StoreLayout />
            </CustomerProtectedRoute>
          }
        >
          <Route
            path="/checkout"
            element={<CheckoutPage />}
          />
          <Route
            path="/checkout/success"
            element={<OrderSuccessPage />}
          />
          <Route
            path="/account"
            element={<CustomerAccount />}
          >
            <Route
              index
              element={<Navigate to="/account/orders" replace />}
            />
            <Route
              path="/account/orders"
              element={<CustomerOrders />}
            />
            <Route
              path="/account/profile"
              element={<CustomerProfile />}
            />
          </Route>
          <Route
            path="/professional/request"
            element={<ProfessionalRequest />}
          />
          <Route
            path="/professional/dashboard"
            element={<ProfessionalDashboard />}
          />
          <Route
            path="/professional/bulk-order"
            element={<BulkOrderPage />}
          />
          <Route
            path="/professional/invoices"
            element={<B2BInvoicesPage />}
          />
        </Route>

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
            path="/analytics"
            element={
              <AnalyticsDashboard />
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

          <Route
            path="/cms"
            element={
              <CmsAdmin />
            }
          />

          <Route
            path="/commerce"
            element={
              <CommerceAdmin />
            }
          />

          <Route
            path="/marketing"
            element={
              <MarketingAdmin />
            }
          />

          <Route
            path="/integrations"
            element={
              <IntegrationsAdmin />
            }
          />

        </Route>

      </Routes>
      <CookieConsent />

    </BrowserRouter>
  );
};

export default AppRoutes;
