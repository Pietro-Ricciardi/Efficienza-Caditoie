import { render, screen, fireEvent } from '@testing-library/react';
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
    fireEvent.click(screen.getByText('Aspetto'));
    expect(screen.getByText(/Grafico a linee/)).toBeInTheDocument();
  });

  test('widget toggle button exists', () => {
    render(<App />);
    expect(screen.getAllByLabelText('toggle widget')[0]).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('Azioni'));
    expect(screen.getByText('Esporta CSV')).toBeInTheDocument();
    expect(screen.getByText('Esporta Excel')).toBeInTheDocument();
    expect(screen.getByText('Salva parametri')).toBeInTheDocument();
  });

  test('normativa page is reachable', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Normativa'));
    expect(screen.getByText('Norme Europee (EN)')).toBeInTheDocument();
  });

});
