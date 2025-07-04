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

// NUEVA FUNCIÓN: Detectar dispositivo y sistema operativo
export const detectUserDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  return {
    isIOS: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
    isMacOS: /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent),
    isAndroid: /Android/.test(userAgent),
    isWindows: /Windows/.test(userAgent),
    isMobile: /Mobi|Android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent),
    userAgent
  };
};

// NUEVA FUNCIÓN: Limpiar número de WhatsApp para URLs
export const cleanWhatsAppNumber = (number) => {
  // Remover todos los caracteres que no sean números o el símbolo +
  let cleaned = number.replace(/[^\d+]/g, '');
  
  // Asegurar que comience con +
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

// NUEVA FUNCIÓN: Codificar mensaje para URL de WhatsApp
export const encodeWhatsAppMessage = (message) => {
  return encodeURIComponent(message)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/!/g, '%21')
    .replace(/~/g, '%7E');
};

// NUEVA FUNCIÓN: Abrir WhatsApp con compatibilidad universal
export const openWhatsAppUniversal = async (phoneNumber, message) => {
  const device = detectUserDevice();
  const cleanedNumber = cleanWhatsAppNumber(phoneNumber);
  const encodedMessage = encodeWhatsAppMessage(message);
  
  console.log('📱 Información del dispositivo:', device);
  console.log('📞 Número limpio:', cleanedNumber);
  
  // Construir URLs específicas para cada plataforma
  let whatsappUrls = [];
  
  if (device.isIOS) {
    // Para iOS: Múltiples esquemas con prioridad para la app nativa
    whatsappUrls = [
      `whatsapp://send?phone=${cleanedNumber}&text=${encodedMessage}`,
      `https://wa.me/${cleanedNumber.replace(/\+/g, '')}?text=${encodedMessage}`,
      `https://api.whatsapp.com/send?phone=${cleanedNumber.replace(/\+/g, '')}&text=${encodedMessage}`
    ];
    console.log('📱 Detectado iOS - Usando esquemas específicos para iPhone/iPad');
  } else if (device.isMacOS) {
    // Para macOS: WhatsApp Web y app nativa
    whatsappUrls = [
      `https://web.whatsapp.com/send?phone=${cleanedNumber.replace(/\+/g, '')}&text=${encodedMessage}`,
      `whatsapp://send?phone=${cleanedNumber}&text=${encodedMessage}`,
      `https://wa.me/${cleanedNumber.replace(/\+/g, '')}?text=${encodedMessage}`
    ];
    console.log('💻 Detectado macOS - Usando WhatsApp Web y app nativa');
  } else if (device.isAndroid) {
    // Para Android: App nativa y web
    whatsappUrls = [
      `whatsapp://send?phone=${cleanedNumber}&text=${encodedMessage}`,
      `https://wa.me/${cleanedNumber.replace(/\+/g, '')}?text=${encodedMessage}`,
      `https://api.whatsapp.com/send?phone=${cleanedNumber.replace(/\+/g, '')}&text=${encodedMessage}`
    ];
    console.log('🤖 Detectado Android - Usando esquemas nativos');
  } else {
    // Para otros sistemas: WhatsApp Web
    whatsappUrls = [
      `https://web.whatsapp.com/send?phone=${cleanedNumber.replace(/\+/g, '')}&text=${encodedMessage}`,
      `https://wa.me/${cleanedNumber.replace(/\+/g, '')}?text=${encodedMessage}`,
      `https://api.whatsapp.com/send?phone=${cleanedNumber.replace(/\+/g, '')}&text=${encodedMessage}`
    ];
    console.log('🖥️ Detectado sistema de escritorio - Usando WhatsApp Web');
  }
  
  // Intentar abrir WhatsApp con fallbacks
  for (let i = 0; i < whatsappUrls.length; i++) {
    const url = whatsappUrls[i];
    console.log(`📱 Intentando abrir WhatsApp (intento ${i + 1}):`, url);
    
    try {
      if (device.isIOS && url.startsWith('whatsapp://')) {
        // Para iOS con esquemas personalizados
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.target = '_blank';
        tempLink.rel = 'noopener noreferrer';
        
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        
        // Esperar para verificar si se abrió
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ WhatsApp abierto exitosamente en iOS');
        return true;
      } else {
        // Para otros casos
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        
        if (newWindow && !newWindow.closed) {
          console.log('✅ WhatsApp abierto exitosamente');
          return true;
        } else if (newWindow === null) {
          console.log('⚠️ Popup bloqueado, intentando siguiente método...');
          continue;
        }
      }
    } catch (error) {
      console.log(`❌ Error en intento ${i + 1}:`, error);
      continue;
    }
  }
  
  // Si todos los intentos fallaron, mostrar fallback
  const fallbackMessage = `No se pudo abrir WhatsApp automáticamente.

Puedes copiar este enlace y abrirlo manualmente:
${whatsappUrls[1]}

O buscar el contacto ${phoneNumber} en WhatsApp y enviar el mensaje del pedido.`;
  
  if (confirm(fallbackMessage)) {
    try {
      await navigator.clipboard.writeText(whatsappUrls[1]);
      toastHandler(ToastType.Success, '📋 Enlace copiado al portapapeles');
    } catch (error) {
      console.log('No se pudo copiar al portapapeles:', error);
    }
  }
  
  return false;
};