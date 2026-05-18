import { Log } from '../logging_middleware/index.ts';

const API_URL = 'http://20.244.56.144/evaluation-service/notifications';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYWxhaXlhcmFzdXQuMjNjc2VAa29uZ3UuZWR1IiwiZXhwIjoxNzc5MDgwMTEwLCJpYXQiOjE3NzkwNzkyMTAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlZGRhYWUzMi0yMDJlLTQwZjEtODgwZS1jOTFmZTQwZjRmZWYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYWxhaXlhcmFzdSB0Iiwic3ViIjoiNzQzZGNhZWQtNGY4Yi00MjJkLWE3MDktN2JmNjEzYWEyOGNlIn0sImVtYWlsIjoia2FsYWl5YXJhc3V0LjIzY3NlQGtvbmd1LmVkdSIsIm5hbWUiOiJrYWxhaXlhcmFzdSB0Iiwicm9sbE5vIjoiMjNjc3IwOTYiLCJhY2Nlc3NDb2RlIjoiUnlaQmN5IiwiY2xpZW50SUQiOiI3NDNkY2FlZC00ZjhiLTQyMmQtYTcwOS03YmY2MTNhYTI4Y2UiLCJjbGllbnRTZWNyZXQiOiJwelVQanN1c3pDenNIUmJDIn0.gLpw2cD5ZTfjlppmeHLzWqQVu6IwhyvHDCLMXZajvuo';

interface Notification {
    id: string;
    message: string;
    type: string;
    status: string;
    createdAt: string;
}

function getWeight(type: string): number {
    switch(type.toLowerCase()) {
        case 'placement': return 3;
        case 'result': return 2;
        case 'event': return 1;
        default: return 0;
    }
}

function compareNotifications(a: Notification, b: Notification): number {
    const weightA = getWeight(a.type);
    const weightB = getWeight(b.type);

    if (weightA !== weightB) {
        return weightA - weightB;
    }

    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    
    return timeA - timeB;
}

async function fetchNotifications(): Promise<Notification[]> {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data: any = await response.json();
        return data as Notification[];
    } catch (error: any) {
        Log('backend', 'error', 'middleware', `Failed to fetch notifications: ${error.message}`);
        console.error("Failed to fetch notifications:", error);
        return [];
    }
}

async function run() {
    Log('backend', 'info', 'middleware', 'Starting Priority Inbox calculation for Stage 1');
    const allNotifications = await fetchNotifications();

    if (allNotifications.length === 0) {
        console.log("No notifications retrieved or API format is different.");
        return;
    }

    const unreadNotifications = allNotifications.filter(n => n.status.toLowerCase() === 'unread');
    unreadNotifications.sort((a, b) => compareNotifications(b, a)); 

    const top10 = unreadNotifications.slice(0, 10);

    console.log("=== TOP 10 PRIORITY NOTIFICATIONS ===");
    top10.forEach((n, idx) => {
        console.log(`${idx + 1}. [${n.type.toUpperCase()}] ${n.message} (Date: ${new Date(n.createdAt).toLocaleString()})`);
    });

    Log('backend', 'info', 'middleware', 'Successfully displayed Top 10 priority notifications');
}

run();
