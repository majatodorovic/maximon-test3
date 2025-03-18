"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import { useCart } from "@/hooks/ecommerce.hooks";
import { useIsFetching } from "@tanstack/react-query";

const quantityInputStyle = {
  error: "focus:border-red-600 border-transparent",
  default: "focus:border-black border-transparent",
};

const PlusMinusInput = ({
  quantity,
  setQuantity,
  updateCart,
  id,
  updatingCart,
  size,
}) => {
  const { isFetching: isFetchingCart } = useCart();
  const isFetchingSummary = useIsFetching({ queryKey: ["summary"] });
  const [showInputErrorToolTip, setShowInputErrorTooltip] = useState(false);
  const previousQuantity = useRef(quantity);

  const onPlus = () => {
    if (!isFetchingCart && !isFetchingSummary && !updatingCart) {
      updateCart({
        id: id,
        quantity: quantity + 1,
        type: true,
      });
    }
  };

  const onQuantityInputChange = (e) => {
    if (!isFetchingCart && !isFetchingSummary && !updatingCart) {
      const inputValue = e?.target?.value
        ?.replace(/[^0-9.]/g, "")
        .replace(/^0+/, "");

      if (Number(inputValue) === previousQuantity.current) {
        setQuantity(Number(inputValue));
      }
      if (inputValue) {
        updateCart({
          id: id,
          quantity: inputValue,
        });
        setShowInputErrorTooltip(false);
      } else {
        setQuantity("");
        setShowInputErrorTooltip(true);
      }
    }
  };

  const onQuantityInputBlur = (e) => {
    if (!isFetchingCart && !isFetchingSummary && !updatingCart) {
      const inputValue = e?.target?.value;
      setShowInputErrorTooltip(false);
      if (inputValue === "") {
        setQuantity(previousQuantity.current);
        updateCart({
          id: id,
          quantity: previousQuantity.current,
        });
      }
    }
  };

  const onMinus = () => {
    if (!isFetchingCart && !isFetchingSummary && !updatingCart) {
      if (quantity > 1) {
        updateCart({
          id: id,
          quantity: quantity - 1,
          type: true,
        });
      }
    }
  };

  useEffect(() => {
    if (quantity !== "") {
      previousQuantity.current = quantity;
    }
  }, [quantity]);

  return (
    <div className={`flex items-stretch rounded-md bg-[#f7f7f7] z-20`}>
      <button
        className={`cursor-pointer text-[0.9rem] flex items-center justify-center shrink-0
          ${size && size === "small" ? "w-[28px]" : "w-[32px]"}`}
        onClick={onMinus}
      >
        <span>-</span>
      </button>
      <Tooltip
        title={"Unesite broj koji je veći od 0"}
        arrow
        open={showInputErrorToolTip}
      >
        <input
          type={`text`}
          className={`${
            size && size === "small" ? "h-[24px] w-[30px]" : " w-[50px]"
          }  ${
            quantityInputStyle[showInputErrorToolTip ? "error" : "default"]
          } bg-inherit text-center border-[1px] py-1 px-1 text-[0.9rem] font-normal focus:outline-none focus:ring-0`}
          value={quantity}
          onChange={onQuantityInputChange}
          onBlur={onQuantityInputBlur}
        />
      </Tooltip>
      <button
        className={`cursor-pointer text-[0.9rem] flex items-center justify-center shrink-0 ${
          size && size === "small" ? "w-[28px]" : "w-[32px]"
        }`}
        onClick={onPlus}
      >
        +
      </button>
    </div>
  );
};

export default PlusMinusInput;
