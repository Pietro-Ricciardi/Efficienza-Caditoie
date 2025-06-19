import { render, screen } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

describe('App component calculations', () => {
  test('shows calculated values for default parameters', () => {
    render(<App />);
    expect(screen.getByText(/R1 = 1 - 0.3 \(v - v0\) = 0.85/)).toBeInTheDocument();
    expect(screen.getByText(/Q2\* = Q2 × R2 =/)).toBeInTheDocument();
    expect(screen.getByText(/E = \(Q1\* \+ Q2\*\) \/ Q = 0.52/)).toBeInTheDocument();
  });

  test('shows line chart toggle', () => {
    render(<App />);
    expect(screen.getByLabelText('Grafico a linee')).toBeInTheDocument();
  });


  test('line chart displays calculated values', () => {
    render(<App />);
    expect(screen.getByText('R1')).toBeInTheDocument();
    expect(screen.getByText('R2')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getByText('E_formula')).toBeInTheDocument();
  });

  test('export buttons are visible', () => {
    render(<App />);
    expect(screen.getByText('Esporta CSV')).toBeInTheDocument();
    expect(screen.getByText('Esporta Excel')).toBeInTheDocument();
  });

});
