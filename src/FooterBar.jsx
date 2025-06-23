import React from 'react';
import PropTypes from 'prop-types';
import './FooterBar.css';

export default function FooterBar({ widgets, onRestore }) {
  if (!widgets.length) return null;
  return (
    <div className="footer-bar">
      {widgets.map((w) => (
        <div
          key={w.id}
          className="footer-item"
          onDoubleClick={() => onRestore(w.id)}
        >
          {w.title}
        </div>
      ))}
    </div>
  );
}

FooterBar.propTypes = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.node.isRequired
    })
  ).isRequired,
  onRestore: PropTypes.func.isRequired
};
