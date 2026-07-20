// Utility formatters for 12-hour AM/PM time, speeds, and distances

export function format12HourTime(timeStr?: string): string {
  if (!timeStr) return '--:--';

  // If already formatted with AM/PM
  if (timeStr.toUpperCase().includes('AM') || timeStr.toUpperCase().includes('PM')) {
    return timeStr;
  }

  // Handle ISO timestamps like 2026-07-20T16:00:00+05:30 or Date strings
  if (timeStr.includes('T')) {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    const timePart = timeStr.split('T')[1]?.split('.')[0]?.split('+')[0];
    if (timePart) timeStr = timePart;
  }

  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return timeStr;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].substring(0, 2);

  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  const strHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${strHours}:${minutes} ${ampm}`;
}

export function formatDuration(durationHours: number): string {
  const hrs = Math.floor(durationHours);
  const mins = Math.round((durationHours - hrs) * 60);
  return `${hrs}h ${mins}m`;
}
