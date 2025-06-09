import { LuExternalLink } from 'react-icons/lu'
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'
import type { Transaction } from '../types'
import api from '../lib/api'
import { useQuery } from '@tanstack/react-query'

const TransactionItem = (transaction: Transaction) => {
  const isBuy = transaction.txType === 'buy'
  const formattedAmount = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(transaction.tokenAmount)
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(transaction.tokenTotalValue || 0)

  const formattedMarketCap = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(transaction.tokenMarketCap || 0)

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // TODO: Cache this query for a short time
  // to avoid hitting the API too often
  const { data: name } = useQuery({
    queryKey: ['wallets', transaction.traderPublicKey],
    queryFn: async () => {
      const response = await api.get(`/wallets/authorized/${transaction.traderPublicKey}`);
      console.log(response.data);
      return response.data.data.wallet.name as string | null;
    }
  });

  return (
    <div className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 ${
      isBuy ? 'border-l-success' : 'border-l-error'
    }`}>
      <div className="card-body">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isBuy ? 
                <FiArrowDownRight className="text-success" size={20} /> : 
                <FiArrowUpRight className="text-error" size={20} />
              }
              <h3 className="card-title text-lg font-medium">
                {isBuy ? 'Buy' : 'Sell'} {transaction.tokenSymbol}
              </h3>
            </div>
            
            <div className="text-sm opacity-70">
              by <span className="font-mono">{ name ?? truncateAddress(transaction.traderPublicKey) }</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="font-medium">
                {formattedAmount} 
                <a
                  className='link link-primary ml-1' 
                  href={`https://pump.fun/coin/${transaction.tokenAddress}`} 
                  target='_blank'
                  rel="noopener noreferrer"
                >
                  {transaction.tokenSymbol}
                </a>
              </div>
              <div className="text-sm">
                Price: {formattedPrice}
              </div>
              <div className="text-sm">
                Market Cap: {formattedMarketCap}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch h-full justify-center gap-2">
            <a 
              href={`https://solscan.io/tx/${transaction.signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              <LuExternalLink size={15} /> Solscan
            </a>
            <a
            href={`https://pump.fun/coin/${transaction.tokenAddress}`} 
            target='_blank'
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            >
                <LuExternalLink size={15} /> Pump.fun
            </a>
          </div> 
        </div>
      </div>
    </div>
  )
}

export default TransactionItem