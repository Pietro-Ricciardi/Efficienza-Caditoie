import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('component interactions', () => {
  test('widgets reorder on drag and drop', () => {
    const { container } = render(<App />);
    const getTitles = () =>
      Array.from(container.querySelectorAll('.widget-header span')).map((el) =>
        el.textContent
      );

    // initial order
    expect(getTitles()[0]).toBe('Risultati');

    const pieHeader = screen.getByText('Portate intercettate');
    const resultsWidget = screen.getByText('Risultati').closest('.widget');

    fireEvent.dragStart(pieHeader.parentElement);
    fireEvent.drop(resultsWidget);

    expect(getTitles()[0]).toBe('Portate intercettate');
  });
});
