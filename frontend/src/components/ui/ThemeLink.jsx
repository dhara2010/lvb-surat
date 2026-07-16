import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const ThemeLink = ({ children, to, className = '', ...props }) => {
  return (
    <Link to={to} className={`group relative inline-flex font-bold text-sm uppercase tracking-widest text-primary transition-colors duration-300 hover:text-secondary ${className}`} {...props}>
      {children}
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-secondary origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
    </Link>
  );
};

export const ThemeNavLink = ({ children, to, className = '', ...props }) => {
  return (
    <NavLink to={to} className={({ isActive }) => `group relative inline-flex font-bold text-sm uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-secondary' : 'text-primary hover:text-secondary'} ${className}`} {...props}>
      {({ isActive }) => (
        <>
          {typeof children === 'function' ? children({ isActive }) : children}
          <span className={`absolute -bottom-1 left-0 h-[2px] bg-secondary transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-full origin-left scale-x-0 group-hover:scale-x-100'}`}></span>
        </>
      )}
    </NavLink>
  );
};
