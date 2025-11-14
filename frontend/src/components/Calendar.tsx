import { Box, Typography } from '@mui/material';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ukBankHolidays } from '../data/bankHolidays';

interface CalendarProps {
  events: { date: string; label: string; status?: string }[];
}

export const Calendar = ({ events }: CalendarProps) => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });
  return (
    <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
      {days.map((day) => {
        const iso = format(day, 'yyyy-MM-dd');
        const holiday = ukBankHolidays.find((h) => h.date === iso);
        const event = events.find((e) => e.date === iso);
        return (
          <Box key={iso} border={1} borderColor="#e0e0e0" borderRadius={1} p={1} minHeight={80} bgcolor={holiday ? '#fff3e0' : event ? '#e3f2fd' : 'white'}>
            <Typography variant="caption">{format(day, 'dd MMM')}</Typography>
            {holiday && (
              <Typography variant="body2" color="secondary">
                {holiday.name}
              </Typography>
            )}
            {event && (
              <Typography variant="body2" color="primary">
                {event.label} ({event.status})
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
