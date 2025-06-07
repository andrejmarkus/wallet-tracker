import { useState } from 'react';
import { usePumpPortal } from '../lib/hooks/usePumpPortal';
import type { Transaction } from '../types';
import TransactionItem from './TransactionItem';

const TransactionsList = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
  
    usePumpPortal((transaction: Transaction) => {
        setTransactions(prev => 
        prev.some(t => t.signature === transaction.signature) 
        ? prev 
        : [transaction, ...prev]
        );
    });

    return transactions.length === 0 ? (
    <div className="card bg-base-100 shadow-md">
        <div className="card-body text-center">
        <h3 className="text-lg font-medium">No transactions yet</h3>
        <p className="text-base-content/60">
            Transactions will appear here once your tracked wallets make some moves
        </p>
        </div>
    </div>
    ) : (
    transactions.map((transaction) => (
        <TransactionItem key={transaction.signature} {...transaction} />
    ))
    )
}

export default TransactionsList