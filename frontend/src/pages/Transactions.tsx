import { NavLink } from 'react-router-dom'
import { usePumpPortal } from '../lib/hooks/usePumpPortal'
import { useState } from 'react';
import type { Transaction } from '../types';
import { LiaTelegram } from "react-icons/lia";
import api from '../lib/api';
import { useAuth } from '../lib/context/AuthContext';
import { LuX } from "react-icons/lu";
import { toast } from 'react-toastify';

const Transactions = () => {
  const { user, fetchUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  usePumpPortal((transaction: Transaction) => {
    setTransactions(prev => 
      prev.some(t => t.signature === transaction.signature) 
      ? prev 
      : [...prev, transaction]
    );
  });

  const handleUnlinkTelegram = () => {
    if (!user?.telegramChatId) {
      toast.error("You are not connected to Telegram.");
      return;
    }

    api
    .post('/telegram/unlink')
    .then(async () => {
      toast.success("Telegram unlinked successfully.");
      await fetchUser();
    })
    .catch(() => {
      toast.error("Failed to unlink Telegram. Please try again later.");
    });
  };

  const handleConnectTelegram = () => {
    api
    .get('/telegram/generate-token')
    .then(response => {
      console.log("Telegram token received:", response.data);
      const { token } = response.data.data;
      const telegramUrl = `https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_NAME}?start=${token}`;
      window.open(telegramUrl, '_blank');
    })
    .catch(error => {
      console.error("Failed to connect Telegram:", error);
      alert("Failed to connect Telegram. Please try again later.");
    });
  };

  return (
    <div className='container mx-auto py-4 flex flex-col gap-4'>
      <div>
        <p className='text-2xl font-bold'>Transactions</p>
        <div className='flex gap-4 items-center mt-4'>
          <NavLink to="/app/wallets" className="btn btn-primary">Add Solana wallets</NavLink>
          { user?.telegramChatId ? (
            <button className='btn btn-secondary' onClick={handleUnlinkTelegram}><LuX /> Unlink Telegram</button>
          ) : ( 
            <button className='btn btn-primary' onClick={handleConnectTelegram}><LiaTelegram /> Connect Telegram</button>
          )}
        </div>
      </div>
      { transactions.map((transaction) => (
        <div key={transaction.signature} className="p-4 rounded base-100 shadow mb-2">
          <h3 className="text-xl font-semibold">{transaction.traderPublicKey}</h3>
          <span className="text-sm">{transaction.tokenAmount} </span>
          <a className='text-sm link' href={`https://pump.fun/coin/${transaction.tokenAddress}`} target='_blank'>{transaction.tokenSymbol}</a>
        </div>
      ))}
    </div>
  )
}

export default Transactions