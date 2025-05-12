import * as partialModule from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');
  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    partialModule.mockOne();
    partialModule.mockTwo();
    partialModule.mockThree();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    partialModule.unmockedFunction();
    expect(spy).toHaveBeenCalledWith('I am not mocked');
    spy.mockRestore();
  });
});
