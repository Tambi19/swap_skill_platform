import { useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button, Alert, Paper } from '@mui/material';

export default function AuthPage() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTab = (_, newValue) => {
    setTab(newValue);
    setForm({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const url = tab === 0 ? '/api/auth/register' : '/api/auth/login';
      const body = tab === 0 ? form : { email: form.email, password: form.password };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error');
      if (data.token) {
        localStorage.setItem('token', data.token);
        setSuccess(tab === 0 ? 'Registration successful! You can now log in.' : 'Login successful!');
      } else {
        setSuccess('Registration successful!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <Paper sx={{ p: 3, maxWidth: 500, width: '100%' }}>
        <Tabs value={tab} onChange={handleTab} centered>
          <Tab label="Register" />
          <Tab label="Login" />
        </Tabs>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tab === 0 && (
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
          )}
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} required fullWidth type="email" />
          <TextField label="Password" name="password" value={form.password} onChange={handleChange} required fullWidth type="password" />
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {tab === 0 ? 'Register' : 'Login'}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Box>
      </Paper>
    </Box>
  );
} 