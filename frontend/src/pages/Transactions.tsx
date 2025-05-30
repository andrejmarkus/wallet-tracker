import { NavLink } from 'react-router-dom'
import { usePumpPortal } from '../lib/hooks/usePumpPortal'
import { useState } from 'react';
import type { Transaction } from '../types';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  usePumpPortal((transaction: Transaction) => {
    console.log("[WebSocket] Transaction update received:", transaction);
    setTransactions(prev => [...prev, transaction]);
  });

  return (
    <div className='py-4'>
      <p className='text-2xl font-bold'>Transactions</p>
      <NavLink to="/app/wallets" className="btn btn-primary mt-4">Add Solana wallets</NavLink>
      { transactions.map((transaction) => (
        <div key={transaction.signature} className="p-4 rounded base-100 shadow mb-2">
          <h3 className="text-xl font-semibold">Transaction: {transaction.signature}</h3>
          <p className="text-sm">{transaction.tokenAmount} {transaction.tokenSymbol}</p>
        </div>
      ))}
    </div>
  )
}

export default Transactions