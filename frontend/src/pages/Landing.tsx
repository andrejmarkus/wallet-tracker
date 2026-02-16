import { Link } from 'react-router-dom';
import { LiaTelegram } from "react-icons/lia";
import { LuRadar, LuArrowLeftRight } from 'react-icons/lu';
import { motion } from 'framer-motion';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-200 overflow-hidden relative">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hero-content text-center z-10"
        >
          <div className="max-w-2xl">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-6xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary leading-tight mb-4"
            >
              Solana Wallet Tracker
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="py-6 text-xl opacity-80"
            >
              Track any Solana wallet that interests you. Get real-time notifications about their moves
              directly on our platform or through Telegram. Never miss important transactions again.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link to="/register" className="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform duration-200">
                Start Tracking Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Powerful Features
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            <motion.div variants={itemVariants} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300">
              <div className="card-body items-center text-center p-10">
                <div className="bg-primary/10 p-4 rounded-2xl mb-4">
                  <LuRadar size={45} className='text-primary' />
                </div>
                <h3 className="card-title text-2xl mb-2">Custom Tracking</h3>
                <p className="opacity-70 text-lg">Add any Solana wallet address you want to monitor. No limitations on quantity or speed.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300">
              <div className="card-body items-center text-center p-10">
                <div className="bg-secondary/10 p-4 rounded-2xl mb-4">
                  <LiaTelegram size={45} className='text-secondary' />
                </div>
                <h3 className="card-title text-2xl mb-2">Telegram Integration</h3>
                <p className="opacity-70 text-lg">Get instant notifications through our high-performance Telegram bot about any wallet activities.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300">
              <div className="card-body items-center text-center p-10">
                <div className="bg-accent/10 p-4 rounded-2xl mb-4">
                  <LuArrowLeftRight size={45} className='text-accent' />
                </div>
                <h3 className="card-title text-2xl mb-2">Real-time Feed</h3>
                <p className="opacity-70 text-lg">View all transactions as they happen in a beautifully designed real-time dashboard.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-linear-to-b from-base-200 to-base-300 py-24"
      >
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6 italic">Ready to gain an edge?</h2>
          <p className="text-xl mb-10 opacity-80">
            Join hundreds of traders who use our tools to track whale movements and profit from trends.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn btn-primary btn-lg shadow-xl hover:scale-105 transition-transform">
              Create Free Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
