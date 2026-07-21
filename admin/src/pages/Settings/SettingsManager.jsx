import React, { useState } from 'react';
import { SectionHeader, PasswordInputGroup } from '../../components/AdminUI';

export default function SettingsManager({ token, showToast }) {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("New passwords do not match.", "error");
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
        showToast(data.message || "Password updated successfully.", "success");
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.message || "Failed to update password.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An unexpected error occurred.", "error");
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
          
          <button type="submit" className="mt-4 w-full h-[46px] bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-md">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
