import { useState, type HTMLInputTypeAttribute } from "react";
import Svg from "~/src/assets/svgs";
import { type InputError } from "./typings";

interface InputProps {
  placeholder?: string;
  required?: boolean;
  value: string | number;
  type?: HTMLInputTypeAttribute;
  error?: InputError;
  onChange?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (params: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  style?: React.CSSProperties;
  min?: number;
  max?: number;
  disabled?: boolean | undefined;
}

export default function Input({
  error,
  placeholder,
  required,
  value,
  type,
  onChange,
  onBlur,
  name,
  style,
  onFocus,
  min,
  max,
  disabled,
}: InputProps) {
  const isValid = required && value && !error?.error;

  const baseClasses =
    "w-full px-3 py-2.5 border border-ai-neon-blue/30 rounded-lg text-sm bg-ai-dark-blue-secondary text-ai-white placeholder:text-ai-gray-dark transition-all duration-300 outline-none backdrop-blur-sm";
  const errorClasses = error?.error
    ? "border-ai-accent-red focus:border-ai-accent-red shadow-lg shadow-ai-accent-red/20"
    : "";
  const successClasses = isValid ? "border-ai-accent-green shadow-lg shadow-ai-accent-green/20" : "";
  const focusClasses = "focus:border-ai-neon-blue focus:shadow-lg focus:shadow-ai-neon-blue/30 focus:ring-2 focus:ring-ai-neon-blue/20";
  const disabledClasses = disabled
    ? "bg-ai-dark-blue-tertiary cursor-not-allowed border-ai-gray-darker text-ai-gray"
    : "";
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="relative w-full">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          placeholder={placeholder}
          required={required}
          className={`${baseClasses} ${errorClasses} ${successClasses} ${focusClasses} ${disabledClasses} ${type === "password" ? "pr-10" : ""}`}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          name={name}
          style={style}
          min={min}
          max={max}
          disabled={disabled}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ai-gray hover:text-ai-neon-blue transition-colors"
          >
            {showPassword ? <Svg.eye /> : <Svg.eye_slash />}
          </button>
        )}
      </div>
      <p
        className={`text-xs text-ai-accent-red min-h-5 mt-1 lg:min-h-[16px] 2xl:min-h-5 transition-opacity ${error?.error ? "opacity-100" : "opacity-0"}`}
      >
        {error?.message || ""}
      </p>
    </>
  );
}
