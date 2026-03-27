import React, { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('pravaahya_token');
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if(data.success) setUsers(data.data);
      });
  }, []);

  const viewDetails = async (id) => {
    const token = localStorage.getItem('pravaahya_token');
    const res = await fetch(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if(data.success) setSelectedUser(data.data);
  };

  return (
    <div>
      <h1>Admin User Management</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Total Orders</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.phone}</td>
              <td>{u.totalOrders}</td>
              <td><button onClick={() => viewDetails(u._id)}>View Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div style={{ marginTop: '20px', border: '1px solid black', padding: '10px' }}>
          <h2>User: {selectedUser.user.email}</h2>
          <p>Name: {selectedUser.user.name}</p>
          <p>Phone: {selectedUser.user.phone}</p>
          <h3>Orders</h3>
          <ul>
            {selectedUser.orders.map(o => (
              <li key={o._id}>ID: {o._id} | Total: {o.total} | Status: {o.status}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
