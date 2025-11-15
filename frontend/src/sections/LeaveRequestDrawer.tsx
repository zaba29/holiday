import { useState } from 'react';
import { Drawer, Box, Typography, TextField, MenuItem, Button } from '@mui/material';
import client from '../api/client';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeaveRequestDrawer = ({ open, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({ startDate: '', endDate: '', type: 'HOLIDAY', comment: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/leaves', form);
      setForm({ startDate: '', endDate: '', type: 'HOLIDAY', comment: '' });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to submit request');
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box width={360} p={3} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" mb={2}>
          New leave request
        </Typography>
        <TextField
          label="Start date"
          type="date"
          fullWidth
          margin="normal"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End date"
          type="date"
          fullWidth
          margin="normal"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField select label="Leave type" fullWidth margin="normal" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <MenuItem value="HOLIDAY">Holiday</MenuItem>
          <MenuItem value="UNPAID">Unpaid</MenuItem>
          <MenuItem value="SICK">Sick</MenuItem>
          <MenuItem value="OTHER">Other</MenuItem>
        </TextField>
        <TextField
          label="Comment"
          multiline
          rows={3}
          fullWidth
          margin="normal"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Drawer>
  );
};
