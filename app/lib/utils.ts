export const formatCurrency = (amountCents: number) =>
  (amountCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export const formatDateTime = (date: string) =>
  new Date(date).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const onlyDigits = (value: string) => value.replace(/\D/g, '');

export function isValidCnpj(cnpj: string) {
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }
  const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  return [12, 13].every((length) => {
    const sum = [...cnpj.slice(0, length)].reduce(
      (total, digit, i) => total + Number(digit) * weights[i + 13 - length],
      0,
    );
    const remainder = sum % 11;
    return (remainder < 2 ? 0 : 11 - remainder) === Number(cnpj[length]);
  });
}

export const formatCnpj = (cnpj: string) =>
  cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

export const formatPhone = (phone: string) =>
  phone.length === 11
    ? phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    : phone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');

export const formatZipCode = (zipCode: string) =>
  zipCode.replace(/^(\d{5})(\d{3})$/, '$1-$2');

export function isValidCpf(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  return [9, 10].every((length) => {
    const sum = [...cpf.slice(0, length)].reduce(
      (total, digit, i) => total + Number(digit) * (length + 1 - i),
      0,
    );
    return ((sum * 10) % 11) % 10 === Number(cpf[length]);
  });
}

export const formatCpf = (cpf: string) =>
  cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

export function parseCurrencyToCents(value: string) {
  const normalized = value.replace(/[R$\s]/g, '');
  const decimal = normalized.includes(',')
    ? normalized.replace(/\./g, '').replace(',', '.')
    : normalized;
  if (!/^\d+(\.\d{1,2})?$/.test(decimal)) {
    return NaN;
  }
  return Math.round(Number(decimal) * 100);
}

export const formatCentsForInput = (cents: number) =>
  (cents / 100).toFixed(2).replace('.', ',');

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}
