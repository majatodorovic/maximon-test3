"use client";
import { useCallback, useState } from "react";
import {
  GoogleReCaptchaProvider as Provider,
  GoogleReCaptcha as ReCaptcha,
} from "react-google-recaptcha-v3";
import { post as POST } from "@/api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSearchParams } from "next/navigation";

import { useProduct } from "@/hooks/ecommerce.hooks";

const Contact = ({staticData}) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // const { data } = useProduct({ slug: id });
  const keyGenerator = (prefix) => {
    return `${prefix}-${Math.random().toString(36)}`;
  };

  const [token, setToken] = useState();
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const requiredFields = [
    "customer_name",
    "phone",
    "email",
    "message",
  ];

  const verifyCaptcha = useCallback((token) => {
    setToken(token);
  }, []);

  const [formData, setFormData] = useState({
    page_section: "contact_page",
    customer_name: "",
    phone: "",
    email: "",
    message: "",
    gcaptcha: token,
  });

  const handleChange = ({ target }) => {
    let err = [];
    err = errors.filter((error) => error !== target.name);
    setErrors(err);
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const errors = [];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors.push(field);
      }
      setErrors(errors);
    });
    if (errors?.length > 0) {
      setLoading(false);
    } else {
      await POST("/contact/contact_page", {
        ...formData,
        gcaptcha: token,
      }).then((res) => {
        if (res?.code === 200) {
          toast.success("Uspešno ste poslali poruku!", {
            position: "top-center",
            autoClose: 2000,
          });
          setLoading(false);
          setFormData({
            page_section: "contact_page",
            customer_name: "",
            phone: "",
            email: "",
            message: "",
            gcaptcha: token,
          });
        } else {
          toast.error("Došlo je do greške! Pokušajte ponovo.", {
            position: "top-center",
            autoClose: 2000,
          });
          setLoading(false);
        }
      });
    }
  };

  return (
    <Provider reCaptchaKey={process.env.CAPTCHAKEY}>
      <ReCaptcha onVerify={verifyCaptcha} refreshReCaptcha={refreshReCaptcha} />
      <div className="mx-0 w-[90%] 2xl:w-[85%] max-sm:w-full max-sm:px-1 md:mx-auto mt-20 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10 min-h-[200px]">
        {/* Contact Form */}
        <form className="flex flex-col gap-6 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="relative">
              <input
                required
                type="text"
                value={formData.customer_name}
                name="customer_name"
                id="customer_name"
                onChange={handleChange}
                className={`peer p-2 border border-gray-300 focus:border-gray-300 focus:border-b-2 focus:border-b-black focus:outline-none focus:ring-0 w-full h-[45px] text-gray-800 text-center`}
              />
              <label
                htmlFor="customer_name"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                IME
              </label>
            </div>

            {/* Last Name */}
            <div className="relative">
              <input
                required
                type="text"
                value={formData.last_name}
                name="last_name"
                id="last_name"
                onChange={handleChange}
                className={`peer p-2 border border-gray-300 focus:border-gray-300 focus:border-b-2 focus:border-b-black focus:outline-none focus:ring-0 w-full h-[45px] text-gray-800 text-center`}
              />
              <label
                htmlFor="last_name"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                PREZIME
              </label>
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="relative">
              <input
                required
                type="text"
                value={formData.phone}
                name="phone"
                id="phone"
                onChange={handleChange}
                className={`peer p-2 border border-gray-300 focus:border-gray-300 focus:border-b-2 focus:border-b-black focus:outline-none focus:ring-0 w-full h-[45px] text-gray-800 text-center`}
              />
              <label
                htmlFor="phone"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                TELEFON
              </label>
            </div>
            <div className="relative">
              <input
                required
                type="email"
                value={formData.email}
                name="email"
                id="email"
                onChange={handleChange}
                className={`peer p-2 border border-gray-300 focus:border-gray-300 focus:border-b-2 focus:border-b-black focus:outline-none focus:ring-0 w-full h-[45px] text-gray-800 text-center`}
              />
              <label
                htmlFor="email"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                EMAIL
              </label>
            </div>
          </div>


          {/* Message */}
          <div className="relative">
            <textarea
              required
              name="message"
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="PORUKA"
              className={`peer p-2 border border-gray-300 focus:border-gray-300 focus:border-b-2 focus:border-b-black focus:outline-none focus:ring-0 text-gray-800  p-2 w-full `}
            ></textarea>

          </div>
          {/* Submit Button (Below the form on mobile screens) */}
          <div className="w-full mt-[-15px] block lg:hidden">
            <button
              onClick={(e) => {
                handleSubmit(e);
              }}
              className={`bg-black text-white py-3 w-[250px] ${loading ? "cursor-wait" : "cursor-pointer"}`}
              disabled={loading}
            >
              {loading ? <i className="fa fa-spinner fa-spin"></i> : "POŠALJITE PORUKU"}
            </button>
          </div>
        </form>

        {/* Contact Information */}
        <div className="flex flex-col justify-between bg-gray-50 p-14 mb-2 max-sm:px-2 ">
        {staticData?.map((items) => {
          if(items?.type == 'textarea') {
            const stuff = items?.content;
            const split = stuff.split('\n');
            return(
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1  max-lg:flex max-lg:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">{split[0]}</h2>
              <a href={`tel:${split[1]}`}>{split[1]}</a>
              <a href={`tel:${split[2]}`}>{split[2]}</a>
              <a href={`tel:${split[3]}`}>{split[3]}</a>
              <a href={`mailto:${split[4]}`}>{split[4]}</a>
            </div>
            <div className="flex flex-col gap-1 ml-[0px] md:ml-[-35px]">
              <h2 className="text-lg font-semibold">{split[5]}</h2>
              <p>{split[6]}</p>
              <p>{split[7]}</p>
              <p>{split[8]}</p>
              <p>{split[9]}</p>

            </div>
          </div>
            )}
        })}
        </div>

        {/* Submit Button (Below the form) */}
        <div className="w-full mt-[-20px] hidden lg:block">
          <button
            onClick={(e) => {
              handleSubmit(e);
            }}
            className={`bg-black text-white py-3 w-[250px] ${loading ? "cursor-wait" : "cursor-pointer"}`}
            disabled={loading}
          >
            {loading ? <i className="fa fa-spinner fa-spin"></i> : "POŠALJITE PORUKU"}
          </button>
        </div>
      </div>
    </Provider>
  );
};

export default Contact;
