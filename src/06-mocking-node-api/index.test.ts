import path from 'path';
import fs from 'fs';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

const dummy = () => 0;
const TIMEOUT_DURATION = 1500;

describe('doStuffByTimeout', () => {
  let spyTimeout: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    spyTimeout = jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('sets timeout with provided callback and duration', () => {
    doStuffByTimeout(dummy, TIMEOUT_DURATION);
    expect(spyTimeout).toHaveBeenCalledWith(dummy, TIMEOUT_DURATION);
  });

  test('calls callback only after timeout', () => {
    const providedCallback = jest.fn(dummy);
    doStuffByTimeout(providedCallback, TIMEOUT_DURATION);

    expect(providedCallback).not.toBeCalled();

    jest.advanceTimersByTime(TIMEOUT_DURATION);
    expect(providedCallback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let spyInterval: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    spyInterval = jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('sets interval with provided callback and duration', () => {
    doStuffByInterval(dummy, TIMEOUT_DURATION);
    expect(spyInterval).toHaveBeenCalledWith(dummy, TIMEOUT_DURATION);
  });

  test('calls callback multiple times after successive intervals', () => {
    const providedCallback = jest.fn(dummy);
    doStuffByInterval(providedCallback, TIMEOUT_DURATION);

    expect(providedCallback).not.toBeCalled();

    // Loop to simulate multiple intervals and check call counts
    for (let i = 1; i <= 5; i++) {
      jest.advanceTimersByTime(TIMEOUT_DURATION);
      expect(providedCallback).toHaveBeenCalledTimes(i);
    }
  });
});

describe('readFileAsynchronously', () => {
  const mockFilePath = 'test.txt';
  const mockFileContent = 'test file content';
  let mockJoin: jest.SpyInstance;
  let mockExistsSync: jest.SpyInstance;
  let mockReadFile: jest.SpyInstance;

  beforeEach(() => {
    mockJoin = jest.spyOn(path, 'join');
    mockExistsSync = jest.spyOn(fs, 'existsSync');
    mockExistsSync.mockReturnValue(false);
    mockReadFile = jest.spyOn(fs.promises, 'readFile');
    mockReadFile.mockResolvedValue(mockFileContent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('calls join with provided file path', async () => {
    await readFileAsynchronously(mockFilePath);
    expect(mockJoin).toHaveBeenCalled();
  });

  test('returns null if file does not exist', async () => {
    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBeNull();
  });

  test('returns file content if file exists', async () => {
    mockExistsSync.mockReturnValueOnce(true);
    const result = await readFileAsynchronously(mockFilePath);
    expect(result).toBe(mockFileContent);
  });
});
