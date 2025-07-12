import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box } from '@mui/material';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import UsersPage from './pages/UsersPage';
import SwapsPage from './pages/SwapsPage';
import FeedbackPage from './pages/FeedbackPage';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/auth">Auth</Button>
          <Button color="inherit" component={Link} to="/users">Users</Button>
          <Button color="inherit" component={Link} to="/swaps">Swaps</Button>
          <Button color="inherit" component={Link} to="/feedback">Feedback</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: '100vh', width: '100vw', p: 0, mt: 0, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/swaps" element={<SwapsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Routes>
      </Box>
    </>
  );
}

export default App;
