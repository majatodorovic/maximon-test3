"use client";

import {
  useAddPromoCode,
  usePromoCodeOptions,
  usePromoCodesList,
  useRemovePromoCode,
} from "@/hooks/ecommerce.hooks";
import { useEffect, useState } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";

export const PromoCode = () => {
  const queryClient = useQueryClient();

  const [promoCode, setPromoCode] = useState("");
  const [buttonText, setButtonText] = useState("Aktiviraj kupon");

  const {
    mutate: activatePromoCode,
    isPending,
    data,
    isSuccess: is_activated,
  } = useAddPromoCode();

  const { mutate: deletePromoCode, isSuccess: is_deleted } =
    useRemovePromoCode();
  const { data: opt } = usePromoCodeOptions();
  const { data: codes_list, refetch: refetchList } = usePromoCodesList();

  const handleAddPromoCode = (promo_code, number_of_codes) => {
    if (number_of_codes > 1) {
      activatePromoCode({ promo_codes: [promo_code] });
      setPromoCode("");
      setButtonText("Aktiviraj kupon");
    } else {
      activatePromoCode({ promo_codes: [promo_code] });
    }
  };

  const handleDeletePromoCode = (id_promo_code) => {
    if (id_promo_code) {
      deletePromoCode({ id_promo_code: id_promo_code });
      setPromoCode("");
      setButtonText("Aktiviraj kupon");
    }
    return null;
  };

  const handlePromoCode = (action) => {
    if (action === "add") {
      return handleAddPromoCode(promoCode, opt?.number_of_promo_codes);
    }

    if (action === "remove") {
      return handleDeletePromoCode(codes_list?.[0]?.id_promo_code);
    }
  };

  useEffect(() => {
    refetchList();
    queryClient?.invalidateQueries({ queryKey: ["summary"] });
  }, [is_deleted, is_activated]);

  useEffect(() => {
    if (!data?.success) {
      setButtonText("Aktiviraj kupon");
    }

    if (data?.success && opt?.number_of_promo_codes === 1) {
      setButtonText("Ukloni");
    }
  }, [data]);

  useEffect(() => {
    if (codes_list?.length === 1 && opt?.number_of_promo_codes === 1) {
      setButtonText("Ukloni");
      setPromoCode(codes_list?.[0]?.code);
    } else {
      if (opt?.number_of_promo_codes > 1) {
        setButtonText("Aktiviraj kupon");
        setPromoCode("");
      }
    }
  }, [codes_list, opt?.number_of_promo_codes]);

  if (opt?.active) {
    return (
      <div className={`bg-[#f7f7f7] w-full p-2`}>
        <h4 className={`pb-4 text-[14px] font-normal uppercase underline ml-1`}>
          Kupon
        </h4>
        <div className={`flex items-start flex-col gap-5 ml-4`}>
          <input
            disabled={
              opt?.number_of_promo_codes === 1 && codes_list?.length === 1
            }
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            type={`text`}
            className={`uppercase w-full sm:max-w-[390px] py-2 px-3 font-light transition-all duration-200 outline-none border-gray-300 focus:border-gray-300 focus:border-b-2 focus:border-b-black/60 focus:outline-none focus:ring-0  text-gray-800`}
            placeholder={`Ovde unesite vaš kupon`}
          />
          <button
            title={promoCode === "" ? "Unesi kupon" : ""}
            disabled={isPending || promoCode?.length === 0}
            onClick={() => {
              if (
                opt?.number_of_promo_codes === 1 &&
                codes_list?.length === 1
              ) {
                handlePromoCode("remove");
              } else {
                handlePromoCode("add");
              }
            }}
            className={`w-full sm:max-w-[200px] px-5 disabled:opacity-50 text-center uppercase text-black border border-black bg-white py-2 font-light transition-all duration-200 self-stretch hover:bg-black hover:text-white disabled:hover:bg-white disabled:hover:text-black`}
          >
            {buttonText}
          </button>
        </div>
        <div className={`flex flex-col gap-2 my-3`}>
          {codes_list?.length > 0 &&
            opt?.number_of_promo_codes > 1 &&
            codes_list?.map(
              ({
                code,
                id_promo_code: id,
                campaign_data: { calculations },
              }) => {
                let currency =
                  calculations?.[0]?.currency === "percentage"
                    ? "%"
                    : calculations?.[0]?.currency;
                let amount = calculations?.[0]?.discount_value;

                return (
                  <div className={`flex items-center justify-between`}>
                    <p className={`text-[0.965rem] font-medium uppercase`}>
                      {code} (-{amount}
                      {currency})
                    </p>
                    <button
                      onClick={() => deletePromoCode({ id_promo_code: id })}
                      className={`w-full sm:max-w-[200px] text-[0.965rem] font-light underline`}
                    >
                      Ukloni
                    </button>
                  </div>
                );
              }
            )}
        </div>
      </div>
    );
  }
};
