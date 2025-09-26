// Generate a unique session ID
export function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

// Get or create session ID
export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem('booking_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('booking_session_id', sessionId);
  }
  return sessionId;
}

// Clear session ID
export function clearSessionId(): void {
  localStorage.removeItem('booking_session_id');
}
