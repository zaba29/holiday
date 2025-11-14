import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

export const RegistrationPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', employeeNumber: '', password: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [registrationOpen, setRegistrationOpen] = useState<boolean | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get('/system/status')
      .then((res) => setRegistrationOpen(res.data.allowSelfRegistration))
      .catch(() => setRegistrationOpen(false));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMessage('');
      setError('Passwords do not match');
      return;
    }
    try {
      await client.post('/registrations', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        employeeNumber: form.employeeNumber,
        password: form.password,
      });
      setError('');
      setMessage('Registration submitted. An admin will review your request.');
    } catch (err: any) {
      setMessage('');
      setError(err.response?.data?.message || 'Registration unavailable');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, width: 460 }}>
        <Typography variant="h5" mb={2}>
          Employee Registration
        </Typography>
        {registrationOpen === false ? (
          <>
            <Typography mb={2}>Registration is currently disabled by the administrator.</Typography>
            <Button variant="contained" fullWidth onClick={() => navigate('/login')}>
              Back to login
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
          {error && (
            <Typography mt={1} color="error">
              {error}
            </Typography>
          )}
          {message && (
            <Typography mt={1} color="secondary">
              {message}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Submit registration
          </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};
