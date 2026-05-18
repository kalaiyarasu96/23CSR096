export interface Notification {
  id: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

// Updating to use 20.244.56.144 as established previously from testing
const API_URL = 'http://20.244.56.144/evaluation-service/notifications';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYWxhaXlhcmFzdXQuMjNjc2VAa29uZ3UuZWR1IiwiZXhwIjoxNzc5MDgwMTEwLCJpYXQiOjE3NzkwNzkyMTAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlZGRhYWUzMi0yMDJlLTQwZjEtODgwZS1jOTFmZTQwZjRmZWYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYWxhaXlhcmFzdSB0Iiwic3ViIjoiNzQzZGNhZWQtNGY4Yi00MjJkLWE3MDktN2JmNjEzYWEyOGNlIn0sImVtYWlsIjoia2FsYWl5YXJhc3V0LjIzY3NlQGtvbmd1LmVkdSIsIm5hbWUiOiJrYWxhaXlhcmFzdSB0Iiwicm9sbE5vIjoiMjNjc3IwOTYiLCJhY2Nlc3NDb2RlIjoiUnlaQmN5IiwiY2xpZW50SUQiOiI3NDNkY2FlZC00ZjhiLTQyMmQtYTcwOS03YmY2MTNhYTI4Y2UiLCJjbGllbnRTZWNyZXQiOiJwelVQanN1c3pDenNIUmJDIn0.gLpw2cD5ZTfjlppmeHLzWqQVu6IwhyvHDCLMXZajvuo';

export interface FetchOptions {
  limit?: number;
  page?: number;
  notification_type?: string;
}

export const fetchNotifications = async (options?: FetchOptions): Promise<Notification[]> => {
  const url = new URL(API_URL);
  
  if (options) {
    if (options.limit !== undefined) url.searchParams.append('limit', options.limit.toString());
    if (options.page !== undefined) url.searchParams.append('page', options.page.toString());
    if (options.notification_type) url.searchParams.append('notification_type', options.notification_type);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.statusText}`);
  }

  // Handle both { notifications: [] } objects or straight array returns
  const data = await response.json();
  if (data && data.notifications) {
      return data.notifications;
  }
  return data as Notification[];
};
