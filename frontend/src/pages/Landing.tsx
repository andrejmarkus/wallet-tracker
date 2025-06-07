import { Link } from 'react-router-dom';
import { LiaTelegram } from "react-icons/lia";
import { LuRadar, LuArrowLeftRight } from 'react-icons/lu';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Solana Wallet Tracker</h1>
            <p className="py-6">
              Track any Solana wallet that interests you. Get real-time notifications about their moves
              directly on our platform or through Telegram. Never miss important transactions again.
            </p>
            <Link to="/register" className="btn btn-primary">Start Tracking</Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <LuRadar size={45} className='text-primary' />
                <h3 className="card-title">Custom Tracking</h3>
                <p>Add any Solana wallet address you want to monitor. No limitations.</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <LiaTelegram size={45} className='text-primary' />
                <h3 className="card-title">Telegram Integration</h3>
                <p>Get instant notifications through our Telegram bot about wallet activities</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <LuArrowLeftRight size={45} className='text-primary' />
                <h3 className="card-title">Real-time Transactions</h3>
                <p>View all transactions as they happen, directly on the platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-base-200 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Track Wallets?</h2>
          <p className="mb-8">
            Start tracking interesting wallets and receive notifications via web or Telegram
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn btn-primary">Start Tracking</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;