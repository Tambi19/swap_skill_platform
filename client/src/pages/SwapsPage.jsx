import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Divider, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

export default function SwapsPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ toUser: '', offeredSkill: '', wantedSkill: '' });
  const [swaps, setSwaps] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Load users for swap form
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users?skill=');
        if (!res.ok) throw new Error('Failed to load users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
    loadSwaps();
    // eslint-disable-next-line
  }, []);

  // Load swaps for current user
  const loadSwaps = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const res = await fetch('/api/swaps', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load swaps');
      const data = await res.json();
      setSwaps(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle swap request form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const res = await fetch('/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create swap');
      setSuccess('Swap request sent!');
      setForm({ toUser: '', offeredSkill: '', wantedSkill: '' });
      loadSwaps();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Accept or reject swap
  const handleStatus = async (id, status) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const res = await fetch(`/api/swaps/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update swap');
      setSuccess(`Swap ${status}`);
      loadSwaps();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete swap
  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const res = await fetch(`/api/swaps/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete swap');
      setSuccess('Swap deleted');
      loadSwaps();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '70vh', width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom align="center">Swaps</Typography>
        <Paper sx={{ p: 2, mb: 4, width: '100%' }}>
          <Typography variant="h6">Create Swap Request</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>To User</InputLabel>
              <Select
                value={form.toUser}
                label="To User"
                name="toUser"
                onChange={e => setForm(f => ({ ...f, toUser: e.target.value }))}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {users.map(user => (
                  <MenuItem key={user._id} value={user._id}>{user.name} ({user.email})</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Offered Skill" name="offeredSkill" value={form.offeredSkill} onChange={e => setForm(f => ({ ...f, offeredSkill: e.target.value }))} required />
            <TextField label="Wanted Skill" name="wantedSkill" value={form.wantedSkill} onChange={e => setForm(f => ({ ...f, wantedSkill: e.target.value }))} required />
            <Button type="submit" variant="contained" disabled={loading}>Send Swap Request</Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </Paper>
        <Paper sx={{ p: 2, width: '100%' }}>
          <Typography variant="h6">Your Swaps</Typography>
          <Button variant="outlined" sx={{ mb: 2 }} onClick={loadSwaps}>Refresh</Button>
          <List>
            {swaps.map(swap => (
              <div key={swap._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`From: ${swap.fromUser?.name || 'You'} → To: ${swap.toUser?.name || ''}`}
                    secondary={
                      <>
                        <div>Offered: {swap.offeredSkill}</div>
                        <div>Wanted: {swap.wantedSkill}</div>
                        <div>Status: {swap.status || 'pending'}</div>
                      </>
                    }
                  />
                  {swap.status === 'pending' && (
                    <>
                      <Button color="success" onClick={() => handleStatus(swap._id, 'accepted')}>Accept</Button>
                      <Button color="warning" onClick={() => handleStatus(swap._id, 'rejected')}>Reject</Button>
                    </>
                  )}
                  {swap.status !== 'accepted' && (
                    <Button color="error" onClick={() => handleDelete(swap._id)}>Delete</Button>
                  )}
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
} 