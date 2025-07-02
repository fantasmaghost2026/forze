import { useCurrencyContext } from '../contexts/CurrencyContextProvider';

/* eslint-disable react/prop-types */
const Price = ({ amount, showCurrency = true, className = '' }) => {
  const { formatPrice } = useCurrencyContext();
  
  const isAmountNegative = amount < 0;
  const amountOnUI = isAmountNegative ? -1 * amount : amount;

  const formattedPrice = formatPrice(amountOnUI, showCurrency);

  return (
    <span className={className}>
      {isAmountNegative && '-'} {formattedPrice}
    </span>
  );
};

export default Price;