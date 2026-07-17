import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ApplyIdCard = () => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasExistingApp, setHasExistingApp] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await axios.get('/api/student/dashboard');
        if (data.application && data.application.applicationStatus !== 'Rejected' && data.application.applicationStatus !== 'Collected') {
          setHasExistingApp(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setPageLoading(false);
      }
    };
    checkStatus();
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create Order
      const { data: order } = await axios.post('/api/payment/create-order');

      // Fetch dynamic Razorpay Config Key
      const { data: config } = await axios.get('/api/payment/config');

      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Check your connection.');
        setLoading(false);
        return;
      }

      const options = {
        key: config.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'PIN Number Portal',
        description: 'Original PIN Number Card Fee',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify Payment
            const { data: verifyData } = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.payment) {
              // Create Application
              await axios.post('/api/student/apply', {
                paymentId: verifyData.payment.paymentId,
              });
              
              toast.success('Application Submitted Successfully!');
              navigate('/student/dashboard');
            }
          } catch (error) {
            toast.error(error.response?.data?.message || 'Payment Verification Failed');
          }
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
          contact: "9999999999"
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error initiating payment');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="flex h-full items-center justify-center"><div className="animate-pulse w-8 h-8 bg-brand-500 rounded-full"></div></div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Apply for ID Card</h1>
        <p className="text-gray-500 mt-1">Pay the fee to generate your original PIN Number card application.</p>
      </div>

      {hasExistingApp ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-amber-800 mb-2">Application Already Exists</h3>
          <p className="text-amber-700 mb-6">You already have an active application. Please wait for it to be processed.</p>
          <button onClick={() => navigate('/student/dashboard')} className="btn-primary bg-amber-600 hover:bg-amber-700 shadow-amber-500/30">
            View Status
          </button>
        </div>
      ) : (
        <div className="card-container overflow-hidden p-0">
          <div className="bg-brand-50/50 border-b border-brand-100 p-6 flex items-center">
            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Fee Payment Details</h3>
              <p className="text-sm text-gray-500">Original PIN Number Card Fee</p>
            </div>
            <div className="ml-auto text-right">
              <span className="text-sm text-gray-500 block">Amount</span>
              <span className="text-2xl font-bold text-brand-600">₹100</span>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-200 cursor-pointer" onClick={() => setAgreed(!agreed)}>
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="agree"
                  name="agree"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="focus:ring-brand-500 h-5 w-5 text-brand-600 border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agree" className="font-medium text-gray-700 cursor-pointer">
                  I agree to pay ₹100 for the Original PIN Number Card.
                </label>
                <p className="text-gray-500 mt-1">This fee is non-refundable. Please ensure all your profile details are correct before proceeding as they will be printed on the ID Card.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                disabled={!agreed || loading}
                onClick={handlePayment}
                className="btn-primary w-full md:w-auto px-8 py-3 text-lg"
              >
                {loading ? 'Initiating Payment...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyIdCard;
