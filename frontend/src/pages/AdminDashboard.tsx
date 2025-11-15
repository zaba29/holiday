import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import Grid from '@mui/material/GridLegacy';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Stack,
} from '@mui/material';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const [data, setData] = useState<any>();
  const [settings, setSettings] = useState<any>();
  const [settingsError, setSettingsError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/dashboard/admin').then((res) => setData(res.data));
  }, []);

  useEffect(() => {
    client.get('/system/settings').then((res) => setSettings({ ...res.data.settings, hasUsers: res.data.hasUsers }));
  }, []);

  const handleRegistrationToggle = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const { data: updated } = await client.patch('/system/settings', {
        allowSelfRegistration: event.target.checked,
      });
      setSettings((prev: any) => ({ ...(prev || {}), ...updated }));
      setSettingsError('');
    } catch (err: any) {
      setSettingsError(err.response?.data?.message || 'Unable to update settings');
    }
  };

  const handleAuthModeChange = async (event: SelectChangeEvent) => {
    try {
      const { data: updated } = await client.patch('/system/settings', {
        authMode: event.target.value,
      });
      setSettings((prev: any) => ({ ...(prev || {}), ...updated }));
      setSettingsError('');
    } catch (err: any) {
      setSettingsError(err.response?.data?.message || 'Unable to update settings');
    }
  };

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
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start" justifyContent="space-between">
            <Box flex={1}>
              <Typography variant="h6" mb={2}>
                Authentication & Registration
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="auth-mode-label">Authentication mode</InputLabel>
                <Select
                  labelId="auth-mode-label"
                  label="Authentication mode"
                  value={settings?.authMode || 'OPEN_WHEN_EMPTY'}
                  onChange={handleAuthModeChange}
                >
                  <MenuItem value="OPEN_WHEN_EMPTY" disabled={settings?.hasUsers}>
                    Allow login without credentials (only when no users exist)
                  </MenuItem>
                  <MenuItem value="PASSWORD_ONLY">Login only with username + password</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch checked={!!settings?.allowSelfRegistration} onChange={handleRegistrationToggle} />}
                label="Allow new user self-registration"
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Toggle registration visibility on the login page in real time.
              </Typography>
              {settingsError && (
                <Typography color="error" mt={1}>
                  {settingsError}
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
