import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SetupPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeNumber: '',
    password: '',
    confirm: '',
  });
  const [status, setStatus] = useState<{ setupRequired: boolean; hasUsers: boolean }>();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    client.get('/system/status').then((res) => setStatus(res.data));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await client.post('/system/setup', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        employeeNumber: form.employeeNumber,
        password: form.password,
      });
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Unable to complete setup');
    }
  };

  const setupComplete = status && !status.setupRequired;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, width: 480 }}>
        <Typography variant="h5" mb={2}>
          Initial system setup
        </Typography>
        {setupComplete ? (
          <>
            <Typography mb={2}>An administrator already exists. Please login to continue.</Typography>
            <Button variant="contained" fullWidth onClick={() => navigate('/login')}>
              Go to login
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField name="firstName" label="First name" fullWidth margin="normal" value={form.firstName} onChange={handleChange} />
            <TextField name="lastName" label="Last name" fullWidth margin="normal" value={form.lastName} onChange={handleChange} />
            <TextField name="email" type="email" label="Email" fullWidth margin="normal" value={form.email} onChange={handleChange} />
            <TextField name="employeeNumber" label="Employee number" fullWidth margin="normal" value={form.employeeNumber} onChange={handleChange} />
            <TextField name="password" type="password" label="Password" fullWidth margin="normal" value={form.password} onChange={handleChange} />
            <TextField name="confirm" type="password" label="Confirm password" fullWidth margin="normal" value={form.confirm} onChange={handleChange} />
            {message && (
              <Typography color="error" mt={1}>
                {message}
              </Typography>
            )}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Create first admin
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};
