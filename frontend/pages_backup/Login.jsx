import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      localStorage.setItem("pravaahya_token", data.token); // Store secure app-level token
      window.location.href = "/profile";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {step === 1 ? (
        <form onSubmit={sendOtp}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email" />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={verifyOtp}>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required placeholder="Enter OTP" />
          <button type="submit">Verify</button>
        </form>
      )}
    </div>
  );
}
