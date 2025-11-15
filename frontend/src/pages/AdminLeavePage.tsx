import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, MenuItem, Select, Typography } from '@mui/material';
import client from '../api/client';

export const AdminLeavePage = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [status, setStatus] = useState('PENDING');

  const load = () => {
    client.get('/leaves/admin', { params: { status } }).then((res) => setLeaves(res.data));
  };

  useEffect(() => {
    load();
  }, [status]);

  const changeStatus = (id: number, newStatus: string) => {
    const note = prompt('Add optional note');
    client.post(`/leaves/${id}/status`, { status: newStatus, note }).then(load);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>
        Leave approvals
      </Typography>
      <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)}>
        <MenuItem value="PENDING">Pending</MenuItem>
        <MenuItem value="APPROVED">Approved</MenuItem>
        <MenuItem value="REJECTED">Rejected</MenuItem>
      </Select>
      <Box mt={2}>
        {leaves.map((leave) => (
          <Card key={leave.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                {leave.user.firstName} {leave.user.lastName}
              </Typography>
              <Typography>
                {leave.startDate.split('T')[0]} - {leave.endDate.split('T')[0]} ({leave.type})
              </Typography>
              <Typography variant="body2">Remaining balance: {leave.user.remainingDays}</Typography>
              {status === 'PENDING' && (
                <Box mt={1} display="flex" gap={1}>
                  <Button variant="contained" onClick={() => changeStatus(leave.id, 'APPROVED')}>
                    Approve
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => changeStatus(leave.id, 'REJECTED')}>
                    Reject
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
