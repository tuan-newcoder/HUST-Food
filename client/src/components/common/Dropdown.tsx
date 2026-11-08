import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

export interface DropdownItem {
  id?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items?: DropdownItem[];
  children?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  children,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-56 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {children
            ? children
            : items?.map((item, idx) => (
                <React.Fragment key={item.id || idx}>
                  {item.divider && <div className="my-1 border-t border-slate-100" />}
                  <button
                    type="button"
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors text-left',
                      item.danger
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                </React.Fragment>
              ))}
        </div>
      )}
    </div>
  );
};

