import { useCurrencyContext } from '../contexts/CurrencyContextProvider';

/* eslint-disable react/prop-types */
const Price = ({ amount, showCurrency = true, showCurrencyCode = true, className = '' }) => {
  const { formatPrice, getCurrentCurrency } = useCurrencyContext();
  
  if (!amount && amount !== 0) {
    return <span className={className}>--</span>;
  }
  
  const isAmountNegative = amount < 0;
  const amountOnUI = isAmountNegative ? -1 * amount : amount;

  // SIEMPRE mostrar el código de moneda por defecto
  const formattedPrice = formatPrice(amountOnUI, showCurrency);
  const currency = getCurrentCurrency();

  // SIEMPRE agregar el código de moneda al final
  const finalPrice = showCurrencyCode 
    ? `${formattedPrice} ${currency.code}`
    : formattedPrice;

  return (
    <span className={className}>
      {isAmountNegative && '-'} {finalPrice}
    </span>
  );
};

export default Price;