import { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Paper, Divider, Alert } from '@mui/material';

export default function UsersPage() {
  const [skill, setSkill] = useState('');
  const [users, setUsers] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileForm, setProfileForm] = useState({ name: '', location: '', skillsOffered: '', skillsWanted: '' });

  // Search users by skill
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    setUsers([]);
    try {
      const res = await fetch(`/api/users?skill=${encodeURIComponent(skill)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setSearchError(err.message);
    }
  };

  // Load current user's profile
  const loadProfile = async () => {
    setProfileError('');
    setProfileSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      // Decode JWT to get user id
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      const res = await fetch(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setProfile(data);
      setProfileForm({
        name: data.name || '',
        location: data.location || '',
        skillsOffered: (data.skillsOffered || []).join(', '),
        skillsWanted: (data.skillsWanted || []).join(', '),
      });
    } catch (err) {
      setProfileError(err.message);
    }
  };

  // Update current user's profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileForm.name,
          location: profileForm.location,
          skillsOffered: profileForm.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
          skillsWanted: profileForm.skillsWanted.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setProfile(data);
      setProfileSuccess('Profile updated!');
    } catch (err) {
      setProfileError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '70vh', width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom align="center">Users</Typography>
        <Paper sx={{ p: 2, mb: 4, width: '100%' }}>
          <Typography variant="h6">Search Users by Skill</Typography>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField label="Skill" value={skill} onChange={e => setSkill(e.target.value)} required />
            <Button type="submit" variant="contained">Search</Button>
          </Box>
          {searchError && <Alert severity="error" sx={{ mt: 2 }}>{searchError}</Alert>}
          <List>
            {users.map(user => (
              <div key={user._id}>
                <ListItem>
                  <ListItemText
                    primary={user.name}
                    secondary={
                      <>
                        <div>Email: {user.email}</div>
                        <div>Skills Offered: {user.skillsOffered?.join(', ') || 'None'}</div>
                        <div>Skills Wanted: {user.skillsWanted?.join(', ') || 'None'}</div>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Paper>
        <Paper sx={{ p: 2, width: '100%' }}>
          <Typography variant="h6">Your Profile</Typography>
          <Button variant="outlined" sx={{ mb: 2 }} onClick={loadProfile}>Load My Profile</Button>
          {profileError && <Alert severity="error">{profileError}</Alert>}
          {profile && (
            <Box component="form" onSubmit={handleProfileUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Name" name="name" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} required />
              <TextField label="Location" name="location" value={profileForm.location} onChange={e => setProfileForm(f => ({ ...f, location: e.target.value }))} />
              <TextField label="Skills Offered (comma separated)" name="skillsOffered" value={profileForm.skillsOffered} onChange={e => setProfileForm(f => ({ ...f, skillsOffered: e.target.value }))} />
              <TextField label="Skills Wanted (comma separated)" name="skillsWanted" value={profileForm.skillsWanted} onChange={e => setProfileForm(f => ({ ...f, skillsWanted: e.target.value }))} />
              <Button type="submit" variant="contained">Update Profile</Button>
              {profileSuccess && <Alert severity="success">{profileSuccess}</Alert>}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
} 