export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const calculateTotal = (price: number, quantity: number) => {
  return Number((price * quantity).toFixed(2));
};
