<<<<<<< HEAD
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatea el salario: "$2,500 - $3,200 USD"
export const formatSalary = (min, max, currency) => {
  if (!min && !max) return 'Salario no especificado';
  
  const opts = { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 };
  const minFmt = min ? min.toLocaleString('en-US', opts) : '';
  const maxFmt = max ? max.toLocaleString('en-US', opts) : '';

  if (min && max) return `${minFmt} - ${maxFmt} ${currency}`;
  if (min) return `Desde ${minFmt} ${currency}`;
  if (max) return `Hasta ${maxFmt} ${currency}`;
  return 'No especificado';
};

// Formatea la fecha: "hace alrededor de 12 horas"
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
=======
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatSalary = (min, max, currency = 'USD') => {
  if (!min && !max) return 'Salario a convenir';
  const format = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: currency, maximumFractionDigits: 0
  }).format(amount);

  if (min && max) return `${format(min)} - ${format(max)}`;
  return format(min || max);
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return `hace ${Math.floor(interval)} años`;
  interval = seconds / 2592000;
  if (interval > 1) return `hace ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `hace ${Math.floor(interval)} h`;
  return "hace un momento";
>>>>>>> bcb30a2a115ba37aa484649e8bfef36cc28f4157
};