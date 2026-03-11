import React, { useState, useRef, useEffect, useMemo } from 'react';
import '../styles/dropdown.css'; 

const CustomDropdown = ({ 
  items,
  onChange, 
  placeholder = 'none',
  initialValue = null,
  style = ""
}) => {
  const initialItem = useMemo(() => {
    if (items && items.includes(initialValue)) {
      return initialValue;
    }
    return null;
  }, [items, initialValue]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(initialItem); 
  const dropdownRef = useRef(null);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
    
    if (onChange) {
      onChange(item); 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayText = selectedItem !== null ? selectedItem : placeholder;
  const dropdownItems = useMemo(() => items || [], [items]);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div 
        className={`dropdown-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        role="button"
        tabIndex="0"
      >
        <span>{displayText}</span>
        <span className={`arrow ${isOpen ? 'up' : 'down'}`}>
          &#9660; 
        </span>
      </div>
      
      {isOpen && dropdownItems.length > 0 && (
        <ul className="dropdown-list" role="listbox">
          {dropdownItems.map((item, index) => (
            <li 
              key={item} 
              onClick={() => handleSelect(item)}
              className={`dropdown-item ${selectedItem === item ? 'selected' : ''}`}
              role="option"
              aria-selected={selectedItem === item}
              tabIndex="0"
            >
              {item} 
            </li>
          ))}
        </ul>
      )}
    <style>{style}</style>
    </div>
  );
};

export default CustomDropdown;