import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../../components/AdminUI';
import { QrCode, Upload, Trash2, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function PaymentQRManager({ token, showToast }) {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchQR = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/payment-qr`);
      const data = await res.json();
      if (data && data.qrCodeUrl) {
        const fullUrl = data.qrCodeUrl.startsWith('http') 
          ? data.qrCodeUrl 
          : `${apiUrl}${data.qrCodeUrl}`;
        setQrCodeUrl(fullUrl);
      } else {
        setQrCodeUrl(null);
      }
    } catch (err) {
      console.error('Failed to fetch payment QR code:', err);
      showToast && showToast('Failed to load payment QR code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQR();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrorMsg('Invalid file format. Only JPG, JPEG, PNG and WEBP image files are allowed.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10 MB limit.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a QR code image to upload.');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('qrCode', selectedFile);

      const res = await fetch(`${apiUrl}/api/payment-qr`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast && showToast(data.message || 'Payment QR Code updated successfully!', 'success');
        const fullUrl = data.qrCodeUrl.startsWith('http') ? data.qrCodeUrl : `${apiUrl}${data.qrCodeUrl}`;
        setQrCodeUrl(fullUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        setErrorMsg(data.message || 'Failed to upload QR code.');
        showToast && showToast(data.message || 'Failed to upload QR code.', 'error');
      }
    } catch (err) {
      console.error('Upload QR error:', err);
      setErrorMsg('An unexpected error occurred while uploading.');
      showToast && showToast('Error uploading QR code.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the current payment QR code? Users will not be able to see the payment QR code.')) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/payment-qr`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast && showToast('Payment QR code deleted successfully.', 'success');
        setQrCodeUrl(null);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        showToast && showToast(data.message || 'Failed to delete QR code.', 'error');
      }
    } catch (err) {
      console.error('Delete QR error:', err);
      showToast && showToast('Error deleting QR code.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-4xl">
      <SectionHeader 
        title="Payment QR Code Management" 
        desc="Upload, preview, replace, or delete the dynamic payment QR code displayed to users on the ticket checkout screen." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* CURRENT QR CODE PREVIEW CARD */}
        <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
              <QrCode size={16} /> Active Payment QR Code
            </h3>
            <button 
              onClick={fetchQR}
              title="Refresh"
              className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" /> Loading QR code...
            </div>
          ) : qrCodeUrl ? (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-700 shadow-xl max-w-[240px]">
                <img 
                  src={qrCodeUrl} 
                  alt="Active Payment QR Code" 
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={13} /> Active & Available to Users
                </span>
              </div>

              <button 
                onClick={handleDelete}
                className="mt-2 w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 size={14} /> Delete Current QR Code
              </button>
            </div>
          ) : (
            <div className="p-10 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                <QrCode size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-300 text-sm">No QR Code Configured</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Users will see a "Payment option currently unavailable" notice on ticket checkout until a QR code is uploaded.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* UPLOAD / UPDATE QR CODE CARD */}
        <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
              <Upload size={16} /> {qrCodeUrl ? 'Replace / Update QR Code' : 'Upload New QR Code'}
            </h3>
          </div>

          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select QR Image File
              </label>
              
              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/70 rounded-2xl p-5 bg-bg/50 transition-colors text-center cursor-pointer flex flex-col items-center gap-2">
                <input 
                  type="file" 
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {previewUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white p-2 rounded-xl border border-slate-600 max-h-36 overflow-hidden">
                      <img src={previewUrl} alt="New QR Preview" className="max-h-32 object-contain" />
                    </div>
                    <span className="text-xs font-bold text-cyan-400">
                      Selected: {selectedFile?.name}
                    </span>
                    <span className="text-[10px] text-slate-500">Click to choose a different file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    <Upload size={24} className="text-cyan-400 mb-1" />
                    <span className="text-xs font-bold text-slate-200">Click or drag image file to select</span>
                    <span className="text-[10px] text-slate-500">Allowed Formats: JPG, JPEG, PNG, WEBP (Max 10 MB)</span>
                  </div>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={15} /> {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={uploading || !selectedFile}
              className="mt-2 w-full h-[46px] bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Uploading QR Code...
                </>
              ) : (
                <>
                  <Upload size={16} /> {qrCodeUrl ? 'Save & Replace QR Code' : 'Publish QR Code'}
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
