import axios from 'axios';
import { fetchViaBrightData } from '../src/services/brightDataService';
import { brightDataConfig } from '../src/config/brightDataConfig';

jest.mock('axios');
const mocked = axios as jest.Mocked<typeof axios>;

describe('fetchViaBrightData()', () => {
  it('helyes payload-dal és headerrel hívja az API-t', async () => {
    mocked.post.mockResolvedValue({ data: '<html></html>' });
    const res = await fetchViaBrightData('http://example.com');
    expect(mocked.post).toHaveBeenCalledWith(
      'https://api.brightdata.com/request',
      { zone: brightDataConfig.zone, url: 'http://example.com', format: 'raw' },
      expect.objectContaining({ headers: expect.any(Object) })
    );
    expect(res).toBe('<html></html>');
  });
});
