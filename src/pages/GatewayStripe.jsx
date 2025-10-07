import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import myAxios from "../utils/myAxios";
import Loading from "../components/shared/Loading";
import useAuth from "../hooks/useAuth";
import Select from "react-select";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const customStyles = {
  control: () => ({
    border: "1px solid #E0E2E7",
    borderRadius: "6px",
    height: "40px",
    marginTop: "4px",
    display: "flex",
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#E0E2E7",
  }),
};

const GatewayStripe = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [isChecked, setIsChecked] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const { token } = useAuth();
  const gatewayParameters =
    data?.gateway_parameters && JSON.parse(data?.gateway_parameters);
  const fields = gatewayParameters && Object.keys(gatewayParameters);

  useEffect(() => {
    setLoading(true);
    myAxios(`/admin/gateway/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setData(res.data.data);
        setIsChecked(res.data.data.status);
        res?.data?.data?.supported_currencies &&
          setCurrencies(
            Object.keys(JSON.parse(res?.data?.data?.supported_currencies)).map(
              (item) => ({
                label: item,
                value: item,
              })
            )
          );
        setLoading(false);

        if (res.data.data.gateway_parameters) {
          setInputValues(JSON.parse(res.data.data.gateway_parameters));
        }
      })
      .catch((error) => console.log(error));

    myAxios("/admin/currency/get-all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCurrencyOptions(
          res.data?.data?.map((item) => ({
            value: item.currency_code,
            label: item.currency_code,
          }))
        );
      })
      .catch((error) => console.log(error));
  }, [refetch, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      gateway_name: data?.gateway_name,
      gateway_parameters: inputValues,
      supported_currencies: currencies.reduce(
        (acc, curr) => ({ ...acc, [curr.value]: curr.value }),
        {}
      ),
      status: isChecked,
    };

    const toastId = toast.loading("جاري التحديث...");
    myAxios
      .post(`/admin/gateway/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.dismiss(toastId);
        if (res.data.status === "success") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "تم التحديث بنجاح!",
            showConfirmButton: false,
            timer: 1000,
          });
          setRefetch((p) => !p);
        } else {
          toast.error(res.data?.message);
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <div dir="rtl">
      <p className="text-2xl text-dark font-medium">تحديث بوابة الدفع</p>
      <div className="bg-white rounded-md shadow-sm mt-6 p-6">
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center">
              <p className="text-xl text-dark font-medium">
                <span className="capitalize">{id}</span> الدفع
              </p>
              <div className="flex">
                <input
                  type="checkbox"
                  name="status"
                  id="enable-payment"
                  className="peer hidden"
                  checked={isChecked}
                  onChange={() => setIsChecked((p) => !p)}
                />
                <label
                  htmlFor="enable-payment"
                  className="select-none cursor-pointer rounded-md border border-[#3EA570] py-2 px-3 w-full transition-colors duration-200 ease-in-out text-center text-sm mt-2 peer-checked:bg-[#3EA570] peer-checked:text-white peer-checked:border-[#3EA570] text-dark"
                >
                  تفعيل
                </label>
              </div>
            </div>

            <p className="text-lg text-dark font-medium mt-8">الإعدادات</p>
            <div className="grid lg:grid-cols-2 gap-6 mt-4">
              {fields?.map((item, index) => (
                <label key={index} className="flex flex-col gap-2">
                  <span className="text-sm">{item}</span>
                  <input
                    type="text"
                    name={item}
                    value={inputValues[item] || ""}
                    onChange={handleInputChange}
                    className="h-10 form-input border-gray focus:ring-0 focus:border-gray rounded-md text-sm px-3 text-light-dark"
                  />
                </label>
              ))}
            </div>

            <div className="my-6">
              <label className="text-sm text-dark font-medium mb-2 block">
                العملات المدعومة
              </label>
              <Select
                isMulti
                name="currencies"
                options={currencyOptions}
                onChange={(value) => setCurrencies(value)}
                styles={customStyles}
                value={currencies}
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-[#3EA570] text-white font-medium rounded-md"
            >
              تحديث
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GatewayStripe;
