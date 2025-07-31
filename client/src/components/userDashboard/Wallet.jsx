import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wallet balance and withdrawal history on mount
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get('/api/educator/wallet'); // Replace with your API route
        setBalance(res.data.balance || 0);
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

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 shadow-md border mt-10">
      <h2 className="text-2xl font-bold text-[#0f5f42] mb-4">My Wallet</h2>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Available Balance</p>
          <p className="text-3xl font-semibold text-green-600">₹{balance}</p>
        </div>
        <button
          onClick={handleWithdraw}
          disabled={loading || balance < 500}
          className={`px-5 py-2 rounded bg-[#c86336] text-white hover:bg-[#a74e29] transition ${
            loading || balance < 500 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processing...' : 'Request Withdrawal'}
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-[#103a35] mb-2">Withdrawal History</h3>
        {withdrawals.length === 0 ? (
          <p className="text-gray-500">No withdrawal history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((entry, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3">₹{entry.amount}</td>
                    <td className="p-3">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          entry.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : entry.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
