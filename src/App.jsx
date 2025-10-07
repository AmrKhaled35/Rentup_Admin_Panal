import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";
import PublicRoute from "./routes/PublicRoute";
import Home from "./pages/Home";
import ManageAppSetting from "./pages/ManageAppSetting";
import ManageHero from "./pages/ManageHero";
import ManageOurAdvantage from "./pages/ManageOurAdvantage";
import ManageAboutUs from "./pages/ManageAboutUs";
import ManageSocial from "./pages/ManageSocial";
import ManageFooter from "./pages/ManageFooter";
import Facilities from "./pages/Facilities";
import OutdoorFacilities from "./pages/OutdoorFacilities";
import Category from "./pages/Category";
import PropertyListing from "./pages/PropertyListing";
import ListingType from "./pages/ListingType";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import UsersLogins from "./pages/UsersLogins";
import BlogList from "./pages/BlogList";
import BlogCategory from "./pages/BlogCategory";
import CountryList from "./pages/CountryList";
import CityList from "./pages/CityList";
import Currency from "./pages/Currency";
import PaymentGateways from "./pages/PaymentGateways";
import GatewayStripe from "./pages/GatewayStripe";
import PaymentHistory from "./pages/PaymentHistory";
import SupportTicket from "./pages/SupportTicket";
import TicketDetails from "./pages/TicketDetails";
import PackageConfig from "./pages/PackageConfig";
import Faq from "./pages/Faq";
import AdminList from "./pages/AdminList";
import Testimonial from "./pages/Testimonial";
import Pages from "./pages/Pages";
import Reports from "./pages/Reports";
import UsersListings from "./pages/UsersListings";
import ConfigMail from "./pages/ConfigMail";
import ConfigPusher from "./pages/ConfigPusher";
import ConfigGoogle from "./pages/ConfigGoogle";
import Main from "./layout/Main";
import PrivateRoute from "./routes/PrivateRoute";
import ClientContact from "./pages/ClientContact";
import CreateAdminRole from "./pages/CreateAdminRole";
import AddRolePermission from "./pages/AddRolePermission";
import EditRolePermission from "./pages/EditRolePermission";
import ManageAds from "./pages/ManageAds";

const App = () => {
  const { token, user, loading } = useAuth();

  const routerArray = [
    {
      path: "/",
      element:
        !loading && !token ? (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ) : (
          <PrivateRoute>
            <Main />
          </PrivateRoute>
        ),
      children: [
        {
          path: "/",
          element: <Navigate to="/dashboard" />,
        },
        {
          path: "dashboard",
          element: <Home />,
        },
        {
          path: "app-setting",
          element: <ManageAppSetting />,
        },
        {
          path: "hero",
          element: <ManageHero />,
        },
        {
          path: "our-advantage",
          element: <ManageOurAdvantage />,
        },
        {
          path: "about-us",
          element: <ManageAboutUs />,
        },
        {
          path: "social",
          element: <ManageSocial />,
        },
        {
          path: "footer",
          element: <ManageFooter />,
        },
        {
          path: "ads",
          element: <ManageAds />,
        },
        {
          path: "facilities",
          element: <Facilities />,
        },
        {
          path: "outdoor-facilities",
          element: <OutdoorFacilities />,
        },
        {
          path: "category",
          element: <Category />,
        },
        {
          path: "property-listing",
          element: <PropertyListing />,
        },
        {
          path: "listing-type",
          element: <ListingType />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "users/:id",
          element: <UserDetails />,
        },
        {
          path: "users/:id/logins",
          element: <UsersLogins />,
        },
        {
          path: "blog-list",
          element: <BlogList />,
        },
        {
          path: "blog-category-list",
          element: <BlogCategory />,
        },
        {
          path: "country-list",
          element: <CountryList />,
        },
        {
          path: "city-list",
          element: <CityList />,
        },
        {
          path: "currency",
          element: <Currency />,
        },
        {
          path: "payment-gateways",
          element: <PaymentGateways />,
        },
        {
          path: "payment-gateways/:id",
          element: <GatewayStripe />,
        },
        {
          path: "payment-history",
          element: <PaymentHistory />,
        },
        {
          path: "support-ticket",
          element: <SupportTicket />,
        },
        {
          path: "support-ticket/:id",
          element: <TicketDetails />,
        },
        {
          path: "package",
          element: <PackageConfig />,
        },
        {
          path: "faq",
          element: <Faq />,
        },
        {
          path: "admin-list",
          element: <AdminList />,
        },
        {
          path: "testimonial",
          element: <Testimonial />,
        },
        {
          path: "pages",
          element: <Pages />,
        },
        {
          path: "report",
          element: <Reports />,
        },
        {
          path: "users-properties/:id",
          element: <UsersListings />,
        },
        {
          path: "mail-config",
          element: <ConfigMail />,
        },
        {
          path: "pusher-config",
          element: <ConfigPusher />,
        },
        {
          path: "google-config",
          element: <ConfigGoogle />,
        },
        {
          path: "client-query",
          element: <ClientContact />,
        },
        {
          path: "create-role",
          element: <CreateAdminRole />,
        },
        {
          path: "create-role/new",
          element: <AddRolePermission />,
        },
        {
          path: "edit-role/:id",
          element: <EditRolePermission />,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routerArray);

  return <RouterProvider router={router} />;
};

export default App;
