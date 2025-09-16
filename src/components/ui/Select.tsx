import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options = [],
  placeholder = "Select an option",
  className = "",
  ...props
}) => {
  const selectClasses = `
    block w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 
    rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 
    focus:ring-sky-500/20 focus:border-sky-500
    ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}
    ${props.disabled ? "bg-gray-600 cursor-not-allowed opacity-60" : ""}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-100 mb-2">
          {label}
        </label>
      )}
      <select className={selectClasses} {...props}>
        {placeholder && (
          <option value="" disabled className="bg-gray-700 text-gray-100">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-700 text-gray-100">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Select;