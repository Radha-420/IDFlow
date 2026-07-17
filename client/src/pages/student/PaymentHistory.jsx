import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const downloadReceipt = (payment) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text('Payment Receipt', 105, 20, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const dateStr = new Date(payment.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    doc.text(`Student Name: ${user?.name || 'N/A'}`, 20, 40);
    doc.text(`PIN Number: ${user?.collegeId || 'N/A'}`, 20, 50);

    doc.text(`Transaction ID: ${payment.transactionId}`, 100, 40);
    doc.text(`Date: ${dateStr}`, 100, 50);
    doc.text(`Status: ${payment.status}`, 100, 60);
    
    autoTable(doc, {
      startY: 80,
      head: [['Description', 'Payment Method', 'Amount']],
      body: [
        ['ID Card Processing Fee', payment.paymentMethod, `Rs. ${payment.amount}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
    });
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a system-generated receipt.', 105, 140, { align: 'center' });
    
    doc.save(`Receipt_${payment.transactionId}.pdf`);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get('/api/student/payment-history');
        setPayments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-pulse w-8 h-8 bg-brand-500 rounded-full"></div></div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500 mt-1">View your past transactions and download receipts.</p>
      </div>

      <div className="card-container overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-600">{payment.transactionId}</td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">₹{payment.amount}</td>
                    <td className="px-6 py-4 text-gray-500">{payment.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'Success' ? 'bg-green-100 text-green-700' :
                        payment.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => downloadReceipt(payment)}
                        className="text-brand-600 hover:text-brand-800 font-medium text-sm flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p>No payments found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
