import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/Widget.css';

const Widget = forwardRef(function Widget(
  {
    id,
    title,
    children,
    onDragStart,
    onDrop,
    onDragOver,
    collapsed = false,
    onCollapseToggle
  },
  ref
) {
  const [fullscreen, setFullscreen] = useState(false);
  const handleToggle = () => {
    onCollapseToggle && onCollapseToggle(id, !collapsed, title);
  };
  return (
    <div
      id={id}
      className={`chart-box widget${collapsed ? ' collapsed' : ''}${
        fullscreen ? ' fullscreen' : ''
      }`}
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
        <div className="widget-controls">
          <button onClick={handleToggle} aria-label="toggle widget">
            {collapsed ? '+' : '-'}
          </button>
          <button
            onClick={() => setFullscreen((f) => !f)}
            aria-label={fullscreen ? 'shrink widget' : 'expand widget'}
          >
            {fullscreen ? '🗗' : '🗖'}
          </button>
        </div>
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
  collapsed: PropTypes.bool,
  onCollapseToggle: PropTypes.func
};

export default Widget;
