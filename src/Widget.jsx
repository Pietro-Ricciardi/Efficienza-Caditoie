import React, { useState, forwardRef } from 'react';
import './Widget.css';

const Widget = forwardRef(function Widget({ title, children }, ref) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="chart-box widget">
      <div className="widget-header">
        <span>{title}</span>
        <button onClick={() => setCollapsed((c) => !c)} aria-label="toggle widget">
          {collapsed ? '+' : '-'}
        </button>
      </div>
      {!collapsed && (
        <div className="widget-body" ref={ref}>
          {children}
        </div>
      )}
    </div>
  );
});

export default Widget;
