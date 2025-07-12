import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Divider, Alert, MenuItem, Select, FormControl, InputLabel, Rating } from '@mui/material';

export default function FeedbackPage() {
  const [users, setUsers] = useState([]);
  const [toUser, setToUser] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load users for feedback form
  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users?skill=');
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  // Load feedback for a user
  const loadFeedbacks = async (userId) => {
    setError('');
    setSuccess('');
    setFeedbacks([]);
    try {
      const res = await fetch(`/api/feedback/${userId}`);
      if (!res.ok) throw new Error('Failed to load feedback');
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Leave feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toUser, rating, comment }),
      });
      if (!res.ok) throw new Error('Failed to leave feedback');
      setSuccess('Feedback submitted!');
      setToUser('');
      setRating(0);
      setComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Load users on mount
  useState(() => { loadUsers(); }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '70vh', width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom align="center">Feedback</Typography>
        <Paper sx={{ p: 2, mb: 4, width: '100%' }}>
          <Typography variant="h6">Leave Feedback</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>To User</InputLabel>
              <Select
                value={toUser}
                label="To User"
                onChange={e => setToUser(e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {users.map(user => (
                  <MenuItem key={user._id} value={user._id}>{user.name} ({user.email})</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Rating:</Typography>
              <Rating value={rating} onChange={(_, v) => setRating(v)} max={5} />
            </Box>
            <TextField label="Comment" value={comment} onChange={e => setComment(e.target.value)} multiline rows={2} fullWidth />
            <Button type="submit" variant="contained">Submit Feedback</Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </Paper>
        <Paper sx={{ p: 2, width: '100%' }}>
          <Typography variant="h6">View Feedback for a User</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>User</InputLabel>
            <Select
              value={selectedUser}
              label="User"
              onChange={e => {
                setSelectedUser(e.target.value);
                loadFeedbacks(e.target.value);
              }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {users.map(user => (
                <MenuItem key={user._id} value={user._id}>{user.name} ({user.email})</MenuItem>
              ))}
            </Select>
          </FormControl>
          <List>
            {feedbacks.map(fb => (
              <div key={fb._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<><b>From:</b> {fb.fromUser?.name || fb.fromUser}</>}
                    secondary={
                      <>
                        <div>Rating: <Rating value={fb.rating} readOnly max={5} /></div>
                        <div>Comment: {fb.comment}</div>
                      </>
                    }
                  />
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