import { useEffect, useState } from 'react';

export default function useLineData(R1, R2, E, E_formula) {
  const [lineData, setLineData] = useState([]);
  useEffect(() => {
    setLineData([
      { label: 'R1', value: R1 },
      { label: 'R2', value: R2 },
      { label: 'E', value: E },
      { label: 'E_formula', value: E_formula }
    ]);
  }, [R1, R2, E, E_formula]);
  return lineData;
}
