import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('evolution table widget', () => {
  test('renders table with calculated values', () => {
    render(<App />);
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(6);
    expect(rows[1].cells[0]).toHaveTextContent('0.50');
    expect(rows[1].cells[1]).toHaveTextContent('0.77');
  });
});
