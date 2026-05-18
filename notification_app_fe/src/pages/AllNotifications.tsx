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
  Pagination,
  Badge
} from '@mui/material';
import { fetchNotifications, Notification } from '../api';

const MainList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [viewedStatuses, setViewedStatuses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      // Using API parameter
      const data = await fetchNotifications({ limit: 12, page: page });
      setNotifications(data);
      
      // Merge new viewed statuses from localStorage if any, or default to false
      const savedViews = JSON.parse(localStorage.getItem('viewedStatuses') || '{}');
      const newStatusMap = { ...savedViews };
      data.forEach(n => {
        if (newStatusMap[n.id] === undefined) {
             newStatusMap[n.id] = false; // By default not viewed
        }
      });
      setViewedStatuses(newStatusMap);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = (id: string) => {
    const newStatuses = { ...viewedStatuses, [id]: true };
    setViewedStatuses(newStatuses);
    localStorage.setItem('viewedStatuses', JSON.stringify(newStatuses));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getColorByType = (type: string) => {
    if (type.toLowerCase() === 'placement') return 'success';
    if (type.toLowerCase() === 'result') return 'warning';
    return 'primary';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>All Notifications</Typography>
      
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <>
          <Grid container spacing={3}>
            {notifications.map((notif) => {
              const isViewed = viewedStatuses[notif.id];

              return (
                <Grid item xs={12} md={6} key={notif.id}>
                  <Card 
                    onMouseEnter={() => !isViewed && markAsViewed(notif.id)}
                    sx={{ 
                      height: '100%', 
                      borderLeft: !isViewed ? '4px solid #1976d2' : '4px solid transparent',
                      backgroundColor: !isViewed ? '#f8fbb' : 'white',
                      transition: 'all 0.2s',
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                         <Badge color="error" variant="dot" invisible={isViewed}>
                            <Typography variant="h6" component="div">
                              {notif.type}
                            </Typography>
                        </Badge>
                        <Chip label={notif.type} color={getColorByType(notif.type) as any} size="small" />
                      </Box>
                      <Typography variant="body1" sx={{ py: 1 }}>
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notif.createdAt).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          <Box display="flex" justifyContent="center" mt={4}>
             <Pagination count={10} page={page} onChange={handlePageChange} color="primary" />
          </Box>
        </>
      )}
    </Box>
  );
};

export default MainList;
