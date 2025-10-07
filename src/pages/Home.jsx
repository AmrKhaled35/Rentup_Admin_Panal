import React, { useEffect, useState } from "react";
import totalUser from "../assets/images/total-user.svg";
import activeUser from "../assets/images/active-user.svg";
import emailUnverifiedUser from "../assets/images/email-unverified-user.svg";
import mobileUnverifiedUser from "../assets/images/mobile-unverified-user.svg";
import totalPayment from "../assets/images/total-payment.svg";
import pendingPayment from "../assets/images/pending-payment.svg";
import rejectedPayment from "../assets/images/rejected-payment.svg";
import featuredProperties from "../assets/images/featured-properties.svg";
import approvedProperties from "../assets/images/approved-properties.svg";
import pendingProperties from "../assets/images/pending-properties.svg";
import rejectedProperties from "../assets/images/rejected-properties.svg";
import approvedSellProperties from "../assets/images/approved-sell-properties.svg";
import pendingSellProperties from "../assets/images/pending-sell-properties.svg";
import approvedRentProperties from "../assets/images/approved-rent-properties.svg";
import pendingRentProperties from "../assets/images/pending-rent-properties.svg";
import bestSellingPackage from "../assets/images/best-selling-package.svg";
import totalUserBg from "../assets/images/total-user-bg.svg";
import totalPaymentBg from "../assets/images/total-payment-bg.svg";
import featuredPropertiesBg from "../assets/images/featured-properties-bg.svg";
import approvedPropertiesBg from "../assets/images/approved-properties-bg.svg";
import pendingPropertiesBg from "../assets/images/pending-properties-bg.svg";
import rejectedPropertiesBg from "../assets/images/rejected-properties-bg.svg";
import approvedSellPropertiesBg from "../assets/images/approved-sell-properties-bg.svg";
import bestSellingPackageBg from "../assets/images/best-selling-package-bg.svg";
import Card from "../components/home/Card";
import myAxios from "../utils/myAxios";
import useAuth from "../hooks/useAuth";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";

// defaults.maintainAspectRatio = false;
// defaults.responsive = true;

const data = [
  {
    label: "Jan",
    revenue: 64854,
  },
  {
    label: "Feb",
    revenue: 54628,
  },
  {
    label: "Mar",
    revenue: 117238,
  },
  {
    label: "Apr",
    revenue: 82830,
  },
  {
    label: "May",
    revenue: 91208,
  },
  {
    label: "Jun",
    revenue: 103609,
  },
  {
    label: "Jul",
    revenue: 90974,
  },
  {
    label: "Aug",
    revenue: 82919,
  },
  {
    label: "Sep",
    revenue: 62407,
  },
  {
    label: "Oct",
    revenue: 82528,
  },
  {
    label: "Nov",
    revenue: 56979,
  },
  {
    label: "Dec",
    revenue: 87436,
  },
];

/* const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]; */

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bestSellingPkg, setBestSellingPkg] = useState(null);
  const [successPayment, setSuccessPayment] = useState(null);
  const [pendingPay, setPendingPay] = useState(null);
  const [rejectedPay, setRejectedPay] = useState(null);
  const [report, setReport] = useState("weekly");
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const { token } = useAuth();
  const labels =
    report === "yearly"
      ? yearlyData?.map((item) => item?.month)
      : report === "monthly"
      ? monthlyData?.map((item) => item?.date)
      : report === "weekly"
      ? weeklyData?.map((item) => item?.day)
      : "";

  const activeUserData = users.filter((item) => item.status);
  const emailUnverifiedUserData = users.filter(
    (item) => !item.is_email_verified
  );
  const mobileUnverifiedUserData = users.filter(
    (item) => !item.is_number_verified
  );
  const freeUsersData = users.filter(
    (item) => item.user_package?.package_name === "مجاني"
  );
  const starterUsersData = users.filter(
    (item) => item.user_package?.package_name === "مبدئي"
  );
  const premiumUsersData = users.filter(
    (item) => item.user_package?.package_name === "مميز"
  );

  const featuredPropertiesData = properties.filter((item) => item.is_featured);
  const activePropertiesData = properties.filter(
    (item) => item.status === "موافق عليها"
  );
  const pendingPropertiesData = properties.filter(
    (item) => item.status === "معلقة"
  );
  const rejectedPropertiesData = properties.filter(
    (item) => item.status === "مرفوضة"
  );
  
  const activeSellPropertiesData = activePropertiesData.filter(
    (item) => item.get_listing_type?.listing_name === "بيع"
  );
  const pendingSellPropertiesData = pendingPropertiesData.filter(
    (item) => item.get_listing_type?.listing_name === "بيع"
  );
  const activeRentPropertiesData = activePropertiesData.filter(
    (item) => item.get_listing_type?.listing_name === "إيجار"
  );
  const pendingRentPropertiesData = pendingPropertiesData.filter(
    (item) => item.get_listing_type?.listing_name === "إيجار"
  );
  
  useEffect(() => {
    if (token) {
      const timeoutId = setTimeout(() => {
        myAxios("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            setUsers(res.data.data);
          })
          .catch((error) => console.log(error));

        myAxios("/admin/property/get-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setProperties(res.data.data);
          })
          .catch((error) => console.log(error));

        myAxios("/admin/package/best-selling-package", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setBestSellingPkg(res.data.data);
          })
          .catch((error) => console.log(error));

        myAxios("/admin/total-payments?status=success&count=true", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setSuccessPayment(res.data.total);
           
          })
          .catch((error) => console.log(error));

        myAxios("/admin/total-payments?status=pending&count=true", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setPendingPay(res.data.total);
            
          })
          .catch((error) => console.log(error));

        myAxios("/admin/total-payments?status=rejected&count=true", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setRejectedPay(res.data.total);
          })
          .catch((error) => console.log(error));

        myAxios("/admin/yearly-report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setYearlyData(res.data.transactions);
          })
          .catch((error) => console.log(error));

        myAxios("/admin/monthly-report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setMonthlyData(res.data.transactions);
          })
          .catch((error) => console.log(error));

        myAxios("/admin/weekly-report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setWeeklyData(res.data.transactions);
          })
          .catch((error) => console.log(error));
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [token]);

  return (
    <div>
      <div className="mt-6 grid lg:grid-cols-4 gap-6">
        <Card title="إجمالي المستخدمين" count={users?.length} icon={totalUser} bg={totalUserBg} link="/users" />
        <Card title="المستخدمين النشطين" count={activeUserData?.length} icon={activeUser} bg={totalUserBg} link="/users?status=1" />
        <Card title="البريد الإلكتروني غير مفعل" count={emailUnverifiedUserData?.length} icon={emailUnverifiedUser} bg={totalUserBg} link="/users?email=false" />
        <Card title="رقم الهاتف غير مفعل" count={mobileUnverifiedUserData?.length} icon={mobileUnverifiedUser} bg={totalUserBg} link="/users?number=false" />
        <Card title="إجمالي المدفوعات" count={successPayment} icon={totalPayment} bg={totalPaymentBg} link="/payment-history" />
        <Card title="المدفوعات المعلقة" count={pendingPay} icon={pendingPayment} bg={totalPaymentBg} link="/payment-history?status=pending" />
        <Card title="المدفوعات المرفوضة" count={rejectedPay} icon={rejectedPayment} bg={totalPaymentBg} link="/payment-history?status=rejected" />
        <Card title="العقارات المميزة" count={featuredPropertiesData?.length} icon={featuredProperties} bg={featuredPropertiesBg} link="/property-listing?featured=1" />
        <Card title="العقارات الموافق عليها" count={activePropertiesData?.length} icon={approvedProperties} bg={approvedPropertiesBg} link="/property-listing?status=active" />
        <Card title="العقارات المعلقة" count={pendingPropertiesData?.length} icon={pendingProperties} bg={pendingPropertiesBg} link="/property-listing?status=pending" />
        <Card title="العقارات المرفوضة" count={rejectedPropertiesData?.length} icon={rejectedProperties} bg={rejectedPropertiesBg} link="/property-listing?status=rejected" />
        <Card title="عقارات البيع الموافق عليها" count={activeSellPropertiesData?.length} icon={approvedSellProperties} bg={approvedSellPropertiesBg} />
        <Card title="عقارات البيع المعلقة" count={pendingSellPropertiesData?.length} icon={pendingSellProperties} bg={approvedSellPropertiesBg} />
        <Card title="عقارات الإيجار الموافق عليها" count={activeRentPropertiesData?.length} icon={approvedRentProperties} bg={approvedSellPropertiesBg} />
        <Card title="عقارات الإيجار المعلقة" count={pendingRentPropertiesData?.length} icon={pendingRentProperties} bg={approvedSellPropertiesBg} />
        <Card title="أفضل باقة مبيعاً" count={bestSellingPkg?.title} icon={bestSellingPackage} bg={bestSellingPackageBg} />
        <Card title="المستخدمين المجانيين" count={freeUsersData?.length} icon={activeUser} bg={totalUserBg} />
        <Card title="مستخدمو الباقة المبدئية" count={starterUsersData?.length} icon={mobileUnverifiedUser} bg={totalUserBg} />
        <Card title="مستخدمو الباقة المميزة" count={premiumUsersData?.length} icon={emailUnverifiedUser} bg={totalUserBg} />
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <p className="text-xl font-medium">
            {report === 'weekly' ? 'تقرير أسبوعي' : report === 'monthly' ? 'تقرير شهري' : 'تقرير سنوي'}
          </p>
          <select
            onChange={(e) => setReport(e.target.value)}
            className="w-28 h-8 rounded form-select border-[#E4E6EC] focus:ring-0 focus:border-[#E4E6EC] text-xs font-semibold"
          >
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
            <option value="yearly">سنوي</option>
          </select>
        </div>

        <div className="mt-6 p-8 bg-white border border-[#F0F2F5] rounded-md">
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: "المدفوعات",
                  barThickness: window.innerWidth < 1024 ? 10 : 30,
                  data:
                    report === "yearly"
                      ? yearlyData?.map((data) => data?.count)
                      : report === "monthly"
                      ? monthlyData?.map((data) => data?.count)
                      : report === "weekly"
                      ? weeklyData?.map((data) => data?.count)
                      : [],
                  backgroundColor: "#22c55e",
                },
              ],
            }}
            options={{ responsive: true, plugins: { colors: { enabled: true } } }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
