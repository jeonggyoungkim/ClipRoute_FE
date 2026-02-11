interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export default function Checkbox({ checked, onChange, className = "" }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`w-5 h-5 cursor-pointer ${className}`}
    />
  );
}