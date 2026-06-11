import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from '../icons';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  searchable?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  icon,
  placeholder = 'Select...',
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      setSearchTerm(''); // Reset search term when closed
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`transition-standard hover-pixel-pop ${isOpen ? 'active-pixel-pop' : ''}`}
        style={{
          width: '100%',
          padding: '8px 12px',
          paddingLeft: icon ? '28px' : '12px',
          borderRadius: '10px',
          background: isOpen ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
          border: isOpen ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.05)',
          color: 'var(--color-text)',
          fontSize: '0.75rem',
          outline: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s',
        }}
      >
        {icon && (
          <div style={{ position: 'absolute', left: '10px', display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        )}
        <span style={{ color: selectedOption ? 'var(--color-text)' : 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            background: 'rgba(15, 18, 22, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
          }}
        >
          {searchable && (
            <div style={{ padding: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-text)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  outline: 'none',
                }}
              />
            </div>
          )}
          <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '4px' }} className="custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '8px 12px', color: 'var(--color-text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)',
                      fontSize: '0.8rem',
                      lineHeight: '1.4',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = 'var(--color-text)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--color-text-muted)';
                      }
                    }}
                  >
                    {option.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
