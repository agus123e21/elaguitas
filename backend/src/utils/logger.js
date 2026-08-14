// In-memory ring buffer for recent system logs (for Admin/Dev console inspection)
const MAX_LOGS = 200;
const logBuffer = [];

export function logEvent(level, action, details = {}, userId = null) {
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(), // INFO, WARN, ERROR, SUCCESS
    action,
    details,
    userId,
  };

  logBuffer.unshift(entry);
  if (logBuffer.length > MAX_LOGS) {
    logBuffer.pop();
  }

  const prefix = `[${entry.level}] [${entry.action}]`;
  if (level === 'ERROR') {
    console.error(prefix, details);
  } else if (level === 'WARN') {
    console.warn(prefix, details);
  } else {
    console.log(prefix, details);
  }

  return entry;
}

export const logger = {
  info: (action, details, userId) => logEvent('INFO', action, details, userId),
  warn: (action, details, userId) => logEvent('WARN', action, details, userId),
  error: (action, details, userId) => logEvent('ERROR', action, details, userId),
  success: (action, details, userId) => logEvent('SUCCESS', action, details, userId),
  getLogs: ({ limit = 50, level } = {}) => {
    let result = logBuffer;
    if (level) {
      result = result.filter((l) => l.level === level.toUpperCase());
    }
    return result.slice(0, Number(limit));
  },
  clear: () => {
    logBuffer.length = 0;
  },
};

export default logger;
