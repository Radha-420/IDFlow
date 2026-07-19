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
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Outer Border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Header - Centered
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138); // Dark blue brand color
    doc.text("ADITYA UNIVERSITY", pageWidth / 2, 28, { align: "center" });
    
    // Subheader
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("08887 76661 | 98496 76662 | info@adityauniversity.in | www.adityauniversity.in", pageWidth / 2, 35, { align: "center" });

    // Badges (NAAC / NBA)
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.roundedRect(pageWidth / 2 - 27, 40, 24, 7, 2, 2);
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text("NAAC A++", pageWidth / 2 - 15, 45, { align: "center" });
    
    doc.roundedRect(pageWidth / 2 + 3, 40, 24, 7, 2, 2);
    doc.text("NBA", pageWidth / 2 + 15, 45, { align: "center" });

    // Divider Line
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 55, pageWidth - 20, 55);

    // Dynamic Variables
    const receiptNo = `AUS${new Date(payment.createdAt).getFullYear().toString().slice(-2)}/${payment.transactionId.slice(-5).toUpperCase()}`;
    const date = new Date(payment.createdAt).toLocaleDateString('en-GB');

    // Student Details Grid (using autoTable for perfect alignment)
    autoTable(doc, {
      startY: 60,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2, textColor: [60, 60, 60] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 35 },
        1: { cellWidth: 65 },
        2: { fontStyle: 'bold', cellWidth: 35 },
        3: { cellWidth: 'auto' }
      },
      body: [
        ['Name', `: ${user?.name?.toUpperCase() || 'N/A'}`, 'Branch/Section', `: ${user?.department || 'CSE'} / Sec-@`],
        ['Roll No.', `: ${user?.collegeId || 'N/A'}`, 'Date', `: ${date}`],
        ['Course', `: ${user?.course || 'B.Tech'}`, 'Receipt No', `: ${receiptNo}`],
      ],
      margin: { left: 20, right: 20 }
    });

    // Payment Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [['Sl No', 'Particulars', 'Year/Sem', 'Amount (Rs.)']],
      body: [
        ['1', 'ID Card / Miscellaneous Fee', user?.year || '1', payment.amount.toString()]
      ],
      foot: [['', 'Total Amount', '', payment.amount.toString()]],
      theme: 'grid',
      headStyles: { fillColor: [240, 245, 250], textColor: [30, 58, 138], lineWidth: 0.1, fontStyle: 'bold' },
      bodyStyles: { textColor: [60, 60, 60], lineWidth: 0.1 },
      footStyles: { fillColor: [240, 245, 250], textColor: [30, 58, 138], lineWidth: 0.1, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 90 },
        2: { cellWidth: 25, halign: 'center' },
        3: { halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    const amountInWords = payment.amount === 100 ? "One Hundred" : payment.amount.toString();
    
    // Bottom Details Grid
    autoTable(doc, {
      startY: finalY,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2, textColor: [60, 60, 60] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30 },
        1: { cellWidth: 'auto' }
      },
      body: [
        ['Rupees', `: ${amountInWords} Only`],
        ['Mode', `: ${payment.paymentMethod || 'Online Payment'}`],
        ['Narration', `: PIN Number Card Generation`],
        ['Balance Due', `: 0`],
      ],
      margin: { left: 20 }
    });

    // Authorized Signature
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Authorized Signatory", pageWidth - 45, finalY + 15, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("(M MANIKANTA)", pageWidth - 45, finalY + 25, { align: "center" });
    
    // Digital Stamp outline
    doc.setDrawColor(220, 220, 230);
    doc.setLineWidth(0.5);
    doc.roundedRect(pageWidth - 75, finalY + 5, 60, 26, 3, 3);
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text("Digitally Verified", pageWidth - 45, finalY + 3, { align: "center" });

    // Footer Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Powered by www.webprosindia.com", 20, pageHeight - 15);
    
    const printDate = new Date().toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).replace(',', '');
    
    doc.text(`Printed on ${printDate}`, pageWidth - 20, pageHeight - 15, { align: "right" });

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
