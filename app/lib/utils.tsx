
export const formatDate = (dateString: string) => {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // Month is zero-based
  const day = parseInt(dateString.substring(6, 8), 10);
  return new Date(year, month, day);
};

export const Loading: React.FC = () => {
  return <h2>🌀 Loading...</h2>;
};

export function colorGenerator(name: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert hash to a 6 digit hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}

export function truncateToFirstDecimal(num: number): number {
  return Math.floor(num * 10) / 10;
}
