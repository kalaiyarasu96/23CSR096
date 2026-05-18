import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Grid, 
  CircularProgress, 
  Alert,
  Box,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { fetchNotifications, Notification } from '../api';

const PriorityNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [viewedStatuses, setViewedStatuses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, [filterType]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const options: any = { limit: 10 }; // the 'n' most important
      if (filterType !== 'ALL') {
          options.notification_type = filterType;
      }
      
      let data = await fetchNotifications(options);
      
      // Client side priority sorting if needed as fallback, but API supposedly handles it or we sort here 
      // based on weight logic defined in stage 1
      const getWeight = (t: string) => {
        const lower = t.toLowerCase();
        if (lower === 'placement') return 3;
        if (lower === 'result') return 2;
        return 1;
      };
      
      data.sort((a,b) => {
         const wA = getWeight(a.type);
         const wB = getWeight(b.type);
         if (wA !== wB) return wB - wA; // Descending
         return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setNotifications(data);
      
      const savedViews = JSON.parse(localStorage.getItem('viewedStatuses') || '{}');
      const newStatusMap = { ...savedViews };
      data.forEach(n => {
        if (newStatusMap[n.id] === undefined) {
             newStatusMap[n.id] = false;
        }
      });
      setViewedStatuses(newStatusMap);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };

  const markAsViewed = (id: string) => {
    const newStatuses = { ...viewedStatuses, [id]: true };
    setViewedStatuses(newStatuses);
    localStorage.setItem('viewedStatuses', JSON.stringify(newStatuses));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Priority Inbox</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={filterType}
            label="Filter Type"
            onChange={handleFilterChange}
          >
            <MenuItem value="ALL">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={2}>
          {notifications.map((notif, index) => {
            const isViewed = viewedStatuses[notif.id];
            
            return (
              <Grid item xs={12} key={notif.id}>
                <Card 
                  onMouseEnter={() => !isViewed && markAsViewed(notif.id)}
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    borderLeft: !isViewed ? '4px solid #dc004e' : '4px solid transparent',
                    backgroundColor: !isViewed ? '#fff1f4' : 'white',
                    p: 2
                  }}
                >
                  <Box display="flex" alignItems="center" width={{ xs: '100%', sm: '200px' }} mb={{ xs: 1, sm: 0 }}>
                    <Typography variant="h5" color="text.secondary" mr={2} sx={{ opacity: 0.5 }}>
                      #{index + 1}
                    </Typography>
                    <Badge color="error" variant="dot" invisible={isViewed}>
                        <Chip 
                        label={notif.type} 
                        color={notif.type.toLowerCase() === 'placement' ? 'success' : notif.type.toLowerCase() === 'result' ? 'warning' : 'primary'} 
                        />
                    </Badge>
                  </Box>
                  <Box flex="1" px={{ xs: 0, sm: 2 }} width="100%">
                    <Typography variant="body1" fontWeight={500}>
                      {notif.message}
                    </Typography>
                  </Box>
                  <Box mt={{ xs: 1, sm: 0 }} minWidth="150px" textAlign={{ xs: 'left', sm: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notif.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
          {notifications.length === 0 && (
              <Typography variant="body1" sx={{ mt: 4, width: '100%', textAlign: 'center', color: 'text.secondary' }}>
                  No priority notifications found.
              </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default PriorityNotifications;
