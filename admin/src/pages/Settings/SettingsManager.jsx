import React, { useState } from 'react';
import { SectionHeader, PasswordInputGroup } from '../../components/AdminUI';

export default function SettingsManager({ token }) {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || "Password updated successfully.");
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100 max-w-xl">
      <SectionHeader title="Settings" desc="Update admin configuration and change security credentials." />
      
      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-slate-800 pb-2 mb-6">Security Credentials</h3>
        
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <PasswordInputGroup label="Current Password" placeholder="••••••••" val={passwords.currentPassword} setVal={v => setPasswords({ ...passwords, currentPassword: v })} />
          <PasswordInputGroup label="New Password" placeholder="••••••••" val={passwords.newPassword} setVal={v => setPasswords({ ...passwords, newPassword: v })} />
          <PasswordInputGroup label="Confirm New Password" placeholder="••••••••" val={passwords.confirmPassword} setVal={v => setPasswords({ ...passwords, confirmPassword: v })} />
          
          {msg && <p className="text-emerald-400 text-sm font-bold mt-2">{msg}</p>}
          {error && <p className="text-rose-400 text-sm font-bold mt-2">{error}</p>}
          
          <button type="submit" className="mt-4 w-full h-[46px] bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-md">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
