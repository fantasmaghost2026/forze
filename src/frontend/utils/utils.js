import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import {
  ALL_STATES,
  ToastType,
  CUSTOM_TOASTID,
  ITEMS_PER_PAGE,
} from '../constants/constants';
import confetti from 'canvas-confetti';
import { faker } from '@faker-js/faker';

export const calculateDiscountPercent = (discountPrice, originalPrice) => {
  const percent = Math.floor(
    ((originalPrice - discountPrice) * 100) / originalPrice
  );
  return percent;
};

export const giveUniqueLabelFOR = (type, i) => `${type}-${i}`;

export const toastHandler = (type, message, toastId = uuid()) => {
  const toastStyle = {
    position: 'top-left',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    toastId,
  };

  const toastFunc = toast[type];

  // toast function call
  toastFunc(message, toastStyle);
};

export const LOGIN_TOAST = () => {
  toastHandler(ToastType.Warn, 'Por favor inicia sesión para continuar', CUSTOM_TOASTID);
};

export const setIntoLocalStorage = (name, dataObj) => {
  localStorage.setItem(name, JSON.stringify(dataObj));
};

export const getFromLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name)) ?? null;
};

export const removeLocalStorage = (name) => {
  localStorage.removeItem(name);
};

export const wait = (delay) => new Promise((res) => setTimeout(res, delay));

export const lowerizeAndCheckIncludes = (text, userText) => {
  return text.toLowerCase().includes(userText.toLowerCase());
};

export const convertArrayToObjectWithPropertyFALSE = (listOfStrings = []) => {
  return listOfStrings.reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});
};

export const isPresent = (itemId, list) =>
  !!list.find((singleItem) => singleItem._id === itemId);

export const givePaginatedList = (list) => {
  return Array.from(
    { length: Math.ceil(list.length / ITEMS_PER_PAGE) },
    (_, i) => list.slice(ITEMS_PER_PAGE * i, ITEMS_PER_PAGE * (i + 1))
  );
};

// FUNCIÓN DE FORMATEO DE PRECIO REMOVIDA - AHORA SE USA EL CONTEXTO DE MONEDA
// export const formatPrice = (price) =>
//   price.toLocaleString('es-CU', {
//     maximumFractionDigits: 2,
//   });

export const Popper = () => {
  const end = Date.now() + 1 * 1000;
  // go Buckeyes!
  const colors = ['#392f5a', '#9583cf'];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 40,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 140,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

export const giveRandomData = () => {
  return {
    username: faker.person.fullName(),
    pincode: faker.location.zipCode('######'),
    mobile: faker.phone.number('##########'),
    alternate: faker.phone.number('##########'),
    addressInfo: faker.location.streetAddress(true),
    city: faker.location.city(),
    state: ALL_STATES[Math.floor(Math.random() * ALL_STATES.length)],
  };
};

export const midValue = (value1, value2) => {
  return Math.floor((value1 + value2) / 2);
};

export const validateEmptyTextInput = ({ inputsObj, optionalInput }) => {
  for (const property in inputsObj) {
    if (typeof inputsObj[property] !== 'string' || property === optionalInput) {
      continue;
    }

    if (!inputsObj[property].trim()) {
      return true;
    }
  }

  return false;
};

// Generar número de orden aleatorio
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
};

// Función para calcular el rango óptimo de precios
export const calculateOptimalPriceRange = (prices) => {
  if (!prices || prices.length === 0) {
    return { min: 0, max: 100000 };
  }

  if (prices.length === 1) {
    const singlePrice = prices[0];
    return {
      min: Math.max(0, Math.floor(singlePrice * 0.9)),
      max: Math.ceil(singlePrice * 1.1)
    };
  }

  const sortedPrices = [...prices].sort((a, b) => a - b);
  const minPrice = sortedPrices[0];
  const maxPrice = sortedPrices[sortedPrices.length - 1];
  
  // Calcular el rango de precios
  const priceRange = maxPrice - minPrice;
  
  // Si el rango es muy pequeño (productos con precios similares)
  if (priceRange < 1000) {
    return {
      min: Math.max(0, Math.floor(minPrice * 0.95)), // 5% menos del mínimo
      max: Math.ceil(maxPrice * 1.05) // 5% más del máximo
    };
  }
  
  // Si el rango es moderado (hasta 100,000)
  if (priceRange <= 100000) {
    const padding = priceRange * 0.1; // 10% de padding
    return {
      min: Math.max(0, Math.floor(minPrice - padding)),
      max: Math.ceil(maxPrice + padding)
    };
  }
  
  // Para rangos grandes (más de 100,000)
  if (priceRange <= 1000000) {
    const padding = priceRange * 0.05; // 5% de padding
    return {
      min: Math.max(0, Math.floor(minPrice - padding)),
      max: Math.ceil(maxPrice + padding)
    };
  }
  
  // Para rangos muy grandes (más de 1,000,000)
  const padding = Math.min(priceRange * 0.02, 50000); // Máximo 50,000 de padding
  return {
    min: Math.max(0, Math.floor(minPrice - padding)),
    max: Math.ceil(maxPrice + padding)
  };
};

// Función para formatear números grandes de manera legible
export const formatLargeNumber = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(0) + 'K';
  }
  return number.toString();
};

// Función para calcular el valor medio óptimo para el slider
export const calculateOptimalMidValue = (min, max) => {
  const range = max - min;
  
  // Para rangos pequeños, usar el punto medio exacto
  if (range <= 10000) {
    return Math.floor((min + max) / 2);
  }
  
  // Para rangos medianos, redondear a miles
  if (range <= 100000) {
    const mid = (min + max) / 2;
    return Math.round(mid / 1000) * 1000;
  }
  
  // Para rangos grandes, redondear a decenas de miles
  const mid = (min + max) / 2;
  return Math.round(mid / 10000) * 10000;
};