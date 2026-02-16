import { LuExternalLink } from 'react-icons/lu'
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'
import type { Transaction } from '../../../types'
import api from '../../../lib/api'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

const TransactionItem = (transaction: Transaction) => {
  const isBuy = transaction.txType === 'buy'
  const formattedAmount = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(transaction.tokenAmount)
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 6,
  }).format(transaction.tokenUnitPrice || 0)

  const formattedTotalValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(transaction.tokenTotalValue || 0)

  const formattedMarketCap = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    style: 'currency',
    currency: 'USD',
  }).format(transaction.tokenMarketCap || 0)

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const { data: name } = useQuery({
    queryKey: ['wallets', transaction.traderPublicKey],
    queryFn: async () => {
      const response = await api.get(`/wallets/authorized/${transaction.traderPublicKey}`);
      return response.data.data.wallet.name as string | null;
    }
  });

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`group relative card bg-base-100 shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl border border-base-content/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 ${
        isBuy ? 'before:bg-success' : 'before:bg-error'
      }`}
    >
      <div className={`absolute right-0 top-0 w-32 h-32 blur-3xl opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-500 ${
        isBuy ? 'bg-success' : 'bg-error'
      }`}></div>

      <div className="card-body p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl transition-colors duration-300 ${isBuy ? 'bg-success/10 text-success group-hover:bg-success group-hover:text-success-content' : 'bg-error/10 text-error group-hover:bg-error group-hover:text-error-content'}`}>
                {isBuy ? <FiArrowDownRight size={24} /> : <FiArrowUpRight size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight">
                    {isBuy ? 'Bought' : 'Sold'} {transaction.tokenSymbol}
                  </h3>
                  <span className="badge badge-outline badge-sm opacity-50 font-mono">
                    {transaction.tokenName}
                  </span>
                </div>
                <p className="text-sm opacity-60 flex items-center gap-2 mt-0.5">
                  Trader: <span className="font-mono text-primary font-bold">{ name ?? truncateAddress(transaction.traderPublicKey) }</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-base-200/50 p-3 rounded-xl border border-base-content/5 group-hover:border-primary/20 transition-colors">
                <span className="text-[10px] uppercase font-black opacity-40 block mb-1">Amount</span>
                <span className="font-bold text-lg leading-none">{formattedAmount}</span>
              </div>
              <div className="bg-base-200/50 p-3 rounded-xl border border-base-content/5 group-hover:border-primary/20 transition-colors">
                <span className="text-[10px] uppercase font-black opacity-40 block mb-1">Total Value</span>
                <span className={`font-bold text-lg leading-none ${isBuy ? 'text-success' : 'text-error'}`}>{formattedTotalValue}</span>
              </div>
              <div className="bg-base-200/50 p-3 rounded-xl border border-base-content/5 group-hover:border-primary/20 transition-colors">
                <span className="text-[10px] uppercase font-black opacity-40 block mb-1">Unit Price</span>
                <span className="font-bold text-lg leading-none">{formattedPrice}</span>
              </div>
              <div className="bg-base-200/50 p-3 rounded-xl border border-base-content/5 group-hover:border-primary/20 transition-colors">
                <span className="text-[10px] uppercase font-black opacity-40 block mb-1">Market Cap</span>
                <span className="font-bold text-lg leading-none">{formattedMarketCap}</span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col gap-2 shrink-0">
            <a 
              href={`https://solscan.io/tx/${transaction.signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm gap-2 hover:bg-base-content/10"
            >
              <LuExternalLink size={14} /> Solscan
            </a>
            <a
              href={`https://pump.fun/coin/${transaction.tokenAddress}`} 
              target='_blank'
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm gap-2 font-black shadow-lg shadow-primary/20"
            >
              <LuExternalLink size={14} /> Pump.fun
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


export default TransactionItem