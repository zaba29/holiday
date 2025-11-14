import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import client from '../api/client';

export const AdminEmployeesPage = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    client.get('/users').then((res) => setUsers(res.data));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>
        Employee directory
      </Typography>
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} md={6} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography>{user.email}</Typography>
                <Typography>Employee #{user.employeeNumber}</Typography>
                <Typography>Remaining days: {user.remainingDays}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
