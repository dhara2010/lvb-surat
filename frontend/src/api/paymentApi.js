const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getPaymentQR = async () => {
  const response = await fetch(`${API_BASE_URL}/api/payment-qr`);
  if (!response.ok) {
    throw new Error('Failed to fetch payment QR code.');
  }
  return await response.json();
};

export const submitPaymentProof = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/payment-proofs`, {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit payment proof.');
  }
  return data;
};

export const checkUserSubmission = async (eventId, memberId, userName) => {
  let url = `${API_BASE_URL}/api/payment-proofs/check?eventId=${eventId}`;
  if (memberId) url += `&memberId=${encodeURIComponent(memberId)}`;
  if (userName) url += `&userName=${encodeURIComponent(userName)}`;

  const response = await fetch(url);
  if (!response.ok) {
    return { submission: null };
  }
  return await response.json();
};
