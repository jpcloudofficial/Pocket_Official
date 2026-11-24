export function cashbackDepositAccount(transaction, selectedAccount = '') {
  if (!transaction) return selectedAccount;
  return transaction.type === 'transfer'
    ? transaction.acc
    : selectedAccount || transaction.acc || '';
}
