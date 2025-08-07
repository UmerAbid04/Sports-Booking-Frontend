import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

import { 
  Clock, 
  Copy, 
  Check, 
  Upload, 
  AlertCircle, 
  CreditCard, 
  Smartphone, 
  Building, 
  CheckCircle,
  XCircle,
  ArrowRight,
  Timer,
  FileImage,
  Info,
  Shield,
  Calendar,
  MapPin,
  User
} from 'lucide-react';
import '../styles/CompanyDashboard.css';

const PaymentPage = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [selectedMethod, setSelectedMethod] = useState('easypaisa');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {
    ground: 'N/A',
    company: 'Unknown',
    date: 'N/A',
    time: 'N/A',
    amount: 0,
    location: 'N/A',
    bookingId: null // must be present for API
  };
 
  useEffect(() => {
    console.log("Booking ID from state:", bookingData.bookingId);
  }, []);
  
  useEffect(() => {
    if (!bookingData.bookingId) {
      setError("Invalid booking. Cannot proceed with payment.");
    }
  }, [bookingData.bookingId]);

  // Payment methods data
  const paymentMethods = {
    easypaisa: {
      name: 'EasyPaisa',
      number: '03001234567',
      logo: 'https://i.pinimg.com/564x/b4/7a/5b/b47a5be5083c32e1e79254aae6ffb0af.jpg',
      color: 'green',
      instructions: [
        'Open your EasyPaisa app',
        'Select "Send Money" or "Money Transfer"',
        'Enter the account number provided',
        'Enter the exact amount: ₨' + bookingData.amount,
        'Complete the transaction',
        'Take a screenshot of the confirmation'
      ]
    },
    jazzcash: {
      name: 'JazzCash',
      number: '03009876543',
      logo: 'https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo.png',
      color: 'red',
      instructions: [
        'Open your JazzCash app',
        'Select "Send Money"',
        'Enter the account number provided',
        'Enter the exact amount: ₨' + bookingData.amount,
        'Complete the payment',
        'Take a screenshot of the success message'
      ]
    },
    bank: {
      name: 'Bank Transfer',
      number: '1234567890123456',
      icon: Building,
      color: 'blue',
      instructions: [
        'Login to your mobile banking app',
        'Select "Transfer" or "Send Money"',
        'Enter the account number provided',
        'Enter the exact amount: ₨' + bookingData.amount,
        'Add reference: Your booking ID',
        'Complete the transfer and screenshot the receipt'
      ]
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); 

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTryAgain = () => {
    navigate("/booking"); // Navigate to booking page instead of /bookings
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  // Updated payment proof upload function to match backend expectations
  const uploadPaymentProof = async (bookingId, selectedFile) => {
    const formData = new FormData();
    formData.append('proof', selectedFile); // Backend expects 'file' field name
    
    try {
      const response = await axios.post(
        `https://renderbackend-g73i.onrender.com/api/payment-proof/upload-payment-proof/${bookingId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      console.log('Upload success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      throw error;
    }
  };

  // Payment proof upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PNG, JPG, JPEG, or PDF files only.');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size too large. Please upload a file smaller than 10MB.');
        return;
      }
      
      setUploadedFile(file);
      setStep(3);
      setLoading(true);
      setError(null);
      
      try {
        await uploadPaymentProof(bookingData.bookingId, file);
        setSuccess(true);
      } catch (err) {
        // Enhanced error handling for specific backend errors
        let errorMessage = 'Failed to upload payment proof.';
        
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message.includes('Only images and PDF files are allowed')) {
          errorMessage = 'Invalid file type. Please upload PNG, JPG, JPEG, or PDF files only.';
        } else if (err.message.includes('File too large')) {
          errorMessage = 'File size too large. Please upload a file smaller than 10MB.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Booking not found. Please try again or contact support.';
        } else if (err.response?.status === 400) {
          errorMessage = err.response.data.message || 'Invalid request. Please check your file and try again.';
        }
        
        setError(errorMessage);
        setStep(2); // Go back to upload step
        setUploadedFile(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const currentMethod = paymentMethods[selectedMethod];

  if (timeLeft === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Payment Time Expired</h2>
          <p className="text-gray-400 mb-6">
            Your slot reservation has expired. The slot is now available for other users.
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors" onClick={handleTryAgain}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="admin-card" style={{maxWidth: 420, margin: '4rem auto', textAlign: 'center'}}>
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Uploading Payment Proof...</h2>
          <p className="text-gray-300">Please wait while we process your payment proof.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !bookingData.bookingId) {
    return (
      <div className="dashboard-container">
        <div className="admin-card" style={{maxWidth: 420, margin: '4rem auto', textAlign: 'center'}}>
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button className="admin-btn primary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Success message after payment proof submission
  if (success) {
    return (
      <div className="dashboard-container flex-center">
        <div className="admin-card" style={{maxWidth: 420, margin: '4rem auto', textAlign: 'center'}}>
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Submitted!</h2>
          <p className="text-gray-300 mb-4">Your payment proof has been submitted for review. You will be notified once it is verified.</p>
          <button className="admin-btn primary" onClick={() => window.location.href = '/'}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="admin-card" style={{maxWidth: '900px', margin: '2rem auto 1.5rem auto', padding: '2rem 2.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <div>
            <h1 className="dashboard-title" style={{marginBottom: 0}}>Complete Payment</h1>
            <div className="dashboard-subtitle">Secure your booking with payment</div>
          </div>
          <div className="admin-status-badge pending" style={{fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8}}>
            <Timer style={{marginRight: 6}} /> {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Display error message if any */}
        {error && (
          <div className="admin-list-item" style={{background: 'rgba(239, 68, 68, 0.10)', border: '1px solid #ef4444', borderRadius: 10, marginBottom: 18, fontSize: '0.97rem', color: '#ef4444'}}>
            <AlertCircle style={{marginRight: 8}} /> {error}
          </div>
        )}

        {/* Stepper */}
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
          {[1, 2, 3].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div className={`admin-status-badge ${step >= stepNum ? 'active' : 'inactive'}`} style={{width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', marginRight: stepNum < 3 ? 12 : 0}}>
                {step > stepNum ? <Check /> : stepNum}
              </div>
              {stepNum < 3 && <div style={{width: 40, height: 4, background: step > stepNum ? '#4f8cff' : '#23272f', borderRadius: 2, marginRight: 12}} />}
            </React.Fragment>
          ))}
        </div>
        
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
          {/* Left: Booking Details */}
          <div style={{flex: 1, minWidth: 270, maxWidth: 340}}>
            <div className="admin-card" style={{padding: '1.5rem'}}>
              <h3 className="admin-section-title" style={{display: 'flex', alignItems: 'center', gap: 8}}><Calendar /> Booking Details</h3>
              <div style={{marginBottom: 16}}>
                <div className="dashboard-list-item"><span className="stat-title">Ground</span><span>{bookingData.ground}</span></div>
                <div className="dashboard-list-item"><span className="stat-title">Company</span><span>{bookingData.company}</span></div>
                <div className="dashboard-list-item"><span className="stat-title">Date</span><span>{bookingData.date}</span></div>
                <div className="dashboard-list-item"><span className="stat-title">Time</span><span>{bookingData.time}</span></div>
                <div className="dashboard-list-item"><span className="stat-title">Location</span><span style={{display: 'flex', alignItems: 'center', gap: 4}}><MapPin style={{width: 16}} />{bookingData.location}</span></div>
              </div>
              <div className="dashboard-list-item" style={{borderTop: '1px solid #23272f', paddingTop: 12, marginTop: 12, justifyContent: 'space-between'}}>
                <span className="stat-title">Total Amount</span>
                <span className="stat-value" style={{color: '#4ade80'}}>₨{bookingData.amount}</span>
              </div>
              <div className="admin-list-item" style={{background: 'rgba(202, 138, 4, 0.10)', border: '1px solid #fbbf24', borderRadius: 10, marginTop: 18, fontSize: '0.97rem', color: '#fbbf24'}}>
                <AlertCircle style={{marginRight: 8}} /> Important: Complete payment before time expires.
              </div>
            </div>
          </div>
          
          {/* Right: Payment Process */}
          <div style={{flex: 2, minWidth: 320}}>
            {/* Payment Method Selection */}
            <div className="admin-card" style={{marginBottom: 18, padding: '1.5rem'}}>
              <h3 className="admin-section-title">Select Payment Method</h3>
              <div style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 0}}>
                {Object.entries(paymentMethods).map(([key, method]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedMethod(key);
                      setStep(Math.max(1, step));
                    }}
                    className={`admin-btn${selectedMethod === key ? ' primary' : ''}`}
                    style={{
                      width: 120,
                      height: 110,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      fontWeight: 500,
                      fontSize: '0.98rem',
                      background: 'none',
                      boxShadow: selectedMethod === key ? '0 0 0 2px #4f8cff' : 'none',
                      border: selectedMethod === key ? '2px solid #4f8cff' : '1.5px solid #444857',
                      padding: 0,
                      borderRadius: 14,
                      margin: 0,
                    }}
                  >
                    {method.logo ? (
                      <div style={{
                        background: '#fff',
                        borderRadius: 10,
                        padding: 6,
                        boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)',
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <img src={method.logo} alt={method.name + ' logo'} style={{height: 28, width: 'auto', display: 'block'}} />
                      </div>
                    ) : (
                      method.icon && <method.icon style={{fontSize: 22, color: selectedMethod === key ? '#4f8cff' : '#bdbdbd'}} />
                    )}
                    {method.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Payment Instructions */}
            <div className="admin-card" style={{marginBottom: 18, padding: '1.5rem'}}>
              <h3 className="admin-section-title" style={{display: 'flex', alignItems: 'center', gap: 8}}><Info /> Payment Instructions</h3>
              <div className="admin-list-item" style={{background: '#23272f', borderRadius: 8, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span className="stat-title">Account Number</span>
                <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <span style={{fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem'}}>{currentMethod.number}</span>
                  <button className="admin-btn" style={{padding: '0.2rem 0.7rem', fontSize: '0.97rem'}} onClick={() => copyToClipboard(currentMethod.number)}><Copy />{copySuccess || 'Copy'}</button>
                </span>
              </div>
              <div style={{marginBottom: 16}}>
                {currentMethod.instructions.map((instruction, idx) => (
                  <div key={idx} className="admin-list-item" style={{background: 'none', color: '#bdbdbd', fontSize: '0.97rem', padding: 0, marginBottom: 6}}>
                    <span className="admin-status-badge active" style={{width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', marginRight: 10}}>{idx+1}</span>
                    {instruction}
                  </div>
                ))}
              </div>
              <div className="admin-list-item" style={{background: 'rgba(59, 130, 246, 0.10)', border: '1px solid #60a5fa', borderRadius: 10, color: '#60a5fa', fontSize: '0.97rem'}}>
                <Shield style={{marginRight: 8}} /> Only send money to the account number provided above.
              </div>
              <button
                onClick={() => setStep(2)}
                className="admin-btn primary"
                style={{width: '100%', marginTop: 18, fontSize: '1.1rem'}}
              >
                I've Sent the Payment <ArrowRight style={{marginLeft: 8}} />
              </button>
            </div>
            
            {/* File Upload Section */}
            {step >= 2 && (
              <div className="admin-card" style={{padding: '1.5rem'}}>
                <h3 className="admin-section-title" style={{display: 'flex', alignItems: 'center', gap: 8}}><Upload /> Upload Payment Proof</h3>
                <div style={{border: '2px dashed #444857', borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 18}}>
                  <input
                    type="file"
                    accept="image/*,.pdf" // Updated to accept PDFs
                    onChange={handleFileUpload}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label htmlFor="payment-proof" style={{cursor: 'pointer'}}>
                    {uploadedFile ? (
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
                        <div style={{width: 64, height: 64, background: 'rgba(34,197,94,0.10)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <CheckCircle style={{width: 36, height: 36, color: '#4ade80'}} />
                        </div>
                        <span style={{color: '#4ade80', fontWeight: 600}}>File uploaded successfully!</span>
                        <span style={{color: '#bdbdbd', fontSize: '0.97rem'}}>{uploadedFile.name}</span>
                      </div>
                    ) : (
                      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
                        <div style={{width: 64, height: 64, background: 'rgba(59,130,246,0.10)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <FileImage style={{width: 36, height: 36, color: '#60a5fa'}} />
                        </div>
                        <span style={{color: '#fff', fontWeight: 600}}>Click to upload payment screenshot</span>
                        <span style={{color: '#bdbdbd', fontSize: '0.97rem'}}>PNG, JPG, PDF up to 10MB</span> {/* Updated text */}
                      </div>
                    )}
                  </label>
                </div>
                {uploadedFile && step < 3 && (
                  <div style={{display: 'flex', gap: 12}}>
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setStep(2);
                      }}
                      className="admin-btn"
                    >
                      Upload Different File
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
