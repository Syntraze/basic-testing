import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from './index';

type BankAccountWithMockableFetch = ReturnType<typeof getBankAccount> & {
  fetchBalance: () => Promise<number | null>;
};

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const a1 = getBankAccount(20);
    const a2 = getBankAccount(100);
    expect(() => a1.transfer(50, a2)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const a = getBankAccount(100);
    expect(() => a.transfer(50, a)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const a = getBankAccount(100);
    a.deposit(50);
    expect(a.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const a = getBankAccount(100);
    a.withdraw(30);
    expect(a.getBalance()).toBe(70);
  });

  test('should transfer money', () => {
    const from = getBankAccount(100);
    const to = getBankAccount(50);
    from.transfer(30, to);
    expect(from.getBalance()).toBe(70);
    expect(to.getBalance()).toBe(80);
  });

  test('fetchBalance should return number if request did not fail', async () => {
    const a = getBankAccount(0) as BankAccountWithMockableFetch;
    jest.spyOn(a, 'fetchBalance').mockResolvedValue(42);
    const result = await a.fetchBalance();
    expect(result).toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const a = getBankAccount(0) as BankAccountWithMockableFetch;
    jest.spyOn(a, 'fetchBalance').mockResolvedValue(88);
    await a.synchronizeBalance();
    expect(a.getBalance()).toBe(88);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100) as BankAccountWithMockableFetch;
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
