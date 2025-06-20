import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Widget.css';

const Widget = forwardRef(function Widget(
  { id, title, children, onDragStart, onDrop, onDragOver },
  ref
) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      id={id}
      className={`chart-box widget${collapsed ? ' collapsed' : ''}`}
      onDrop={(e) => {
        e.preventDefault();
        onDrop && onDrop(id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver && onDragOver(id);
      }}
    >
      <div
        className="widget-header"
        draggable
        onDragStart={() => onDragStart && onDragStart(id)}
      >
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

Widget.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
  onDragStart: PropTypes.func,
  onDrop: PropTypes.func,
  onDragOver: PropTypes.func,
};

export default Widget;
