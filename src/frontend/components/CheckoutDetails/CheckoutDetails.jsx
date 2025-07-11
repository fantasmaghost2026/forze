import { useAllProductsContext } from '../../contexts/ProductsContextProvider';
import { useConfigContext } from '../../contexts/ConfigContextProvider';
import { useCurrencyContext } from '../../contexts/CurrencyContextProvider';
import Price from '../Price';
import styles from './CheckoutDetails.module.css';
import { useState } from 'react';
import { VscChromeClose } from 'react-icons/vsc';

import { CHARGE_AND_DISCOUNT, ToastType, SERVICE_TYPES, PRODUCT_CATEGORY_ICONS } from '../../constants/constants';
import CouponSearch from './CouponSearch';
import { toastHandler, Popper, generateOrderNumber } from '../../utils/utils';

import { useAuthContext } from '../../contexts/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

const CheckoutDetails = ({
  timer,
  activeAddressId: activeAddressIdFromProps,
  updateCheckoutStatus,
}) => {
  const {
    cartDetails: {
      totalAmount: totalAmountFromContext,
      totalCount: totalCountFromContext,
    },
    addressList: addressListFromContext,
    cart: cartFromContext,
    clearCartDispatch,
  } = useAllProductsContext();

  const { storeConfig } = useConfigContext();
  const { formatPriceWithCode, getCurrentCurrency, convertFromCUP } = useCurrencyContext();
  const STORE_WHATSAPP = storeConfig.storeInfo?.whatsappNumber || '+53 54690878';
  const SANTIAGO_ZONES = storeConfig.zones || [];

  const {
    user: { firstName, lastName, email },
  } = useAuthContext();
  const navigate = useNavigate();
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Obtener la dirección seleccionada
  const selectedAddress = addressListFromContext.find(
    ({ addressId }) => addressId === activeAddressIdFromProps
  );

  // Calcular costo de entrega
  const deliveryCost = selectedAddress?.serviceType === SERVICE_TYPES.HOME_DELIVERY 
    ? (selectedAddress?.deliveryCost || 0)
    : 0;

  // Calcular descuento del cupón según la moneda seleccionada
  const priceAfterCouponApplied = activeCoupon
    ? -Math.floor((totalAmountFromContext * activeCoupon.discountPercent) / 100)
    : 0;

  const finalPriceToPay =
    totalAmountFromContext +
    deliveryCost +
    CHARGE_AND_DISCOUNT.discount +
    priceAfterCouponApplied;

  const updateActiveCoupon = (couponObjClicked) => {
    setActiveCoupon(couponObjClicked);
    
    // Notificación mejorada con información de descuento y moneda
    const currency = getCurrentCurrency();
    const discountAmount = Math.floor((totalAmountFromContext * couponObjClicked.discountPercent) / 100);
    
    toastHandler(
      ToastType.Success, 
      `🎫 Cupón ${couponObjClicked.couponCode} aplicado: ${couponObjClicked.discountPercent}% de descuento (${formatPriceWithCode(discountAmount)})`
    );
  };

  const cancelCoupon = () => {
    const currency = getCurrentCurrency();
    toastHandler(ToastType.Warn, `🗑️ Cupón removido - Descuento cancelado`);
    setActiveCoupon(null);
  };

  // Función para obtener icono según categoría del producto
  const getProductIcon = (category) => {
    const normalizedCategory = category.toLowerCase();
    return PRODUCT_CATEGORY_ICONS[normalizedCategory] || PRODUCT_CATEGORY_ICONS.default;
  };

  // FUNCIÓN MEJORADA PARA DETECTAR DISPOSITIVOS Y SISTEMAS OPERATIVOS
  const detectDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const platform = navigator.platform || '';
    
    // Detectar iOS (iPhone, iPad, iPod)
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    // Detectar macOS
    const isMacOS = /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent);
    
    // Detectar Android
    const isAndroid = /Android/.test(userAgent);
    
    // Detectar Windows
    const isWindows = /Windows/.test(userAgent);
    
    // Detectar Linux
    const isLinux = /Linux/.test(userAgent) && !isAndroid;
    
    // Detectar si es móvil en general
    const isMobile = /Mobi|Android/i.test(userAgent) || isIOS;
    
    // Detectar si es tablet
    const isTablet = /iPad/.test(userAgent) || 
      (isAndroid && !/Mobile/.test(userAgent)) ||
      (window.innerWidth >= 768 && window.innerWidth <= 1024 && isMobile);
    
    // Detectar navegador
    let browser = 'unknown';
    if (/Chrome/.test(userAgent) && !/Edge/.test(userAgent)) {
      browser = 'chrome';
    } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
      browser = 'safari';
    } else if (/Firefox/.test(userAgent)) {
      browser = 'firefox';
    } else if (/Edge/.test(userAgent)) {
      browser = 'edge';
    } else if (/Opera/.test(userAgent)) {
      browser = 'opera';
    }
    
    return {
      isIOS,
      isMacOS,
      isAndroid,
      isWindows,
      isLinux,
      isMobile,
      isTablet,
      browser,
      userAgent,
      platform,
      isAppleDevice: isIOS || isMacOS
    };
  };

  // FUNCIÓN MEJORADA PARA GENERAR URLS DE WHATSAPP UNIVERSALES
  const generateWhatsAppURL = (message, phoneNumber) => {
    const device = detectDevice();
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    
    console.log('🔍 Dispositivo detectado:', device);
    console.log('📱 Número limpio:', cleanPhone);
    
    // URLs universales que funcionan en todos los dispositivos
    const universalUrls = [
      // URL principal - funciona en la mayoría de dispositivos
      `https://wa.me/${cleanPhone}?text=${encodedMessage}`,
      
      // URL de la API oficial de WhatsApp
      `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`,
      
      // URL scheme para aplicaciones nativas (móviles principalmente)
      `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`,
      
      // WhatsApp Web para escritorio
      `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`
    ];
    
    // Ordenar URLs según el dispositivo para mayor probabilidad de éxito
    if (device.isMobile || device.isTablet) {
      // Para móviles y tablets: priorizar app nativa, luego web
      return [
        universalUrls[2], // whatsapp://
        universalUrls[0], // wa.me
        universalUrls[1], // api.whatsapp.com
        universalUrls[3]  // web.whatsapp.com
      ];
    } else {
      // Para escritorio: priorizar web, luego intentar app
      return [
        universalUrls[0], // wa.me
        universalUrls[3], // web.whatsapp.com
        universalUrls[1], // api.whatsapp.com
        universalUrls[2]  // whatsapp://
      ];
    }
  };

  // FUNCIÓN MEJORADA PARA ABRIR WHATSAPP CON MÚLTIPLES MÉTODOS DE RESPALDO
  const tryOpenWhatsApp = async (urls, orderNumber) => {
    const device = detectDevice();
    
    console.log(`🚀 Intentando abrir WhatsApp en ${device.browser} - ${device.isIOS ? 'iOS' : device.isAndroid ? 'Android' : device.isMacOS ? 'macOS' : device.isWindows ? 'Windows' : device.isLinux ? 'Linux' : 'Desconocido'}`);
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`🔄 Método ${i + 1}/${urls.length}: ${url.split('?')[0]}`);
      
      try {
        // Método 1: Para dispositivos móviles iOS - usar iframe oculto
        if (device.isIOS && url.startsWith('whatsapp://') && i === 0) {
          console.log('📱 Usando método iframe para iOS');
          
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = url;
          document.body.appendChild(iframe);
          
          // Limpiar después de un tiempo
          setTimeout(() => {
            try {
              document.body.removeChild(iframe);
            } catch (e) {
              console.log('ℹ️ Iframe ya removido');
            }
          }, 3000);
          
          // Esperar para ver si funciona
          await new Promise(resolve => setTimeout(resolve, 1500));
          console.log('✅ Método iframe iOS completado');
          return true;
        }
        
        // Método 2: Abrir en nueva ventana/pestaña (universal)
        console.log('🌐 Abriendo en nueva ventana');
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer,width=800,height=600');
        
        if (newWindow) {
          console.log('✅ Ventana abierta exitosamente');
          
          // Para móviles, cerrar la ventana después de un tiempo
          if (device.isMobile || device.isTablet) {
            setTimeout(() => {
              try {
                newWindow.close();
              } catch (e) {
                console.log('ℹ️ No se pudo cerrar la ventana automáticamente');
              }
            }, 4000);
          }
          
          return true;
        }
        
        console.log('⚠️ No se pudo abrir ventana, intentando siguiente método...');
        
      } catch (error) {
        console.log(`❌ Error en método ${i + 1}:`, error.message);
      }
      
      // Pausa entre intentos
      if (i < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
    
    // Si todos los métodos fallaron, intentar método de respaldo
    console.log('🔄 Intentando método de respaldo...');
    try {
      // Método de respaldo: cambiar la ubicación actual
      const fallbackUrl = `https://wa.me/${phoneNumber.replace(/[^\d+]/g, '')}?text=${encodeURIComponent(message)}`;
      window.location.href = fallbackUrl;
      return true;
    } catch (error) {
      console.log('❌ Método de respaldo falló:', error);
      return false;
    }
  };

  const sendToWhatsApp = async (orderData) => {
    const orderNumber = generateOrderNumber();
    const currency = getCurrentCurrency();
    const device = detectDevice();
    
    console.log('🚀 Iniciando envío a WhatsApp...');
    console.log('📱 Dispositivo:', device);
    console.log('📞 Número de WhatsApp:', STORE_WHATSAPP);
    
    let message = `🛒 *NUEVO PEDIDO #${orderNumber}*\n\n`;
    message += `---------------------------------------------------------------\n`;
    message += `👤 *INFORMACIÓN DEL CLIENTE*\n`;
    message += `---------------------------------------------------------------\n`;
    message += `📝 *Nombre Completo:* ${firstName} ${lastName}\n`;
    message += `📧 *Correo Electrónico:* ${email}\n`;
    message += `💱 *Moneda seleccionada:* ${currency.flag} ${currency.name} (${currency.code})\n\n`;
    
    // Información del servicio con mejor formato
    message += `🚚 *DETALLES DE ENTREGA*\n`;
    message += `---------------------------------------------------------------\n`;
    
    if (selectedAddress.serviceType === SERVICE_TYPES.HOME_DELIVERY) {
      const zoneName = SANTIAGO_ZONES.find(z => z.id === selectedAddress.zone)?.name;
      message += `📦 *Modalidad:* Entrega a domicilio\n`;
      message += `📍 *Zona de entrega:* ${zoneName}\n`;
      message += `🏠 *Dirección completa:* ${selectedAddress.addressInfo}\n`;
      message += `👤 *Persona que recibe:* ${selectedAddress.receiverName}\n`;
      message += `📱 *Teléfono del receptor:* ${selectedAddress.receiverPhone}\n`;
      message += `💰 *Costo de entrega:* ${formatPriceWithCode(deliveryCost)}\n`;
    } else {
      message += `📦 *Modalidad:* Recoger en tienda\n`;
      message += `🏪 *Ubicación:* Yero Shop! - Santiago de Cuba\n`;
      if (selectedAddress.additionalInfo) {
        message += `📝 *Información adicional:* ${selectedAddress.additionalInfo}\n`;
      }
    }
    
    message += `📞 *Teléfono de contacto:* ${selectedAddress.mobile}\n\n`;
    
    // Productos con iconos y mejor formato
    message += `🛍️ *PRODUCTOS SOLICITADOS*\n`;
    message += `──────────────────────────────────────────────────────────────\n`;
    cartFromContext.forEach((item, index) => {
      const productIcon = getProductIcon(item.category);
      const colorHex = item.colors[0]?.color || '#000000';
      const subtotal = item.price * item.qty;
      
      message += `${index + 1}. ${productIcon} *${item.name}*\n`;
      message += `   🎨 *Color:* ${colorHex}\n`;
      message += `   📊 *Cantidad:* ${item.qty} unidad${item.qty > 1 ? 'es' : ''}\n`;
      message += `   💵 *Precio unitario:* ${formatPriceWithCode(item.price)}\n`;
      message += `   💰 *Subtotal:* ${formatPriceWithCode(subtotal)}\n`;
      message += `   ─────────────────────────────────────────────────────────\n`;
    });
    
    // Resumen financiero profesional
    message += `\n💳 *RESUMEN FINANCIERO*\n`;
    message += `──────────────────────────────────────────────────────────────\n`;
    message += `🛍️ *Subtotal productos:* ${formatPriceWithCode(totalAmountFromContext)}\n`;
    
    if (activeCoupon) {
      message += `🎫 *Descuento aplicado (${activeCoupon.couponCode} - ${activeCoupon.discountPercent}%):* -${formatPriceWithCode(Math.abs(priceAfterCouponApplied))}\n`;
    }
    
    if (deliveryCost > 0) {
      message += `🚚 *Costo de entrega:* ${formatPriceWithCode(deliveryCost)}\n`;
    }
    
    message += `───────────────────────────────────────────────────────────────\n`;
    message += `💰 *TOTAL A PAGAR: ${formatPriceWithCode(finalPriceToPay)}*\n`;
    message += `💱 *Moneda: ${currency.flag} ${currency.name} (${currency.code})*\n`;
    message += `───────────────────────────────────────────────────────────────\n\n`;
    
    // Información adicional profesional
    message += `📅 *Fecha y hora del pedido:*\n`;
    message += `${new Date().toLocaleString('es-CU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Havana'
    })}\n\n`;
    
    message += `📋 *Instrucciones importantes:*\n`;
    message += `• Confirme la disponibilidad de los productos\n`;
    message += `• Verifique la dirección de entrega\n`;
    message += `• Coordine horario de entrega/recogida\n`;
    message += `• Mantenga este número de pedido para referencia\n`;
    message += `• Los precios están en ${currency.name} (${currency.code})\n\n`;
    
    message += `🏪 *Yero Shop!*\n`;
    message += `"La tienda online de compras hecha a tu medida" ✨\n`;
    message += `📍 Santiago de Cuba, Cuba\n`;
    message += `📱 WhatsApp: ${STORE_WHATSAPP}\n`;
    message += `🌐 Tienda online: https://yeroshop.vercel.app\n\n`;
    message += `¡Gracias por confiar en nosotros! 🙏\n`;
    message += `Su satisfacción es nuestra prioridad 💯`;

    // Generar URLs según el dispositivo
    const whatsappUrls = generateWhatsAppURL(message, STORE_WHATSAPP);
    
    // Mostrar notificación específica según el dispositivo
    let deviceMessage = '';
    if (device.isIOS) {
      deviceMessage = '📱 Abriendo WhatsApp en iOS...';
    } else if (device.isAndroid) {
      deviceMessage = '🤖 Abriendo WhatsApp en Android...';
    } else if (device.isMacOS) {
      deviceMessage = '💻 Abriendo WhatsApp en macOS...';
    } else if (device.isWindows) {
      deviceMessage = '🪟 Abriendo WhatsApp en Windows...';
    } else if (device.isLinux) {
      deviceMessage = '🐧 Abriendo WhatsApp en Linux...';
    } else {
      deviceMessage = '🌐 Abriendo WhatsApp...';
    }
    
    toastHandler(ToastType.Info, deviceMessage);
    
    // Intentar abrir WhatsApp con múltiples métodos
    const success = await tryOpenWhatsApp(whatsappUrls, orderNumber);
    
    if (success) {
      console.log('✅ WhatsApp abierto exitosamente');
      toastHandler(ToastType.Success, `✅ Pedido #${orderNumber} enviado a WhatsApp`);
    } else {
      console.log('❌ No se pudo abrir WhatsApp automáticamente');
      
      // Fallback: mostrar información manual con instrucciones específicas
      let fallbackMessage = '';
      if (device.isMobile || device.isTablet) {
        fallbackMessage = `📱 Por favor, abre WhatsApp manualmente y envía un mensaje a ${STORE_WHATSAPP} con el número de pedido #${orderNumber}`;
      } else {
        fallbackMessage = `💻 Por favor, abre WhatsApp Web (web.whatsapp.com) o la aplicación y contacta a ${STORE_WHATSAPP} con el pedido #${orderNumber}`;
      }
      
      toastHandler(ToastType.Warn, fallbackMessage);
      
      // Copiar número al portapapeles como ayuda adicional
      try {
        await navigator.clipboard.writeText(STORE_WHATSAPP);
        toastHandler(ToastType.Info, `📋 Número de WhatsApp copiado: ${STORE_WHATSAPP}`);
      } catch (error) {
        console.log('No se pudo copiar al portapapeles:', error);
        // Mostrar el número en una alerta como último recurso
        alert(`Número de WhatsApp: ${STORE_WHATSAPP}\nPedido: #${orderNumber}`);
      }
    }
    
    return orderNumber;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toastHandler(ToastType.Error, 'Por favor selecciona una dirección de entrega');
      return;
    }

    setIsProcessing(true);

    try {
      // Animación de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderNumber = await sendToWhatsApp({
        orderNumber: generateOrderNumber(),
        customer: { firstName, lastName, email },
        address: selectedAddress,
        products: cartFromContext,
        pricing: {
          subtotal: totalAmountFromContext,
          deliveryCost,
          coupon: activeCoupon,
          total: finalPriceToPay
        }
      });

      await clearCartDispatch();
      updateCheckoutStatus({ showSuccessMsg: true });

      Popper();
      toastHandler(ToastType.Success, `🎉 Pedido #${orderNumber} procesado exitosamente`);

      timer.current = setTimeout(() => {
        updateCheckoutStatus({ showSuccessMsg: false });
        navigate('/');
      }, 4000);

    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toastHandler(ToastType.Error, 'Error al procesar el pedido');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <article className={styles.checkout}>
      <div className={styles.checkoutHeader}>
        <h3 className={styles.priceTitle}>
          <span className={styles.titleIcon}>💰</span>
          <span className={styles.titleText}>Detalles del Precio</span>
          <div className={styles.titleUnderline}></div>
        </h3>
      </div>

      <CouponSearch
        activeCoupon={activeCoupon}
        updateActiveCoupon={updateActiveCoupon}
      />

      <hr />

      <div className={styles.priceBreakdown}>
        <div className={styles.row}>
          <span>
            🛍️ Precio ({totalCountFromContext} artículo{totalCountFromContext > 1 && 's'})
          </span>
          <Price amount={totalAmountFromContext} />
        </div>

        {activeCoupon && (
          <div className={styles.row}>
            <div className={styles.couponApplied}>
              <VscChromeClose
                type='button'
                className={styles.closeBtn}
                onClick={cancelCoupon}
              />{' '}
              <p className={styles.couponText}>
                🎫 Cupón {activeCoupon.couponCode} aplicado ({activeCoupon.discountPercent}%)
              </p>
            </div>
            <Price amount={priceAfterCouponApplied} />
          </div>
        )}

        <div className={styles.row}>
          <span>
            {selectedAddress?.serviceType === SERVICE_TYPES.HOME_DELIVERY 
              ? '🚚 Entrega a domicilio' 
              : '📦 Gastos de Envío'
            }
          </span>
          <Price amount={deliveryCost} />
        </div>
      </div>

      <hr />

      <div className={`${styles.row} ${styles.totalPrice}`}>
        <span>💰 Precio Total</span>
        <Price amount={finalPriceToPay} />
      </div>

      <button 
        onClick={handlePlaceOrder} 
        className={`btn btn-width-100 ${styles.orderBtn} ${isProcessing ? styles.processing : ''}`}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <div className={styles.processingContent}>
            <span className={styles.spinner}></span>
            Procesando pedido...
          </div>
        ) : (
          <>
            <span className={styles.whatsappIcon}>📱</span>
            Realizar Pedido por WhatsApp
          </>
        )}
      </button>
    </article>
  );
};

export default CheckoutDetails;