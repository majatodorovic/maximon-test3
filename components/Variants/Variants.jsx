"use client";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import { getColorByColorName } from "@/helpers/getColorByColorName";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";

export default function Variants({
  product,
  updateProductVariant,
  updateProductPrice,
  productSlug,
  handleURLChange,
  setSelectedColor,
  selectedColor,
  setVariantOnOff,
  setSelectedOptions,
  setInfoModal,
  setNotSelected
}) {
  let variant_options = product?.data?.variant_options; // niz svih variant_options
  let variant_items = product?.data?.variant_items; // niz svih varijanti proizvoda
  let product_slug = productSlug; // slug proizvoda koji se prikazuje
  let variant_product = null; // krajnji proizvodd koji se prikazuje
  const [selected, setSelected] = useState([]); // niz selektovanih variant_options

  useEffect(() => {
    // setSelected([
    //   {
    //     attribute_key: variant_options[1]?.attribute?.key,
    //     value_key: variant_options[1]?.values[0]?.key,
    //   },
    // ]);
    if (setVariantOnOff) {
      setVariantOnOff(false);
    }
  }, [setVariantOnOff]);

  useEffect(() => {
    setSelectedOptions(selected);
  }, [selected]);

  const [variantOptions, setVariantOptions] = useState(variant_options); // niz variant_options koji se prikazuje
  useEffect(() => {
    if (selected) {
      // uzima item iz variant_items na osnovu slug-a
      let selected_item = getSelectedItem(product_slug);

      // if (!selected_item) {
      //   selected_item = handleVariantFirstOption();
      // }

      // ako postoji item iz variant_items na osnovu slug-a i setuje se selected

      if (selected_item) {
        setSelected(selected_item.variant_key_array);
        setSelectedColor(selected_item.variant_key_array[0]?.value_key);
      }

      if (selected_item) {
        variant_product = selected_item;
        updateProductVariant(variant_product);
      }

      handleVariantOptionChange();
    }
  }, [selected]);

  useEffect(() => {
    if (variant_items.length > 0) {
      const product = variant_items.find((item) => item.slug === productSlug);
      if (product) {
        updateProductVariant(product);
        onChangeHandler(
          product?.variant_key_array[0]?.attribute_key,
          product?.variant_key_array[0]?.value_key
        );
        onChangeHandler(
          product?.variant_key_array[1]?.attribute_key,
          product?.variant_key_array[1]?.value_key
        );
      }
    }
  }, [productSlug, variant_items]);

  // setuje prve opcije variant_options-a ukoliko je firstVariantOption true
  // const handleVariantFirstOption = () => {
  //   if (firstVariantOption && selected.length === 0) {
  //     return variant_items[0];
  //   }
  //   return null;
  // };

  //menja URL na osnovu selektovanih variant_options
  useEffect(() => {
    handleURLChange(product_slug);
  }, [product_slug]);

  // ako nema slug-a u URL-u, uzima prvi item iz variant_items i setuje ga kao selected
  useEffect(() => {
    const getProduct = () => {
      if (!product_slug) {
        variant_product = getSelectedItem(product_slug);
      }
    };
    getProduct();
  }, [product_slug]);

  // uzima item iz variant_items na osnovu slug-a
  const getSelectedItem = (slug) => {
    let t_item = null;
    variant_items?.map((item) => {
      if (item.slug === slug) {
        t_item = item;
      }
    });
    return t_item;
  };

  function getLetterFromString(str) {
    // Match everything after the last hyphen and capture the word or letter
    const match = str?.match(/-(\w+)$/);

    if (match) {
      // Return the captured group (which is the part after the hyphen)
      return match[1];
    }

    return null; // Return null if no match is found
  }

  // funkcija koja variant_options setuje vrednost selected_value, selected i display
  const setVariantOptionsVisible = (data) => {
    let options = [];
    data?.map((item) => {
      let t_item = {
        attribute: item.attribute,
        values: [],
      };

      t_item.attribute["selected_value"] = false;

      item.values.map((value) => {
        let t_val = value;
        t_val["display"] = "show";
        t_val["selected"] = false;

        t_item.values.push(t_val);
      });

      options.push(t_item);
    });

    return options;
  };

  // funkcija koja trazi variant_items koji odgovaraju selektovanim variant_options
  const getSelectedVariants = (selected, variant_items) => {
    let options = [];
    variant_items.map((item) => {
      let t_count = 0;
      if (selected.length) {
        selected.map((temp_condition) => {
          item.variant_key_array.map((temp_variant_key_array) => {
            if (
              temp_condition.attribute_key ==
                temp_variant_key_array.attribute_key &&
              temp_condition.value_key == temp_variant_key_array.value_key
            ) {
              t_count += 1;
            }
          });
        });
      }

      if (t_count == selected.length) {
        options.push(item);
      }
    });
    return options;
  };

  // funkcija koja vraca proizvodd na osnovu selektovanih variant_options
  const getProductVariant = () => {
    let options = getSelectedVariants(selected, variant_items);
    let product = [];
    if (options.length >= 1) {
      product = options[0];
    }

    return product;
  };

  // funkcija koja oznacuje variant_options koja je selektovana
  const selectVariantOptions = (variant_options, attribute_key, value_key) => {
    variant_options.map((item) => {
      if (item.attribute.key == attribute_key) {
        item.values.map((value) => {
          if (value.key == value_key) {
            value.selected = true;
            item.attribute.selected_value = true;
          }
        });
      }
    });
    return variant_options;
  };

  // funkcija koja vraca niz variant_options koji nisu selektovani
  const getNotSelectedVariantOptions = (variant_options) => {
    let options = [];
    variant_options.map((item) => {
      if (!item.attribute.selected_value) {
        options.push(item.attribute.key);
      }
    });
    return options;
  };

  // funkcija koja izbacuje duplikate iz niza
  const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };

  // funkcija koja vraca niz vrednosti za prikaz na osnovu selektovanih variant_options
  const setValuesFromVariantOptions = (
    selected_variants,
    temp_not_selected
  ) => {
    let options = [];
    selected_variants.map((item) => {
      item.variant_key_array.map((variant_key_array) => {
        if (variant_key_array.attribute_key == temp_not_selected) {
          options.push(variant_key_array.value_key);
        }
      });
    });

    return removeDuplicates(options);
  };

  // funkcija koja postavlja vrednosti za prikaz na osnovu selektovanih variant_options
  const setValuesForShowToVariantOptions = (
    variant_options,
    temp_not_selected,
    values_to_show
  ) => {
    variant_options.map((item) => {
      if (item.attribute.key == temp_not_selected) {
        item.values.map((value) => {
          if (values_to_show.indexOf(value.key) == -1) {
            value.display = "hide";
          } else {
            value.display = "show";
          }
        });
      }
    });

    return variant_options;
  };

  // funkcija koja menja stanje variant_options
  const handleVariantOptionChange = () => {
    variant_options = setVariantOptionsVisible(variant_options);
    if (selected.length) {
      let check_selected = [];

      selected.map((temp_select) => {
        variant_options = selectVariantOptions(
          variant_options,
          temp_select.attribute_key,
          temp_select.value_key
        );

        check_selected.push(temp_select);
        let selected_variants = getSelectedVariants(
          check_selected,
          variant_items
        );

        let not_selected = getNotSelectedVariantOptions(variant_options);

        if (not_selected.length) {
          not_selected.map((temp_not_selected) => {
            let values_to_show = setValuesFromVariantOptions(
              selected_variants,
              temp_not_selected
            );
            variant_options = setValuesForShowToVariantOptions(
              variant_options,
              temp_not_selected,
              values_to_show
            );
          });
        }
      });
    }

    setVariantOptions(variant_options);
  };

  // onChangeHandler funkcija za selektovanje variant_options nakon odabira vrednosti
  const onChangeHandler = (attribute_key, value_key) => {
    let temp_selected = selected;

    let temp_selected_item = {
      attribute_key: attribute_key,
      value_key: value_key,
    };

    let temp_index = temp_selected.findIndex(
      (x) => x.attribute_key == temp_selected_item.attribute_key
    );

    if (temp_index > -1) {
      temp_selected[temp_index] = temp_selected_item;
      temp_selected.map((temp_selected_item, index) => {
        if (index > temp_index) {
          temp_selected.splice(index, temp_selected.length - index);
        }
      });
    } else {
      temp_selected.push(temp_selected_item);
    }

    setSelected(temp_selected);
  };
  // useEffect(() => {
  //   if (variant_options?.length === 1) {
  //     updateProductVariant(variant_items[0]);
  //     setSelected(variant_items[0]?.variant_key_array);
  //     console.log("selected item", variant_items[0]?.variant_key_array);
  //     onChangeHandler(
  //       variant_items[0]?.variant_key_array[0]?.attribute_key,
  //       variant_items[0]?.variant_key_array[0]?.value_key
  //     );
  //   }
  // }, [variant_options]);
  return (
    <div className="flex flex-col max-md:gap-7 gap-[25px] max-lg:w-full  ">
      {variantOptions?.map((item, itemIndex) => {
        const velicina = getLetterFromString(selected[itemIndex]?.value_key);
        return (
          <div
            key={itemIndex}
            className="flex flex-col items-start gap-[0.5rem]"
          >
            <div className="w-full flex align-center justify-between">
            <label
          htmlFor={item.id}
          className="max-lg:text-left text-[16px] font-normal min-w-[5.619rem]"
        >
          {item.attribute.name} :
          {/* Check for "Boja" attribute */}
          {item.attribute.name === "Boja" && selectedColor ? (
            <span>&nbsp;{selectedColor.slug}</span>
          ) : null}
          {/* Check for "Veličina" attribute */}
          {/* {item.attribute.name === "Veličina" && velicina ? (
            <span>&nbsp;{velicina}</span>
          ) : item.attribute.name !== "Boja" ? (
            <span>&nbsp;Izaberite boju</span>
          ) : null} */}
        </label>

              {item.attribute.name === "Veličina" && (
                <ul className="flex flex-row gap-[9px] relative separate">
                  <li
                    className="relative cursor-pointer text-[16px] font-normal text-black/70 underline"
                    onClick={() => setInfoModal(true)}
                  >
                    Pomoć za veličine
                  </li>
                </ul>
              )}
            </div>

            <form
              key={item.id}
              id={item.id}
              name={item.attribute.key}
              className="max-md:px-0 flex flex-row gap-[1rem] flex-wrap md:max-w-[80%]"
              // onChange={(e) => {
              //   onChangeHandler(item.attribute.key, e.target.value);
              //   handleVariantOptionChange();
              //   variant_product = getProductVariant();
              //   if (variant_product) {
              //     updateProductVariant(variant_product);
              //     updateProductPrice(variant_product?.price?.price?.original);
              //     handleURLChange(variant_product?.slug);
              //     product_slug = variant_product?.slug;
              //   } else {
              //     updateProductVariant(null);
              //     updateProductPrice(null);
              //   }
              // }}
            >
              {item?.attribute?.name === "Boja"
                ? item.values.map((value) => {
                  
                    let display = value.display;
                    const colorBySlug = getColorByColorName(value.slug);
                    const isSelected = selected.find(
                      (x) =>
                        x.attribute_key == item.attribute.key &&
                        x.value_key == value.key
                    );

                    return (
                      <div
                        key={value.id}
                        className={display === "show" ? `block` : ``}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onChangeHandler(item.attribute.key, value.key);
                            handleVariantOptionChange();
                            variant_product = getProductVariant();
                            if (variant_product) {
                              updateProductVariant(variant_product);
                              handleURLChange(variant_product?.slug);
                              product_slug = variant_product?.slug;
                            }

                            setSelectedColor(value);
                            if(selected.length === variantOptions.length) {
                              setNotSelected(true)
                            } else {
                              setNotSelected(false);
                            }
                          }}
                          value={value.key}
                          selected={value.selected}
                          style={{ display: value.display }}
                          className={
                            display === "show"
                              ? `block text-[0.875rem] button-with-tooltip`
                              : ``
                          }
                          aria-label={value.name}
                        >
                          {value?.image ? (
                            <div className="relative">
                              {value?.image && (
                                <Suspense fallback={<div>Loading...</div>}>
                                  {/* Dodati border-[${colorBySlug}] */}
                                  {isSelected && (
                                    <div
                                      className={`absolute right-0 left-0 m-auto top-0 bottom-0 rounded-full w-[30px] h-[30px] 
                                        bg-transparent border-2  ${
                                        value.name === "BELA"
                                          ? "border-black"
                                          : `border-white`
                                      } `}
                                      
                                    ></div>
                                  )}
                                  <Image
                                    src={convertHttpToHttps(value?.image ?? "")}
                                    alt="Boja"
                                    className="rounded-full h-[32px]"
                                    width={32}
                                    height={32}
                                    style={{
                                      objectFit: "cover",
                                    }}
                                  />
                                </Suspense>
                              )}
                            </div>
                          ) : (
                            <div
                              className={` bg-[#B0B0B0] transition-all duration-500 !text-xs `}
                              style={{
                                borderRadius: "15px",
                                backgroundColor: value?.image ? "" : colorBySlug,
                                border: value?.image
                    ? ""
                    : value.name === "BELA"
                    ? `1px solid #b2b2b2`
                    : "none",
                                padding: "16px",
                                top: "-32px",
                              }}
                            >
                              {isSelected && (
                                    <div
                                      className={`absolute right-0 left-0 m-auto top-0 bottom-0 rounded-full w-[30px] h-[30px] 
                                        bg-transparent border-2  ${
                                        value.name === "BELA"
                                          ? "border-black"
                                          : `border-white`
                                      } `}
                                      
                                    ></div>
                                  )}
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })
                : item.values.map((value) => {
                    let display = value?.display;
                    return (
                      <button
                        key={value.id}
                        value={value.key}
                        selected={value.selected}
                        style={{ display: value.display }}
                        className={
                          display === "show"
                            ? `block text-[14px] ${
                                selected.find(
                                  (x) =>
                                    x.attribute_key === item.attribute.key &&
                                    x.value_key === value.key
                                )
                                  ? `bg-white border border-[#191919]
                           `
                                  : `bg-white border border-transparent hover:border-[#ccc]`
                              } w-[32px] h-[32px] rounded-full text-base`
                            : ``
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          onChangeHandler(item.attribute.key, e.target.value);
                          handleVariantOptionChange();
                          variant_product = getProductVariant();
                          if (variant_product) {
                            updateProductVariant(variant_product);
                            handleURLChange(variant_product?.slug);
                            product_slug = variant_product?.slug;
                          } else {
                            updateProductVariant(null);
                            updateProductPrice(null);
                          }
                          if(selected.length === variantOptions.length) {
                            setNotSelected(true)
                          } else {
                            setNotSelected(false);
                          }
                         
                        }}
                      >
                        {value.name}
                      </button>
                    );
                  })}
            </form>
          </div>
        );
      })}
    </div>
  );
}
