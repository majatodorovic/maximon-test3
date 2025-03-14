import { currencyFormat } from "@/helpers/functions";

const CheckoutTotals = ({ className, options, totals, summary, formData }) => {
  return (
    <div className={`flex flex-col pl-2 max-w-[380px]`}>
      <div className={`flex items-center justify-between py-4`}>
        <p className={`${className} text-[14px] font-light`}>
          Ukupna vrednost Vaše korpe:
        </p>
        <p className={`${className} text-[1rem] font-light`}>
          {currencyFormat(totals?.with_vat)}
        </p>
      </div>
      <div
        className={`flex items-center justify-between border-t border-t-white py-4`}
      >
        <p className={`${className} text-[14px] font-light`}>Popust:</p>
        <p className={`${className} text-[1rem] font-light`}>
          {totals?.items_discount_amount + totals?.cart_discount_amount > 0 && (
            <span>-</span>
          )}
          {currencyFormat(
            totals?.items_discount_amount + totals?.cart_discount_amount
          )}
        </p>
      </div>
      {/* <div
        className={`flex items-center justify-between border-t border-t-white py-2`}
      >
        <p className={`${className} text-[14px] font-normal`}>
          Vrednost korpe sa popustom:
        </p>
        <p className={`${className} text-[1rem] font-light`}>
          {currencyFormat(totals?.cart_discount)}
        </p>
      </div> */}
      {totals?.promo_code_amount > 0 && (
        <div
          className={`flex items-center justify-between border-t border-t-white py-4`}
        >
          <p className={`${className} text-[14px] font-light`}>
            Iznos promo koda:
          </p>
          <p className={`${className} text-[1rem] font-light`}>
            -{currencyFormat(totals?.promo_code_amount)}
          </p>
        </div>
      )}
      <div
        className={`flex items-center justify-between border-t border-t-white py-4`}
      >
        <p className={`${className} text-[14px] font-light`}>Dostava:</p>
        <p className={`${className} text-[1rem] font-light`}>
          {currencyFormat(totals?.delivery_amount)}
        </p>
      </div>
      <div
        className={`flex items-center justify-between border-t border-t-white py-4`}
      >
        <p className={`${className} text-[14px] font-bold`}>
          Ukupno za naplatu:
        </p>
        <p className={`${className} text-[1rem] font-bold`}>
          {currencyFormat(totals?.total)}
        </p>
      </div>
    </div>
  );
};

export default CheckoutTotals;
