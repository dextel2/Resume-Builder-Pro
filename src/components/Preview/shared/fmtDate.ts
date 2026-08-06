export function fmtDate(d: string): string {
  if (!d) return '';
  const [y, m] = d.split('-');
  if (!m) return y;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mi = parseInt(m, 10) - 1;
  return `${months[mi] || m} ${y}`;
}

export function dateRange(start: string, end: string, current?: boolean): string {
  return `${fmtDate(start)} – ${current ? 'Present' : fmtDate(end)}`;
}
