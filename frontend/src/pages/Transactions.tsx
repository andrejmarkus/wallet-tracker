import { NavLink } from 'react-router-dom';
import { LiaTelegram } from "react-icons/lia";
import api from '../lib/api';
import { useAuth } from '../lib/context/AuthContext';
import { LuX } from "react-icons/lu";
import { toast } from 'react-toastify';
import TransactionsList from '../features/transactions/components/TransactionsList';
import PageTransition from '../components/common/PageTransition';

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
      <div className='min-h-screen bg-base-200'>
        <div className='container mx-auto px-4 py-8'>
          {/* Header Section */}
          <div className="card bg-base-100 shadow-md mb-8">
            <div className="card-body">
              <h2 className="card-title text-3xl mb-4">Transactions</h2>
            <div className='flex flex-wrap gap-4 items-center'>
              <NavLink 
                to="/app/wallets" 
                className="btn btn-primary btn-md"
              >
                Add Solana wallets
              </NavLink>
              { user?.telegramChatId ? (
                <button 
                  className='btn btn-error btn-md' 
                  onClick={handleUnlinkTelegram}
                >
                  <LuX className="w-5 h-5" /> 
                  Unlink Telegram
                </button>
              ) : ( 
                <button 
                  className='btn btn-primary btn-md' 
                  onClick={handleConnectTelegram}
                >
                  <LiaTelegram className="w-5 h-5" /> 
                  Connect Telegram
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="grid gap-4">
          <TransactionsList />
        </div>
      </div>
    </div>
    </PageTransition>
  )
}

export default Transactions