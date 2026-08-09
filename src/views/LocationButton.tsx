import React from 'react';

interface LocationButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function LocationButton({ onClick, disabled = false }: LocationButtonProps) {
  return (
    <button
      className="location-button"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Use my location
    </button>
  );
}
