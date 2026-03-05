// lib/formatters.ts
export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatUSDT = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatHash = (hash: string): string => {
  if (hash.length <= 10) return hash;
  return `${hash.slice(0, 4)}…${hash.slice(-4)}`;
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const generateHash = (): string => {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('').toUpperCase();
};
