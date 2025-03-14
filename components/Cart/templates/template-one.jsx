import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";
import FreeDeliveryScale from "../FreeDeliveryScale";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

export const TemplateOne = ({ verifyCaptcha, data, cartCost, children }) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.CAPTCHAKEY}>
      <GoogleReCaptcha onVerify={verifyCaptcha} refreshReCaptcha={true} />
      <div className="mx-auto text-sm 4xl:container mt-0 placeholder">
        <Breadcrumbs currentPage={"Korpa"} marginTop="mt-0 md:mt-8" />
        <h1 className="text-[16px] font-bold uppercase text-center mt-10 md:mt-15">
          Korpa
        </h1>
        <p className="text-center text-[18px] font-normal text-black/70 max-w-[800px] py-3 mt-8 md:mb-20 mx-auto">
          Otkrijte ove sezone nove haljine, topove, pletiva, teksas i krojenje -
          sve u prepoznatljivom Reiss stilu, prilagođeno za trenutak
        </p>

        <div className="mx-0 w-[90%] max-sm:w-full max-sm:mx-0 md:mx-auto">
          <div className="col-span-5 bg-white p-1 max-xl:row-start-1">
            <div className={`flex items-center justify-between`}>
            </div>
            {children}
          </div>
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
};
