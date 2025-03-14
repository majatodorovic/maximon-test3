"use client";

import { icons } from "@/_lib/icons";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/api";

export const Input = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  errors,
  data,
  id,
  required,
  options,
  fill,
  inputClass
}) => {
  switch (type) {
    case "email":
    case "text":
    case "password":
      return (
        <TextInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          type={type}
          value={value}
          errors={errors}
          required={required}
          inputClass={inputClass}
        />
      );
    case "select":
      return (
        <SelectInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          value={value}
          errors={errors}
          options={options}
          required={required}
          fill={fill}
        />
      );
    case "date":
      return (
        <DateInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          value={value}
          errors={errors}
          required={required}
        />
      );
    case "checkbox":
      return (
        <CheckboxInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          value={value}
          errors={errors}
          required={required}
        />
      );
    case "textarea":
      return (
        <TextareaInput
          name={name}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          data={data}
          value={value}
          errors={errors}
          required={required}
        />
      );
  }
};

export const TextInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  type,
  required,
  inputClass
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`mb-5 max-sm:col-span-full ${inputClass}`}>
      <div className={`relative`}>
        <input
          value={value ?? data?.[name] ?? ""}
          name={name}
          onChange={(e) => {
            onChange(e);
          }}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          id={id}
          className={`peer p-2 border border-gray-300 focus:border-gray-300 focus:border-b-2 focus:border-b-black/60 focus:outline-none focus:ring-0 w-full h-[48px] text-gray-800 text-center ${
            (errors ?? [])?.includes(name) ? "!border-red-500" : ""
          }`}
        />
        <label
          htmlFor={name}
          className={`absolute uppercase left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base  peer-focus:text-xs peer-focus:text-black peer-focus:top-3
            ${value ? " text-xs text-black top-3" : ""}`}
        >
          {placeholder}
          {required && <span className={`text-xs text-red-500`}>*</span>}
        </label>
      </div>

      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-2 top-2`}
          title={`Prikaži lozinku`}
        >
          {showPassword ? icons["eyeopen"] : icons["eye_closed"]}
        </button>
      )}
      {required && errors?.includes(name) && (
        <div className={`text-red-500 text-xs absolute mt-0`}>
          Ovo polje je obavezno.
        </div>
      )}
    </div>
  );
};

export const SelectInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  options,
  required,
  fill,
  className,
}) => {
  const { data: opt } = useQuery({
    queryKey: ["options", name, fill],
    queryFn: async () => {
      return await get(`${fill}`)?.then((res) => res?.payload);
    },
    enabled: fill?.length > 0,
  });

  return (
    <div className={`relative mb-5 max-sm:col-span-full ${className}`}>
      <select
        // value={value ?? data?.[name]}
        name={name}
        onChange={(e) => onChange(e)}
        id={id}
        className={`peer p-2 border border-gray-300 focus:border-gray-300 focus:border-b-2 focus:border-b-black/60 focus:outline-none focus:ring-0 w-full h-[48px] text-gray-800 text-center ${
          (errors ?? [])?.includes(name) ? " !border-red-500" : ""
        }`}
      >
        {(opt ?? options ?? []).map((option) => (
          <option key={option?.id} value={option?.id}>
            {option?.name}
          </option>
        ))}
      </select>

      <label
        htmlFor={name}
        className={`absolute uppercase left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base  peer-focus:text-xs peer-focus:text-black peer-focus:top-3
            ${value ? " text-xs text-black top-3" : ""} ${className}`}
      >
        {placeholder}
        {required && <span className={`text-xs text-red-500`}>*</span>}
      </label>

      {required && errors?.includes(name) && (
        <div className={`text-red-500 text-xs absolute mt-0`}>
          Ovo polje je obavezno.
        </div>
      )}
    </div>
  );
};

export const DateInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  required,
}) => {
  return (
    <div className={`mb-5 max-sm:col-span-full`}>
      <label
        htmlFor={name}
        className={`block text-sm font-normal text-gray-500`}
      >
        {placeholder}
        {required && <span className={`text-xs text-red-500`}>*</span>}
      </label>
      <input
        value={value ?? data?.[name]}
        name={name}
        onChange={(e) => onChange(e)}
        type={"date"}
        id={id}
        className={`mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#04b400] sm:text-sm focus:border-transparent text-base ${
          (errors ?? [])?.includes(name) ? "!border-red-500" : ""
        }`}
      />
      {required && errors?.includes(name) && (
        <div className={`text-red-500 text-xs absolute mt-0`}>
          Ovo polje je obavezno.
        </div>
      )}
    </div>
  );
};

export const CheckboxInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  required,
  className,
}) => {
  return (
    <div className={`flex flex-col gap-0 my-auto col-span-full ${className}`}>
      <div className={`flex items-center flex-row-reverse justify-end gap-2`}>
        <label
          htmlFor={name}
          className={`block text-sm font-normal text-gray-500`}
        >
          {placeholder}
          {required && <span className={`text-xs text-red-500`}>*</span>}
        </label>
        <input
          checked={value ?? data?.[name]}
          name={name}
          onChange={(e) => onChange(e)}
          type={"checkbox"}
          id={id}
          className={`h-5 w-5 block border border-gray-300 shadow-sm  focus:ring-transparent sm:text-sm focus:border-black text-base text-black ${
            (errors ?? [])?.includes(name) ? "!border-red-500" : ""
          }`}
        />
      </div>
      {required && errors?.includes(name) && (
        <div className={`text-red-500 text-xs absolute mt-0`}>
          Ovo polje je obavezno.
        </div>
      )}
    </div>
  );
};

export const TextareaInput = ({
  name,
  id,
  onChange,
  placeholder,
  data,
  value,
  errors,
  required,
}) => {
  return (
    <div className={`mb-5 max-sm:col-span-full col-span-2`}>
      <div className="relative">
        <textarea
          value={value ?? data?.[name]}
          name={name}
          onChange={(e) => onChange(e)}
          id={id}
          rows={3}
          className={`block peer px-2 py-5 border border-gray-300 focus:border-gray-300 focus:border-b-2 focus:border-b-black/60 focus:outline-none focus:ring-0 w-full text-gray-800 text-left ${
            (errors ?? [])?.includes(name) ? "!border-red-500" : ""
          }`}
        />
        <label
          htmlFor={name}
          className={`absolute uppercase left-2 top-6 transform -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base  peer-focus:text-xs peer-focus:text-black peer-focus:top-4
            ${value ? " text-xs text-black left-2 top-4" : ""}`}
        >
          {placeholder}
          {required && <span className={`text-xs text-red-500`}>*</span>}
        </label>
      </div>
      {required && errors?.includes(name) && (
        <div className={`text-red-500 text-xs absolute mt-0`}>
          Ovo polje je obavezno.
        </div>
      )}
    </div>
  );
};
