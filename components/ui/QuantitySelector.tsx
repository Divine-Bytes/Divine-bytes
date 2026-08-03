'use client';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function QuantitySelector({ value, min = 1, max = 99, onChange, disabled }: QuantitySelectorProps) {
  const decrement = () => { if (value > min) onChange(value - 1); };
  const increment = () => { if (value < max) onChange(value + 1); };

  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={decrement}
        disabled={disabled || value <= min}
        className="flex items-center justify-center w-11 h-11 text-dark-gray hover:bg-gray-50
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold"
      >
        <span className="text-xl leading-none" aria-hidden>−</span>
      </button>
      <span
        className="w-12 text-center font-body font-medium text-dark-gray text-base select-none"
        aria-live="polite"
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={increment}
        disabled={disabled || value >= max}
        className="flex items-center justify-center w-11 h-11 text-dark-gray hover:bg-gray-50
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold"
      >
        <span className="text-xl leading-none" aria-hidden>+</span>
      </button>
    </div>
  );
}
