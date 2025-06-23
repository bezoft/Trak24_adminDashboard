import { Routes, Route } from "react-router-dom";
import Home from './adminpages/home';
import Login from "./login";
import axios from "axios";
import "./App.css"
import ProtectedRoute from "./auth/protectedRoutes";
import NewCustomer from "./adminpages/newCustomer";
import AllCustomers from "./adminpages/allCustomers";
import AdminRoles from "./adminpages/adminRoles";
import ConfigureNewUnit from "./adminpages/configureNewUnit";
import Newshipment from "./adminpages/newShipment";
import StockList from "./adminpages/stockList";
import InstallNewUnit from "./adminpages/InstallNewUnit";
import EagleEyeMonitoring from "./adminpages/eagleEyeMonitoring";
import SimCardsList from "./adminpages/simCardsList";
import SimEntry from "./adminpages/SimEntry";
import IncidentManage from "./adminpages/IncidentManage";
import CreateIncident from "./adminpages/CreateIncident";
import UpdateIncident from "./adminpages/UpdateIncident";
import EditIncident from "./adminpages/EditIncident";
import Unitstatus from "./adminpages/Unitstatus";
import CustomerBilling from "./adminpages/CustomerBilling";
import ServiceRenewal from "./adminpages/ServiceRenewal";
import RawDataManager from "./adminpages/rawDataManager";

axios.defaults.baseURL ="https://manage.trak24.in/api/"
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new-customer"
        element={
          <ProtectedRoute>
            <NewCustomer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-customer/:id"
        element={
          <ProtectedRoute>
            <NewCustomer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-info"
        element={
          <ProtectedRoute>
            <AllCustomers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/config-new-unit"
        element={
          <ProtectedRoute>
            <ConfigureNewUnit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new-shipment"
        element={
          <ProtectedRoute>
            <Newshipment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock-list"
        element={
          <ProtectedRoute>
            <StockList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/install-unit/:id/:sim"
        element={
          <ProtectedRoute>
            <InstallNewUnit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eagle-eye-monitoring"
        element={
          <ProtectedRoute>
            <EagleEyeMonitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-roles"
        element={
          <ProtectedRoute>
            <AdminRoles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sim-cards"
        element={
          <ProtectedRoute>
            <SimCardsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sim-entry"
        element={
          <ProtectedRoute>
            <SimEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-incidents"
        element={
          <ProtectedRoute>
            <IncidentManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-incidents/update-status/:id"
        element={
          <ProtectedRoute>
            <UpdateIncident />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-incident/:name/:id"
        element={
          <ProtectedRoute>
            <CreateIncident />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-incidents/edit"
        element={
          <ProtectedRoute>
            <EditIncident />
          </ProtectedRoute>
        }
      />

      <Route
        path="/unit-status"
        element={
          <ProtectedRoute>
            <Unitstatus />
          </ProtectedRoute>
        }
      />

<Route
        path="/customer-billing"
        element={
          <ProtectedRoute>
            <CustomerBilling />
          </ProtectedRoute>
        }
      />
      <Route
        path="/raw-data"
        element={
          <ProtectedRoute>
            <RawDataManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-renewal/:id"
        element={
          <ProtectedRoute>
            <ServiceRenewal />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
