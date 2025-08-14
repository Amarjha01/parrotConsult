import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchWalletData } from '../../apis/userApi';
import { IoWalletOutline } from "react-icons/io5";
const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wallet balance and withdrawal history on mount
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetchWalletData() 
        console.log(res);
        
        setBalance(res.data.wallet || 0);
        setWithdrawals(res.data.withdrawals || []);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWallet();
  }, []);

  const handleWithdraw = async () => {
    if (balance < 500) {
      alert('Minimum ₹500 required to withdraw.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/educator/request-withdrawal'); // Replace with your API route
      alert('Withdrawal request submitted.');

      // Optionally re-fetch data after request
      const res = await axios.get('/api/educator/wallet');
      setBalance(res.data.balance);
      setWithdrawals(res.data.withdrawals);
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert('Failed to submit withdrawal request.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200',
      approved: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200',
      rejected: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
    };
    
    return statusStyles[status] || statusStyles.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4 text-white text-2xl">
           
             <IoWalletOutline />
          
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            My Wallet
          </h1>
          <p className="text-slate-600">Manage your earnings and withdrawals</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-emerald-100/20 p-8 mb-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/20 to-indigo-100/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            {/* Balance Display */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-slate-600 font-medium">Available Balance</span>
              </div>
              <p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {formatCurrency(balance)}
              </p>
              <p className="text-sm text-slate-500">
                {balance < 500 ? `₹${500 - balance} more needed for withdrawal` : 'Ready for withdrawal'}
              </p>
            </div>

            {/* Withdrawal Button */}
            <div className="flex flex-col items-center lg:items-end gap-3">
              <button
                onClick={handleWithdraw}
                disabled={loading || balance < 500}
                className={`group relative px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform ${
                  loading || balance < 500 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 hover:shadow-lg active:scale-95'
                }`}
              >
                <div className="flex items-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span>Request Withdrawal</span>
                    </>
                  )}
                </div>
              </button>
              <p className="text-xs text-slate-500 text-center">Minimum ₹500 required</p>
            </div>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-blue-100/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-800">Withdrawal History</h3>
                <p className="text-slate-600">{withdrawals.length} transaction{withdrawals.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {withdrawals.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-slate-700 mb-2">No withdrawal history</h4>
                <p className="text-slate-500">Your withdrawal requests will appear here once you make one.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-blue-50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {withdrawals.map((entry, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors duration-200">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              </div>
                              <span className="text-lg font-semibold text-slate-800">
                                {formatCurrency(entry.amount)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-slate-800 font-medium">
                                {new Date(entry.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="text-sm text-slate-500">
                                {new Date(entry.date).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold ${getStatusBadge(entry.status)}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                entry.status === 'pending' ? 'bg-amber-400' :
                                entry.status === 'approved' ? 'bg-emerald-400' : 'bg-red-400'
                              }`}></div>
                              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;