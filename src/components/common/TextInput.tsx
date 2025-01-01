interface TextInputProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
  onChange: (s: string) => void
}

export const TextInput = ({ id, type, label, placeholder, required, onChange }: TextInputProps) => {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded border p-2 text-black"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
