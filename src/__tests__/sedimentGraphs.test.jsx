import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SedimentGraphs from '../components/SedimentGraphs';

describe('SedimentGraphs component', () => {
  test('renders all graph widgets', () => {
    const params = { d50: 0.002, rhoS: 2650, h: 1 };
    const sedimentData = { theta: 0.1, rouseP: 0.5, totalLoad: 0.000001 };
    const hydroData = [{ dEff: 0.0022 }];
    render(
      <SedimentGraphs
        params={params}
        sedimentData={sedimentData}
        hydroData={hydroData}
      />
    );
    expect(screen.getByText('Curva del bed-load')).toBeInTheDocument();
    expect(screen.getByText('Profilo di concentrazione')).toBeInTheDocument();
    expect(screen.getByText('Carico totale')).toBeInTheDocument();
    expect(screen.getByText('Impatto bilancio-sedimenti')).toBeInTheDocument();
  });
});
