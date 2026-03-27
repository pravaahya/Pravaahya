import React, { useState, useEffect } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('pravaahya_token');
    fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data.data);
          setName(data.data.name || '');
          setPhone(data.data.phone || '');
        }
      });

    fetch('/api/user/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.data);
      });
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pravaahya_token');
    await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, phone })
    });
    alert('Profile updated');
  };

  const downloadInvoice = async (id) => {
    const token = localStorage.getItem('pravaahya_token');
    const res = await fetch(`/api/orders/${id}/invoice`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
       const blob = await res.blob();
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `invoice-${id}.pdf`;
       a.click();
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {profile.email}</p>
      <form onSubmit={updateProfile}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
        <button type="submit">Update Profile</button>
      </form>

      <h2>Order History</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            Order ID: {order._id} - Date: {new Date(order.createdAt).toLocaleDateString()} - Status: {order.status} - Amount: {order.total}
            <button onClick={() => downloadInvoice(order._id)}>Download Invoice</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
