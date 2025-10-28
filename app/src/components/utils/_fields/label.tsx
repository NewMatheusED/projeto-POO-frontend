import React from "react";

interface LabelProps {
  text: string;
  required?: boolean;
  info?: string;
  styleLabel?: React.CSSProperties;
  tailWindClasses?: string;
}

function Label({
  text,
  required,
  info,
  styleLabel,
  tailWindClasses,
}: LabelProps) {
  return (
    <div className={`flex items-start gap-4`}>
      <label
        className={`font-medium text-sm text-ai-gray ${tailWindClasses || ""} sm:text-base`}
        style={{ ...styleLabel, textTransform: "inherit" }}
      >
        {text}
        {required && <span className="text-ai-accent-red ml-1">*</span>}
      </label>

      {info && <p className="text-xs text-ai-gray-dark">*{info}</p>}
    </div>
  );
}

export default Label;
