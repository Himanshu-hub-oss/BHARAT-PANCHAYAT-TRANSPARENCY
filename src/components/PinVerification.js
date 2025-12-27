import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function PinVerification({ onSuccess, onBack }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function verifyPin() {
    setLoading(true);
    setError(false);

    // Artificial delay for premium feel
    await new Promise(r => setTimeout(r, 600));

    if (pin.trim() === "1234") {
      onSuccess();
    } else {
      setError(true);
      setPin("");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden">
      {/* Background with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] scale-110"
        style={{ backgroundImage: `url('/hero_image.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[48px] border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center">

          {/* Header Icon */}
          <motion.div
            whileHover={{ rotate: 15 }}
            className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-2xl ${error ? 'bg-rose-500 text-white animate-shake' : 'bg-emerald-500 text-white'
              }`}
          >
            {error ? <FaExclamationCircle /> : <FaLock />}
          </motion.div>

          <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Officer Access</h2>
          <p className="text-white/60 font-medium mb-10 text-center text-sm leading-relaxed">
            Secure biometric bypass. Please enter the master authorization PIN.
          </p>

          <div className="w-full space-y-6">
            <div className="relative group">
              <input
                type="password"
                className={`w-full bg-white/5 border-2 ${error ? 'border-rose-500/50' : 'border-white/10 group-hover:border-white/30'
                  } p-5 rounded-3xl text-center text-3xl tracking-[0.8em] text-white focus:outline-none focus:border-emerald-500/50 transition-all font-black placeholder:text-white/10 placeholder:tracking-normal placeholder:text-sm`}
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setError(false);
                  setPin(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && pin.length >= 4 && verifyPin()}
                autoFocus
                maxLength={4}
                disabled={loading}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-8 left-0 right-0 text-center text-rose-400 text-xs font-black uppercase tracking-widest"
                  >
                    Authorization Failed
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white/80 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all border border-white/5"
              >
                <FaArrowLeft /> Back
              </motion.button>

              <motion.button
                whileHover={pin.length >= 4 ? { scale: 1.05, x: 5 } : {}}
                whileTap={pin.length >= 4 ? { scale: 0.95 } : {}}
                onClick={verifyPin}
                disabled={pin.length < 4 || loading}
                className={`flex-[1.5] py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${pin.length < 4 || loading
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-emerald-500/20'
                  }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Authorize Access <FaCheckCircle /></>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-10 flex justify-center items-center gap-2 opacity-30 grayscale">
          <div className="w-8 h-[2px] bg-white rounded-full"></div>
          <div className="text-[10px] text-white font-black tracking-[0.3em] uppercase">Security Level 4</div>
          <div className="w-8 h-[2px] bg-white rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
}
