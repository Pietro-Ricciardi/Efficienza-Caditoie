import { salvaParametri, caricaParametri } from '../utils/storage';

describe('salvaParametri e caricaParametri', () => {
  test('salva e ricarica dallo storage', () => {
    const params = { Q: 1 };
    salvaParametri('test', params);
    const { data, error } = caricaParametri('test');
    expect(error).toBeNull();
    expect(data).toEqual(params);
  });

  test('gestisce JSON non valido', () => {
    localStorage.setItem('bad', '{');
    const { data, error } = caricaParametri('bad');
    expect(data).toBeNull();
    expect(error).toBeInstanceOf(Error);
  });
});
