import { esportaParametri, importaParametri } from '../utils/storage';

// Helper to get original createElement
const originalCreateElement = document.createElement.bind(document);

describe('esportaParametri e importaParametri', () => {
  test('esporta in JSON e reimporta correttamente', async () => {
    const params = { Q: 10, Q1: 5 };

    const createObjectURLMock = jest.fn(() => 'blob:url');
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = createObjectURLMock;

    const clickMock = jest.fn();
    jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        el.click = clickMock;
      }
      return el;
    });

    esportaParametri(params);

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    const blob = createObjectURLMock.mock.calls[0][0];
    await expect(blob.text()).resolves.toBe(JSON.stringify(params, null, 2));

    const file = new File([await blob.text()], 'parametri.json', {
      type: 'application/json'
    });
    const imported = await importaParametri(file);
    expect(imported).toEqual(params);

    URL.createObjectURL = originalCreateObjectURL;
    document.createElement.mockRestore();
  });
});
