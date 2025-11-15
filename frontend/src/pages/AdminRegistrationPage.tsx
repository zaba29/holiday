import { useState } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import client from '../api/client';

export const AdminRegistrationPage = () => {
  const [token, setToken] = useState('');
  const [request, setRequest] = useState<any>();

  const load = () => {
    if (!token) return;
    client.get(`/registrations/${token}`).then((res) => setRequest(res.data));
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>
        Review registration
      </Typography>
      <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste approval token" />
      <Button sx={{ ml: 2 }} variant="contained" onClick={load}>
        Load
      </Button>
      {request && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography>
              {request.firstName} {request.lastName}
            </Typography>
            <Typography>{request.email}</Typography>
            <Typography>Employee #{request.employeeNumber}</Typography>
            <Box display="flex" gap={1} mt={2}>
              <Button variant="contained" onClick={() => client.post(`/registrations/${token}/approve`, { allocation: 28 })}>
                Approve
              </Button>
              <Button variant="outlined" color="error" onClick={() => client.post(`/registrations/${token}/reject`, { reason: 'Insufficient info' })}>
                Reject
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
