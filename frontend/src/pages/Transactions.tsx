import { NavLink } from 'react-router-dom';
import { LiaTelegram } from "react-icons/lia";
import api from '../lib/api';
import { useAuth } from '../lib/context/AuthContext';
import { LuPlus, LuBell } from "react-icons/lu";
import { toast } from 'react-toastify';
import TransactionsList from '../features/transactions/components/TransactionsList';
import PageTransition from '../components/common/PageTransition';
import { motion } from 'framer-motion';

const Transactions = () => {
  const { user, fetchUser } = useAuth();

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
    <PageTransition>
      <div className='min-h-screen bg-base-200/50 pb-20'>
        <div className='container mx-auto px-4 py-12 max-w-5xl'>
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-5xl font-black tracking-tight mb-2"
              >
                Live Feed
              </motion.h1>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-base-content/60 text-lg"
              >
                Real-time transaction activity from your tracked wallets.
              </motion.p>
            </div>

            <motion.div 
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className='flex gap-3'
            >
              <NavLink 
                to="/app/wallets" 
                className="btn btn-primary shadow-lg shadow-primary/20 gap-2"
              >
                <LuPlus size={20} /> Add Wallets
              </NavLink>
              
              { user?.telegramChatId ? (
                <button 
                  className='btn btn-ghost border-base-content/10 gap-2' 
                  onClick={handleUnlinkTelegram}
                >
                  <LuBell className="text-success" /> 
                  Connected
                </button>
              ) : ( 
                <button 
                  className='btn btn-neutral gap-2' 
                  onClick={handleConnectTelegram}
                >
                  <LiaTelegram className="w-5 h-5 text-sky-400" /> 
                  Alerts
                </button>
              )}
            </motion.div>
          </div>

          {/* Stats Bar (Optional visual) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="stats shadow-xl w-full bg-base-100 mb-10 border border-base-content/5"
          >
            <div className="stat">
              <div className="stat-title">Tracked Wallets</div>
              <div className="stat-value text-primary italic">Active</div>
              <div className="stat-desc text-success">Monitoring 24/7</div>
            </div>
            <div className="stat">
              <div className="stat-title">Market Pulse</div>
              <div className="stat-value text-secondary">Solana</div>
              <div className="stat-desc">Mainnet-Beta</div>
            </div>
            <div className="stat">
              <div className="stat-title">Sync Status</div>
              <div className="stat-value text-success flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                </span>
                LIVE
              </div>
              <div className="stat-desc">Listening to Pump.fun</div>
            </div>
          </motion.div>

          {/* List Section */}
          <div className="relative">
            <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-linear-to-b from-primary/50 via-transparent to-transparent hidden lg:block"></div>
            <TransactionsList />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Transactions