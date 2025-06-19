import React, { useState, forwardRef } from 'react';
import './Widget.css';

const Widget = forwardRef(function Widget(
  { id, title, children, onDragStart, onDrop, onDragOver },
  ref
) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      className="chart-box widget"
      draggable
      onDragStart={() => onDragStart && onDragStart(id)}
      onDrop={(e) => {
        e.preventDefault();
        onDrop && onDrop(id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver && onDragOver(id);
      }}
    >
      <div className="widget-header">
        <span>{title}</span>
        <button onClick={() => setCollapsed((c) => !c)} aria-label="toggle widget">
          {collapsed ? '➕' : '➖'}
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
