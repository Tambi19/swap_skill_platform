import { Typography, Box, Button, Grid, Paper } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import GroupIcon from '@mui/icons-material/Group';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      width: '100%',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)',
      py: 4
    }}>
      {/* Hero Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, maxWidth: 700, width: '100%', textAlign: 'center', background: 'rgba(255,255,255,0.95)' }}>
        <Typography variant="h2" gutterBottom color="primary" fontWeight={700}>
          Welcome to Swap Skill Platform
        </Typography>
        <Typography variant="h5" gutterBottom>
          Connect, exchange skills, and grow together!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<LoginIcon />}
          sx={{ mt: 3, fontSize: 18, px: 4, py: 1.5 }}
          onClick={() => navigate('/auth')}
        >
          Get Started
        </Button>
      </Paper>
      {/* Features Section */}
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 900 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <SwapHorizIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" fontWeight={600}>Skill Swapping</Typography>
            <Typography>Offer your skills and find people who can teach you something new. Create and manage swap requests easily.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <GroupIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" fontWeight={600}>Community</Typography>
            <Typography>Search for users by skill, connect with like-minded learners, and build your network.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <FeedbackIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" fontWeight={600}>Feedback & Growth</Typography>
            <Typography>Leave and receive feedback to help everyone improve and grow in their skill journey.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 