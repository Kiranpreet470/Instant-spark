import React, { useState } from 'react';
import { X, CreditCard, Gift, CheckCircle2, Loader2, Wallet } from 'lucide-react';
import { User } from '../types';

interface PaymentModalProps {
  recipient: User;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ recipient, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number>(50); // Default 50
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');

  const handlePayment = () => {
    setStep('processing');
    
    // Simulate Razorpay Gateway Delay
    setTimeout(() => {
        // In a real app, this is where Razorpay options would open
        // var options = { "key": "YOUR_KEY_ID", "amount": amount * 100 ... }
        // var rzp1 = new Razorpay(options);
        // rzp1.open();
        
        setStep('success');
    }, 2000);
  };

  const handleFinish = () => {
    onSuccess(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white text-black w-full max-w-sm rounded-xl overflow-hidden shadow-2xl relative">
        
        <div className="bg-[#2b2f96] p-4 flex items-center justify-between text-white">
           <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider">Razorpay</span>
              <span className="text-[10px] bg-white/20 px-1 rounded">Trusted Business</span>
           </div>
           <button onClick={onClose} className="hover:bg-white/10 rounded p-1"><X size={20}/></button>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-2 overflow-hidden border-2 border-yellow-400">
                  <img src={recipient.avatar} alt={recipient.username} className="w-full h-full object-cover"/>
                </div>
                <h3 className="font-bold text-lg">Gift to {recipient.username}</h3>
                <p className="text-gray-500 text-xs">Support this creator</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                 {[50, 100, 500].map((val) => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`py-3 rounded-lg border-2 font-bold text-sm transition-all ${amount === val ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600'}`}
                    >
                      ₹{val}
                    </button>
                 ))}
              </div>
              
              <div className="mb-6">
                 <label className="text-xs text-gray-500 font-bold uppercase">Custom Amount (INR)</label>
                 <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg py-2 pl-8 pr-4 outline-none focus:border-blue-500 font-bold"
                    />
                 </div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>Pay Now</span>
                <span className="bg-blue-800/40 px-2 py-0.5 rounded text-xs">₹{amount}</span>
              </button>
              
              <div className="mt-4 flex justify-center gap-4 opacity-50">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/1024px-Apple_Pay_logo.svg.png" className="h-4" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4" />
              </div>
            </>
          )}

          {step === 'processing' && (
             <div className="flex flex-col items-center justify-center py-8">
                <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
                <h3 className="font-bold text-lg text-gray-800">Processing Payment...</h3>
                <p className="text-gray-500 text-sm">Please do not close this window</p>
             </div>
          )}

          {step === 'success' && (
             <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-1">Payment Successful!</h3>
                <p className="text-gray-500 text-sm mb-6">You sent <span className="font-bold text-gray-800">₹{amount}</span> to {recipient.username}.</p>
                
                <div className="bg-gray-50 w-full p-4 rounded-lg mb-6 text-left border border-gray-100">
                   <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-500">Transaction ID</span>
                      <span className="font-mono text-gray-700">rzp_test_{Math.floor(Math.random()*10000)}</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Date</span>
                      <span className="text-gray-700">{new Date().toLocaleDateString()}</span>
                   </div>
                </div>

                <button 
                  onClick={handleFinish}
                  className="w-full bg-black text-white font-bold py-3 rounded-lg"
                >
                  Done
                </button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;