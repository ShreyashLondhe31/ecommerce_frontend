import React from 'react';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  required = false, 
  value, 
  onChange,
  placeholder,
  className = '',
  error
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={\`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 
            focus:ring-amber-500 sm:text-sm \${className} \${error ? 'border-red-500' : ''}\`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={\`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 
            focus:ring-amber-500 sm:text-sm \${className} \${error ? 'border-red-500' : ''}\`}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;