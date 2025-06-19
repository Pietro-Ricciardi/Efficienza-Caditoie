import { salvaParametri, caricaParametri } from '../utils/storage';

describe('salvaParametri e caricaParametri', () => {
  test('salva e ricarica dallo storage', () => {
    const params = { Q: 1 };
    salvaParametri('test', params);
    const loaded = caricaParametri('test');
    expect(loaded).toEqual(params);
  });
});
