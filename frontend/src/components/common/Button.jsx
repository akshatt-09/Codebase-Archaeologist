import React from 'react';

export function Button({ children, onClick, variant = 'primary', disabled = false, icon: Icon, style }) {
  const styles = {
    primary: { background: '#0ea5e9', color: '#ffffff', border: 'none' },
    secondary: { background: '#181c24', color: '#f0f4fc', border: '1px solid #262c38' },
    danger: { background: '#ef4444', color: '#ffffff', border: 'none' }
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...styles[variant],
        ...style
      }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}