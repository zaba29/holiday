import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, Button } from '@mui/material';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const [data, setData] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/dashboard/admin').then((res) => setData(res.data));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Admin control centre
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Pending registrations</Typography>
              <Typography variant="h3">{data?.pendingRegistrations ?? 0}</Typography>
              <Button sx={{ mt: 1 }} variant="outlined" onClick={() => navigate('/admin/registrations')}>
                Review registrations
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Pending leave</Typography>
              <Typography variant="h3">{data?.pendingLeaves ?? 0}</Typography>
              <Button sx={{ mt: 1 }} variant="outlined" onClick={() => navigate('/admin/leaves')}>
                Review leave
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Active employees</Typography>
              <Typography variant="h3">{data?.employees ?? 0}</Typography>
              <Button sx={{ mt: 1 }} variant="outlined" onClick={() => navigate('/admin/employees')}>
                Manage employees
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Upcoming holidays
          </Typography>
          {data?.upcoming?.length ? (
            data.upcoming.map((leave: any) => (
              <Box key={leave.id} display="flex" justifyContent="space-between" py={1}>
                <Typography>
                  {leave.user.firstName} {leave.user.lastName}
                </Typography>
                <Typography>
                  {leave.startDate.split('T')[0]} - {leave.endDate.split('T')[0]}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No upcoming leave this week.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
