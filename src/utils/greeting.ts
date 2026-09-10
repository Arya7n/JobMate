export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

export function formatGreeting(name?: string, date: Date = new Date()): string {
  const greeting = getGreeting(date);
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? `${greeting}, ${trimmed}` : greeting;
}
