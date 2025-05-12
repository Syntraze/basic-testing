import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';
import { join } from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(setTimeout).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 2000);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(2000);

    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 500);

    expect(setInterval).toHaveBeenCalledWith(callback, 500);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 100);

    jest.advanceTimersByTime(300); // Should be called 3 times
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockPath = '/fake/path.txt';
  const fullPath = '/resolved/fake/path.txt';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    (join as jest.Mock).mockReturnValue(fullPath);
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously(mockPath);

    expect(join).toHaveBeenCalledWith(__dirname, mockPath);
  });

  test('should return null if file does not exist', async () => {
    (join as jest.Mock).mockReturnValue(fullPath);
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(mockPath);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (join as jest.Mock).mockReturnValue(fullPath);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsPromises.readFile as jest.Mock).mockResolvedValue(
      Buffer.from('file content'),
    );

    const result = await readFileAsynchronously(mockPath);
    expect(result).toBe('file content');
  });
});
