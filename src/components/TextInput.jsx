import React from "react";

function TextInput({
  label,
  register,
  type,
  placeholder,
  styles,
  name,
  error,
  labelStyles,
}) {
  return (
    <div className="flex flex-col mt-2 w-full">
      {label && (
        <p className={`text-ascent-2 mb-2 text-sm ${labelStyles}`}>{label}</p>
      )}
      <div>
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          {...register}
          className={`bg-secondary text-sm border rounded border-[#66666690] text-ascent-1 outline-none px-4 py-3 placeholder:text-[#666] ${styles}`}
          aria-invalid={error ? "true" : "false"}
        />
        {error && (
          <span className="text-xs mt-0.5 text-[#f64949fe]">{error}</span>
        )}
      </div>
    </div>
  );
}

export default TextInput;
