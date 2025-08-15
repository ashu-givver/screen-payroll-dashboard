export const formatCurrency = (amount: number | null | undefined, currency = 'GBP'): string => {
  // Ensure we always display a value, defaulting to 0 for null/undefined
  const value = amount ?? 0;
  
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(value);
};