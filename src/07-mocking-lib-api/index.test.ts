import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
}));

describe('throttledGetDataFromApi', () => {
  let mockGet: jest.Mock;

  beforeEach(() => {
    mockGet = jest.fn().mockResolvedValue({ data: 'mocked data' });
    (axios.create as jest.Mock).mockReturnValue({ get: mockGet });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/posts/1');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/posts/1');
    expect(mockGet).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi('/posts/1');
    expect(result).toBe('mocked data');
  });
});
