import React from 'react';
import '../../Styles/SearchBar.css'

const FilterItem = ({ label, value, onChange, options }) => (
  <div className="filter-item">
    <div className="filter-label">{label}</div>
    <select className="filter-select" value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default FilterItem;
