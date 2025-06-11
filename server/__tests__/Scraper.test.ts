// __tests__/Scraper.test.ts
import { scrapeAndSave } from '../src/scrapers/exampleScraper';
import * as browserService from '../src/services/browserService';

// Mock browserService methods
jest.mock('../src/services/browserService', () => ({
  launchBrowser: jest.fn(),
  createPage: jest.fn(),
}));

// Mock firebaseConfig to provide a firestore object with collection().add()
jest.mock('../src/config/firebaseConfig', () => {
  const addMock = jest.fn().mockResolvedValue({ id: 'doc123' });
  return {
    firestore: {
      collection: jest.fn().mockImplementation(() => ({ add: addMock })),
    },
  };
});

describe('scrapeAndSave()', () => {
  it('megkapja a HTML-t, és eltárolja a Firestore-ba', async () => {
    // Setup Puppeteer mocks
    const mockPage = {
      goto: jest.fn(),
      content: jest.fn().mockResolvedValue('<html>ok</html>'),
    };
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    // Cast to jest.Mock to access mockResolvedValue
    (browserService.launchBrowser as jest.Mock).mockResolvedValue(mockBrowser);
    (browserService.createPage as jest.Mock).mockResolvedValue(mockPage);

    // Execute the scraper
    const id = await scrapeAndSave('http://example.com', 'testcol');

    // Assertions on Firestore mocks
    const { firestore } = require('../src/config/firebaseConfig');
    expect(firestore.collection).toHaveBeenCalledWith('testcol');
    const addMock = firestore.collection.mock.results[0].value.add;
    expect(addMock).toHaveBeenCalledWith(
      expect.objectContaining({ html: '<html>ok</html>' })
    );
    expect(id).toBe('doc123');
  });
});