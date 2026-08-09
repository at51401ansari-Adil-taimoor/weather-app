import React, { FormEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="search-bar__label" htmlFor="city-search">
        City
      </label>
      <div className="search-bar__controls">
        <input
          id="city-search"
          className="search-bar__input"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter a city name"
          disabled={disabled}
          autoComplete="off"
        />
        <button
          className="search-bar__button"
          type="submit"
          disabled={disabled || !value.trim()}
        >
          Search
        </button>
      </div>
    </form>
  );
}
