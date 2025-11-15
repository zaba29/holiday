import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import client from '../api/client';
import { Calendar } from '../components/Calendar';
import { LeaveRequestDrawer } from '../sections/LeaveRequestDrawer';

export const EmployeeDashboard = () => {
  const [data, setData] = useState<any>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    client.get('/dashboard/employee').then((res) => setData(res.data));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        My Holiday Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Annual allocation</Typography>
              <Typography variant="h4">{data?.allocation ?? '--'} days</Typography>
              <Typography variant="subtitle2">Taken: {data?.taken ?? '--'}</Typography>
              <Typography variant="subtitle2">Remaining: {data?.remaining ?? '--'}</Typography>
              <Button sx={{ mt: 2 }} variant="contained" onClick={() => setOpen(true)}>
                Request leave
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Calendar
              </Typography>
              <Calendar
                events={
                  data?.upcoming?.map((leave: any) => ({
                    date: leave.startDate.split('T')[0],
                    label: `${leave.startDate.split('T')[0]}-${leave.endDate.split('T')[0]}`,
                    status: leave.status,
                  })) || []
                }
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending requests</Typography>
              {data?.pending?.length ? (
                data.pending.map((leave: any) => (
                  <Box key={leave.id} display="flex" justifyContent="space-between" py={1}>
                    <Typography>
                      {leave.startDate.split('T')[0]} - {leave.endDate.split('T')[0]} ({leave.type})
                    </Typography>
                    <Typography color="warning.main">Pending</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No pending requests.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <LeaveRequestDrawer open={open} onClose={() => setOpen(false)} onSuccess={() => client.get('/dashboard/employee').then((res) => setData(res.data))} />
    </Box>
  );
};
