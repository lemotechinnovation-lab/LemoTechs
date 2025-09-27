#!/bin/bash
echo "Starting LemoTech Backend..."
echo "Node version: $(node --version)"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Output some progress during startup
echo "Initializing application..."
node dist/app.js &
APP_PID=$!

# Keep outputting status to prevent timeout
while kill -0 $APP_PID 2>/dev/null; do
    echo "App is running (PID: $APP_PID) - $(date)"
    sleep 30
done

echo "Application exited"
wait $APP_PID
