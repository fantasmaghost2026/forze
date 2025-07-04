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

  const sendToWhatsApp = async (orderData) => {
    const orderNumber = generateOrderNumber();
    const currency = getCurrentCurrency();
    
    let message = `🛒 *NUEVO PEDIDO #${orderNumber}*\n\n`;
    message += `═══════════════════════════════════════════════════════════════\n`;
    message += `👤 *INFORMACIÓN DEL CLIENTE*\n`;
    message += `═══════════════════════════════════════════════════════════════\n`;
    message += `📝 *Nombre Completo:* ${firstName} ${lastName}\n`;
    message += `📧 *Correo Electrónico:* ${email}\n`;
    message += `💱 *Moneda seleccionada:* ${currency.flag} ${currency.name} (${currency.code})\n\n`;
    
    // Información del servicio con mejor formato
    message += `🚚 *DETALLES DE ENTREGA*\n`;
    message += `═══════════════════════════════════════════════════════════════\n`;
    
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
    message += `═══════════════════════════════════════════════════════════════\n`;
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
    message += `═══════════════════════════════════════════════════════════════\n`;
    message += `🛍️ *Subtotal productos:* ${formatPriceWithCode(totalAmountFromContext)}\n`;
    
    if (activeCoupon) {
      message += `🎫 *Descuento aplicado (${activeCoupon.couponCode} - ${activeCoupon.discountPercent}%):* -${formatPriceWithCode(Math.abs(priceAfterCouponApplied))}\n`;
    }
    
    if (deliveryCost > 0) {
      message += `🚚 *Costo de entrega:* ${formatPriceWithCode(deliveryCost)}\n`;
    }
    
    message += `═══════════════════════════════════════════════════════════════\n`;
    message += `💰 *TOTAL A PAGAR: ${formatPriceWithCode(finalPriceToPay)}*\n`;
    message += `💱 *Moneda: ${currency.flag} ${currency.name} (${currency.code})*\n`;
    message += `═══════════════════════════════════════════════════════════════\n\n`;
    
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

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\s+/g, '')}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
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
      toastHandler(ToastType.Success, `🎉 Pedido #${orderNumber} enviado exitosamente`);

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