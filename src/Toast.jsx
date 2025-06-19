import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div className="bg-red-500 text-white px-3 py-2 rounded shadow">{message}</div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
