export function sortEvents(events) {
  if (!events || !Array.isArray(events)) return [];
  
  return [...events].sort((a, b) => {
    // 1. Sort by createdAt if available
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (a.createdAt && !b.createdAt) return -1;
    if (!a.createdAt && b.createdAt) return 1;

    // 2. Fallback to event date
    const dateA = parseEventDate(a);
    const dateB = parseEventDate(b);
    
    return dateB - dateA;
  });
}

function parseEventDate(event) {
  if (!event) return 0;
  
  // Typical data could be year: '2026', month: 'OCT', date: '17'
  const year = parseInt(event.year) || 0;
  
  let month = 0;
  if (event.month) {
    const monthStr = event.month.toLowerCase().trim().substring(0, 3);
    const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    if (months[monthStr] !== undefined) {
      month = months[monthStr];
    }
  }
  
  const day = parseInt(event.date) || 1;
  
  if (year === 0 && month === 0 && day === 1) return 0; // No valid date info
  
  // If year is missing but date/month exists, assume current year just for relative sorting,
  // but it's better to use 1970 if year is completely missing.
  // Actually, setting a reasonable default if missing.
  const y = year !== 0 ? year : new Date().getFullYear();
  
  return new Date(y, month, day).getTime();
}
