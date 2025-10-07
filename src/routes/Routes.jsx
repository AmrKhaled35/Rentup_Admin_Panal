import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Main from "../layout/Main";
import Home from "../pages/Home";
import Category from "../pages/Category";
import PropertyListing from "../pages/PropertyListing";
import Users from "../pages/Users";
import BlogList from "../pages/BlogList";
import CountryList from "../pages/CountryList";
import CityList from "../pages/CityList";
import Faq from "../pages/Faq";
import AdminList from "../pages/AdminList";
import ListingType from "../pages/ListingType";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Testimonial from "../pages/Testimonial";
import UsersListings from "../pages/UsersListings";
import BlogCategory from "../pages/BlogCategory";
import Pages from "../pages/Pages";
import Facilities from "../pages/Facilities";
import ManageHero from "../pages/ManageHero";
import ManageFooter from "../pages/ManageFooter";
import ManageOurAdvantage from "../pages/ManageOurAdvantage";
import ManageAboutUs from "../pages/ManageAboutUs";
import ManageSocial from "../pages/ManageSocial";
import PackageConfig from "../pages/PackageConfig";
import Currency from "../pages/Currency";
import ManageAppSetting from "../pages/ManageAppSetting";
import UserDetails from "../pages/UserDetails";
import SupportTicket from "../pages/SupportTicket";
import TicketDetails from "../pages/TicketDetails";
import PaymentGateways from "../pages/PaymentGateways";
import GatewayStripe from "../pages/GatewayStripe";
import UsersLogins from "../pages/UsersLogins";
import PaymentHistory from "../pages/PaymentHistory";
import Reports from "../pages/Reports";
import ConfigMail from "../pages/ConfigMail";
import ConfigPusher from "../pages/ConfigPusher";
import ConfigGoogle from "../pages/ConfigGoogle";
import OutdoorFacilities from "../pages/OutdoorFacilities";
import AddRolePermission from "../pages/AddRolePermission";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "admin",
      element: (
        <PrivateRoute>
          <Main />
        </PrivateRoute>
      ),
      children: [
        {
          path: "/admin",
          element: <Navigate to="/admin/dashboard" />,
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
          path: "create-role/new",
          element: <AddRolePermission />,
        },
      ],
    },
  ]
  // {
  //   basename: "/realEstate",
  // }
);

export default router;
