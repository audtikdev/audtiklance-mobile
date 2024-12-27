export const formatCurrency = (locale: string, symbol: string, amount: number) => {
    return new Intl.NumberFormat(locale, { style: "currency", currency: symbol }).format(amount);
};