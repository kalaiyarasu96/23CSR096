type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package = "auth" | "config" | "middleware" | "utils" | "api" | "component" | "hook" | "page" | "state" | "style" | "handler" | "db";

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYWxhaXlhcmFzdXQuMjNjc2VAa29uZ3UuZWR1IiwiZXhwIjoxNzc5MDgwMTEwLCJpYXQiOjE3NzkwNzkyMTAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlZGRhYWUzMi0yMDJlLTQwZjEtODgwZS1jOTFmZTQwZjRmZWYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYWxhaXlhcmFzdSB0Iiwic3ViIjoiNzQzZGNhZWQtNGY4Yi00MjJkLWE3MDktN2JmNjEzYWEyOGNlIn0sImVtYWlsIjoia2FsYWl5YXJhc3V0LjIzY3NlQGtvbmd1LmVkdSIsIm5hbWUiOiJrYWxhaXlhcmFzdSB0Iiwicm9sbE5vIjoiMjNjc3IwOTYiLCJhY2Nlc3NDb2RlIjoiUnlaQmN5IiwiY2xpZW50SUQiOiI3NDNkY2FlZC00ZjhiLTQyMmQtYTcwOS03YmY2MTNhYTI4Y2UiLCJjbGllbnRTZWNyZXQiOiJwelVQanN1c3pDenNIUmJDIn0.gLpw2cD5ZTfjlppmeHLzWqQVu6IwhyvHDCLMXZajvuo";

export async function Log(stack: Stack, level: Level, pkg: Package, message: string) {
    try {
        const body = {
            stack,
            level,
            package: pkg,
            message
        };

        const response = await fetch(LOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error(`[Logging Middleware] Failed to send log. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`[Logging Middleware] Network error while sending log:`, error);
    }
}

