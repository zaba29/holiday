import { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import client from '../api/client';

export const RegistrationPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', employeeNumber: '', password: '', confirm: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMessage('Passwords do not match');
      return;
    }
    await client.post('/registrations', {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      employeeNumber: form.employeeNumber,
      password: form.password,
    });
    setMessage('Registration submitted. An admin will review your request.');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, width: 460 }}>
        <Typography variant="h5" mb={2}>
          Employee Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField name="firstName" label="First name" fullWidth margin="normal" value={form.firstName} onChange={handleChange} />
          <TextField name="lastName" label="Last name" fullWidth margin="normal" value={form.lastName} onChange={handleChange} />
          <TextField name="email" type="email" label="Email" fullWidth margin="normal" value={form.email} onChange={handleChange} />
          <TextField name="employeeNumber" label="Employee number" fullWidth margin="normal" value={form.employeeNumber} onChange={handleChange} />
          <TextField name="password" type="password" label="Password" fullWidth margin="normal" value={form.password} onChange={handleChange} />
          <TextField name="confirm" type="password" label="Confirm password" fullWidth margin="normal" value={form.confirm} onChange={handleChange} />
          {message && (
            <Typography mt={1} color="secondary">
              {message}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Submit registration
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
