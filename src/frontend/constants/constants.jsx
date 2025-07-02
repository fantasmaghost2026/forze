import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter } from 'react-icons/ai';
import { v4 as uuid } from 'uuid';

export const FOOTER_LINKS = [
  {
    id: 1,
    icon: <AiOutlineTwitter />,
    url: 'https://twitter.com/Swastik2001',
  },
  {
    id: 2,
    icon: <AiFillLinkedin />,
    url: 'https://www.linkedin.com/in/swastik-patro-2a54bb19b/',
  },
  {
    id: 3,
    icon: <AiFillGithub />,
    url: 'https://github.com/swastikpatro',
  },
];

export const ToastType = {
  Warn: 'warn',
  Info: 'info',
  Success: 'success',
  Error: 'error',
};

export const SORT_TYPE = {
  PRICE_LOW_TO_HIGH: 'precio: menor a mayor',
  PRICE_HIGH_TO_LOW: 'precio: mayor a menor',
  NAME_A_TO_Z: 'nombre: a a z',
  NAME_Z_TO_A: 'nombre: z a a',
};

export const RATINGS = [4, 3, 2, 1];

export const TEST_USER = {
  email: 'yero.shop@gmail.com',
  password: 'yeroi1234',
};

export const SUPER_ADMIN = {
  email: 'admin@gadaelectronics.com',
  password: 'root',
};

export const GUEST_USER = {
  email: 'invitado@tienda.com',
  password: '123456',
};

export const LOCAL_STORAGE_KEYS = {
  User: 'user',
  Token: 'token',
  StoreConfig: 'storeConfig',
};

export const LOGIN_CLICK_TYPE = {
  GuestClick: 'guest',
  RegisterClick: 'register',
  AdminClick: 'admin',
};

export const INCREMENT_DECRMENT_TYPE = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
};

export const FILTER_INPUT_TYPE = {
  PRICE: 'price',
  COMPANY: 'company',
  SORT: 'sortByOption',
  RATING: 'rating',
  CATEGORY: 'category',
};

export const DELAY_TO_SHOW_LOADER = 500;
export const DELAY_DEBOUNCED_MS = 250;
export const TOTAL_SKELETONS_LENGTH = 10;
export const DELAY_BETWEEN_BLUR_AND_CLICK = 250;
export const CUSTOM_TOASTID = 1;
export const ITEMS_PER_PAGE = 9;

export const ALL_STATES = [
  'Andalucía',
  'Aragón',
  'Asturias',
  'Baleares',
  'Canarias',
  'Cantabria',
  'Castilla-La Mancha',
  'Castilla y León',
  'Cataluña',
  'Ceuta',
  'Comunidad de Madrid',
  'Comunidad Foral de Navarra',
  'Comunidad Valenciana',
  'Extremadura',
  'Galicia',
  'La Rioja',
  'Melilla',
  'País Vasco',
  'Región de Murcia',
];

export const SERVICE_TYPES = {
  HOME_DELIVERY: 'home_delivery',
  PICKUP: 'pickup'
};

// Zonas de Santiago de Cuba con costos de entrega - ACTUALIZADAS
export const SANTIAGO_ZONES = [
  {
    "id": "centro",
    "name": "Nuevo Vista Alegre",
    "cost": 100
  },
  {
    "id": "vista_alegre",
    "name": "Vista Alegre",
    "cost": 350
  },
  {
    "id": "sueno",
    "name": "Sueño",
    "cost": 300
  },
  {
    "id": "san_pedrito",
    "name": "San Pedrito",
    "cost": 250
  },
  {
    "id": "altamira",
    "name": "Altamira",
    "cost": 500
  },
  {
    "id": "reparto_flores",
    "name": "Versalles",
    "cost": 600
  },
  {
    "id": "chicharrones",
    "name": "Chicharrones",
    "cost": 400
  },
  {
    "id": "los_olmos",
    "name": "Veguita de Galo",
    "cost": 350
  },
  {
    "id": "santa_barbara",
    "name": "Santa Bárbara",
    "cost": 500
  },
  {
    "id": "micro_9",
    "name": "Micro 7, 8 , 9",
    "cost": 500
  },
  {
    "id": "micro_4",
    "name": "Micro 4",
    "cost": 100
  },
  {
    "id": "alameda",
    "name": "Alameda",
    "cost": 250
  },
  {
    "id": "puerto",
    "name": "Los Pinos",
    "cost": 400
  },
  {
    "id": "siboney",
    "name": "Pastorita",
    "cost": 400
  },
  {
    "id": "ciudamar",
    "name": "Rajayoga",
    "cost": 400
  },
  {
    "id": "planta",
    "name": "Planta",
    "cost": 400
  },
  {
    "id": "tivoli",
    "name": "Tivoli",
    "cost": 350
  },
  {
    "id": "reparto_militar_(la_ceiba)",
    "name": "Reparto Militar (la ceiba)",
    "cost": 500
  },
  {
    "id": "30_de_noviembre",
    "name": "30 de Noviembre",
    "cost": 500
  },
  {
    "id": "centro_de_la_ciudad",
    "name": "Centro de la Ciudad",
    "cost": 300
  }
];

// Cupones de descuento - ACTUALIZADOS
export const COUPONS = [
  {
    "couponCode": "YERO - VIP",
    "text": "100% Descuento",
    "discountPercent": 55,
    "minCartPriceRequired": 300000,
    "id": "b6c7a585-79a2-4fde-93cd-80422ef3acfa"
  },
  {
    "couponCode": "YERO - EXCLUSIVO",
    "text": "20% Descuento",
    "discountPercent": 20,
    "minCartPriceRequired": 200000,
    "id": "ecdff7ad-f653-467f-9257-7fcd0fdea3a8"
  },
  {
    "couponCode": "YERO - SECRETO",
    "text": "10% Descuento",
    "discountPercent": 10,
    "minCartPriceRequired": 100000,
    "id": "4898bd1c-7227-47b0-b6fe-32159f71072b"
  },
  {
    "couponCode": "YERO - LIMITADO",
    "text": "5% Descuento",
    "discountPercent": 5,
    "minCartPriceRequired": 50000,
    "id": "12ee6cb8-1d2d-463d-b9f7-78bcd415c2e4"
  }
];

export const CHARGE_AND_DISCOUNT = {
  deliveryCharge: 0,
  discount: 0,
};

export const MIN_DISTANCE_BETWEEN_THUMBS = 1000;
export const MAX_RESPONSES_IN_CACHE_TO_STORE = 50;

// WhatsApp de la tienda - ACTUALIZADO
export const STORE_WHATSAPP = '+53 54690878';

// Configuración por defecto de la tienda - ACTUALIZADA
export const DEFAULT_STORE_CONFIG = {
  "storeName": "Gada Electronics",
  "whatsappNumber": "+53 54690878",
  "storeAddress": "Santiago de Cuba, Cuba",
  "lastModified": "2025-07-02T07:43:24.840Z",
  "version": "1.0.0"
};

// CÓDIGOS DE PAÍSES ACTUALIZADOS CON CUBA INCLUIDO
export const COUNTRY_CODES = [
  { code: '+53', country: 'Cuba', flag: '🇨🇺', minLength: 8, maxLength: 8 },
  { code: '+1', country: 'Estados Unidos/Canadá', flag: '🇺🇸', minLength: 10, maxLength: 10 },
  { code: '+52', country: 'México', flag: '🇲🇽', minLength: 10, maxLength: 10 },
  { code: '+54', country: 'Argentina', flag: '🇦🇷', minLength: 10, maxLength: 11 },
  { code: '+55', country: 'Brasil', flag: '🇧🇷', minLength: 10, maxLength: 11 },
  { code: '+56', country: 'Chile', flag: '🇨🇱', minLength: 8, maxLength: 9 },
  { code: '+57', country: 'Colombia', flag: '🇨🇴', minLength: 10, maxLength: 10 },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪', minLength: 10, maxLength: 10 },
  { code: '+34', country: 'España', flag: '🇪🇸', minLength: 9, maxLength: 9 },
  { code: '+33', country: 'Francia', flag: '🇫🇷', minLength: 10, maxLength: 10 },
  { code: '+39', country: 'Italia', flag: '🇮🇹', minLength: 10, maxLength: 10 },
  { code: '+49', country: 'Alemania', flag: '🇩🇪', minLength: 10, maxLength: 12 },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧', minLength: 10, maxLength: 10 },
  { code: '+7', country: 'Rusia', flag: '🇷🇺', minLength: 10, maxLength: 10 },
  { code: '+86', country: 'China', flag: '🇨🇳', minLength: 11, maxLength: 11 },
  { code: '+81', country: 'Japón', flag: '🇯🇵', minLength: 10, maxLength: 11 },
  { code: '+82', country: 'Corea del Sur', flag: '🇰🇷', minLength: 10, maxLength: 11 },
  { code: '+91', country: 'India', flag: '🇮🇳', minLength: 10, maxLength: 10 },
];

// ICONOS PARA PRODUCTOS POR CATEGORÍA
export const PRODUCT_CATEGORY_ICONS = {
  'laptop': '💻',
  'tv': '📺',
  'smartwatch': '⌚',
  'earphone': '🎧',
  'mobile': '📱',
  'smartphone': '📱',
  'tablet': '📱',
  'computer': '💻',
  'monitor': '🖥️',
  'keyboard': '⌨️',
  'mouse': '🖱️',
  'speaker': '🔊',
  'camera': '📷',
  'gaming': '🎮',
  'accessories': '🔌',
  'default': '📦'
};
