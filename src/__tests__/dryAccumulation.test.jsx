import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DryAccumulation from '../components/DryAccumulation';

describe('DryAccumulation component', () => {
  test('renders inputs and results', () => {
    render(
      <DryAccumulation
        days={5}
        setDays={() => {}}
        zone="residenziale"
        setZone={() => {}}
      />
    );
    expect(screen.getByText('Accumulo secco')).toBeInTheDocument();
    expect(screen.getByText(/Carico lineare/)).toBeInTheDocument();
    expect(screen.getByText(/Carico con saturazione/)).toBeInTheDocument();
  });
});
