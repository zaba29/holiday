import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [systemState, setSystemState] = useState<{ allowSelfRegistration: boolean; setupRequired: boolean }>();

  useEffect(() => {
    let isMounted = true;
    const loadState = () => {
      client
        .get('/system/status')
        .then((res) => {
          if (isMounted) setSystemState(res.data);
        })
        .catch(() => {});
    };
    loadState();
    const interval = setInterval(loadState, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (systemState?.setupRequired) {
      setError('Initial setup required before logging in.');
      return;
    }
    try {
      await login(email, password);
      if (localStorage.getItem('role') === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Unable to login. Check your credentials.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={2}>
          Holiday Portal Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        {systemState?.setupRequired && (
          <Typography variant="body2" color="primary" mt={2}>
            No users found in system.{' '}
            <Button variant="text" onClick={() => navigate('/setup')}>
              Click here to create the first admin account.
            </Button>
          </Typography>
        )}
        {systemState?.allowSelfRegistration && !systemState.setupRequired && (
          <Button variant="text" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/register')}>
            Register new user
          </Button>
        )}
      </Paper>
    </Box>
  );
};
