export const formatNumberToBrazilian = (value: any) => {
  if (value === null || value === undefined) return "";
  const num = Number(value);
  if (isNaN(num)) {
    return String(value);
  }
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}; 