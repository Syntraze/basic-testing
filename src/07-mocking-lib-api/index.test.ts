import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.mock('axios');
jest.mock('lodash', () => {
  const original = jest.requireActual('lodash');
  return {
    ...original,
    throttle: (fn: any) => fn, // Immediately execute, bypass delay
  };
});

describe('throttledGetDataFromApi', () => {
  const mockGet = jest.fn();
  const mockAxiosInstance = { get: mockGet };

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/posts');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/users');

    expect(mockGet).toHaveBeenCalledWith('/users');
  });

  test('should return response data', async () => {
    const fakeData = { id: 1, name: 'Test' };
    mockGet.mockResolvedValueOnce({ data: fakeData });

    const result = await throttledGetDataFromApi('/something');

    expect(result).toEqual(fakeData);
  });
});
