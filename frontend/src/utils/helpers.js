export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str, max = 50) {
  if (!str) return '';
  return str.length > max ? str.substring(0, max - 3) + '...' : str;
}