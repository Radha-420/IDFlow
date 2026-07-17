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
    
    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ADITYA UNIVERSITY", 40, 25);
    
    // Top right logos / text
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("08887 76661 | 98496 76662", 190, 15, { align: "right" });
    
    // Draw rough boxes for NAAC / NBA
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.roundedRect(145, 18, 25, 8, 3, 3);
    doc.text("NAAC A++", 147, 23);
    doc.roundedRect(175, 18, 15, 8, 3, 3);
    doc.text("NBA", 178, 23);
    
    doc.setFontSize(8);
    doc.text("info@adityauniversity.in | www.adityauniversity.in", 190, 30, { align: "right" });

    // Student Details
    doc.setFontSize(10);
    doc.text("Name", 20, 45); 
    doc.text(`: ${user?.name?.toUpperCase() || 'N/A'}`, 45, 45);
    doc.text("Roll No.", 20, 52); 
    doc.text(`: ${user?.collegeId || 'N/A'}`, 45, 52);
    doc.text("Course", 20, 59); 
    doc.text(`: B.Tech`, 45, 59);
    doc.text("Receipt No", 20, 66); 
    doc.text(`: AUS${new Date(payment.createdAt).getFullYear().toString().slice(-2)}/${payment.transactionId.slice(-5).toUpperCase()}`, 45, 66);

    doc.text("Branch/Section", 110, 52); 
    doc.text(`: ${user?.department || 'CSE'}/Sec-@`, 140, 52);
    doc.text("Date:", 145, 59); 
    doc.text(new Date(payment.createdAt).toLocaleDateString('en-GB'), 155, 59);

    // Table
    autoTable(doc, {
      startY: 75,
      head: [['Sl No', 'Particulars', 'Year/Sem', 'Amount']],
      body: [
        ['1', 'Hallticket/Receipt/Zerox/Id Card', user?.year || '1', payment.amount.toString()]
      ],
      foot: [['', 'Total Amount', '', payment.amount.toString()]],
      theme: 'grid',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, fontStyle: 'normal' },
      bodyStyles: { textColor: [0, 0, 0], lineWidth: 0.1 },
      footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 100 },
        2: { cellWidth: 25, halign: 'center' },
        3: { halign: 'right' }
      }
    });

    // Footer Details
    const finalY = doc.lastAutoTable.finalY + 15;
    
    // Amount in words (simple hardcode for 100 since ID card is always 100, but can be dynamic)
    const amountInWords = payment.amount === 100 ? "One Hundred" : payment.amount.toString();
    
    doc.setFont("helvetica", "normal");
    doc.text("Rupees", 20, finalY); 
    doc.text(`: ${amountInWords} Only`, 45, finalY);
    doc.text("Mode", 20, finalY + 7); 
    doc.text(`: ${payment.paymentMethod || 'Online'}`, 45, finalY + 7);
    doc.text("Narration", 20, finalY + 14); 
    doc.text(`: `, 45, finalY + 14);
    doc.text("Balance Due", 20, finalY + 21); 
    doc.text(`: 0`, 45, finalY + 21);

    // Signature Stamp
    doc.setDrawColor(200, 200, 255);
    doc.setLineWidth(0.5);
    doc.circle(160, finalY + 10, 15, 'S'); // Outer circle
    doc.circle(160, finalY + 10, 13, 'S'); // Inner circle
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 255); // Faint purple/blue for stamp text
    doc.text("Society University", 160, finalY, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    doc.text("Signature", 160, finalY + 10, { align: "center" });
    doc.text("(M MANIKANTA)", 160, finalY + 15, { align: "center" });

    // Bottom Footer
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Powered by www.webprosindia.com", 20, finalY + 40);
    
    const printDate = new Date().toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).replace(',', '');
    
    doc.text(`Printed on ${printDate}`, 150, finalY + 40);

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
