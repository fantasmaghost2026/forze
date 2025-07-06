import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES, DEFAULT_CURRENCY, LOCAL_STORAGE_KEYS } from '../constants/constants';
import { toastHandler } from '../utils/utils';
import { ToastType } from '../constants/constants';

const CurrencyContext = createContext(null);

export const useCurrencyContext = () => useContext(CurrencyContext);

const CurrencyContextProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY);
  const [currencies, setCurrencies] = useState(CURRENCIES);

  // Cargar moneda desde localStorage al iniciar
  useEffect(() => {
    const savedCurrency = localStorage.getItem(LOCAL_STORAGE_KEYS.Currency);
    if (savedCurrency && currencies[savedCurrency]) {
      setSelectedCurrency(savedCurrency);
    }
  }, [currencies]);

  // Cargar monedas personalizadas desde la configuración del admin
  useEffect(() => {
    const loadCurrencies = () => {
      const savedConfig = localStorage.getItem('adminStoreConfig');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          if (parsedConfig.currencies) {
            console.log('💱 Cargando monedas personalizadas desde configuración del admin');
            setCurrencies(parsedConfig.currencies);
          }
        } catch (error) {
          console.error('Error al cargar monedas personalizadas:', error);
        }
      }
    };

    loadCurrencies();

    // Escuchar eventos de actualización de monedas
    const handleCurrenciesUpdate = (event) => {
      const { currencies: updatedCurrencies } = event.detail;
      console.log('📡 Monedas actualizadas en tiempo real:', Object.keys(updatedCurrencies).length);
      setCurrencies(updatedCurrencies);
      
      // Verificar si la moneda seleccionada aún existe
      if (!updatedCurrencies[selectedCurrency]) {
        setSelectedCurrency(DEFAULT_CURRENCY);
        localStorage.setItem(LOCAL_STORAGE_KEYS.Currency, DEFAULT_CURRENCY);
        toastHandler(ToastType.Info, 'Moneda cambiada a CUP (la moneda anterior fue eliminada)');
      }
    };

    const handleConfigUpdate = () => {
      console.log('📡 Configuración actualizada, recargando monedas...');
      loadCurrencies();
    };

    // Agregar listeners
    window.addEventListener('currenciesUpdated', handleCurrenciesUpdate);
    window.addEventListener('forceStoreUpdate', handleConfigUpdate);
    window.addEventListener('adminConfigChanged', handleConfigUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('currenciesUpdated', handleCurrenciesUpdate);
      window.removeEventListener('forceStoreUpdate', handleConfigUpdate);
      window.removeEventListener('adminConfigChanged', handleConfigUpdate);
    };
  }, [selectedCurrency]);

  // Función para cambiar moneda
  const changeCurrency = (currencyCode) => {
    if (currencies[currencyCode]) {
      setSelectedCurrency(currencyCode);
      localStorage.setItem(LOCAL_STORAGE_KEYS.Currency, currencyCode);
      
      const currency = currencies[currencyCode];
      toastHandler(
        ToastType.Success, 
        `💱 Moneda cambiada a ${currency.flag} ${currency.name} (${currency.code})`
      );
    }
  };

  // Función para convertir precio de CUP a la moneda seleccionada
  const convertFromCUP = (cupAmount) => {
    if (selectedCurrency === 'CUP') {
      return cupAmount;
    }
    
    const rate = currencies[selectedCurrency]?.rate || 1;
    return cupAmount / rate;
  };

  // Función para convertir precio de cualquier moneda a CUP
  const convertToCUP = (amount, fromCurrency = selectedCurrency) => {
    if (fromCurrency === 'CUP') {
      return amount;
    }
    
    const rate = currencies[fromCurrency]?.rate || 1;
    return amount * rate;
  };

  // Función para formatear precio SIN duplicar código de moneda
  const formatPrice = (cupAmount, showCurrency = true) => {
    const convertedAmount = convertFromCUP(cupAmount);
    const currency = currencies[selectedCurrency];
    
    if (!currency) {
      return cupAmount.toLocaleString();
    }
    
    // Formatear según la moneda
    let formattedAmount;
    if (selectedCurrency === 'CUP') {
      formattedAmount = convertedAmount.toLocaleString('es-CU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } else {
      formattedAmount = convertedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    if (!showCurrency) {
      return formattedAmount;
    }

    // Retornar SOLO con símbolo y código UNA VEZ
    if (selectedCurrency === 'MLC') {
      return `${formattedAmount} ${currency.symbol} ${currency.code}`;
    } else {
      return `${currency.symbol}${formattedAmount} ${currency.code}`;
    }
  };

  // Función para formatear precio con código de moneda (mantener compatibilidad)
  const formatPriceWithCode = (cupAmount) => {
    return formatPrice(cupAmount, true);
  };

  // Función para obtener información de la moneda actual
  const getCurrentCurrency = () => {
    return currencies[selectedCurrency] || currencies[DEFAULT_CURRENCY];
  };

  // Función para obtener todas las monedas disponibles
  const getAvailableCurrencies = () => {
    return Object.values(currencies);
  };

  // Función para obtener el símbolo de la moneda actual
  const getCurrencySymbol = () => {
    return currencies[selectedCurrency]?.symbol || '$';
  };

  // Función para obtener la tasa de conversión actual
  const getCurrentRate = () => {
    return currencies[selectedCurrency]?.rate || 1;
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      changeCurrency,
      convertFromCUP,
      convertToCUP,
      formatPrice,
      formatPriceWithCode,
      getCurrentCurrency,
      getAvailableCurrencies,
      getCurrencySymbol,
      getCurrentRate,
      currencies,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContextProvider;