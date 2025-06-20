import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function Formula({ children }) {
  const spanRef = useRef(null);

  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([spanRef.current]);
    }
  }, [children]);

  return <span ref={spanRef}>{children}</span>;
}

Formula.propTypes = {
  children: PropTypes.string.isRequired
};
