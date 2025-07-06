import { SORT_TYPE } from '../constants/constants';
import { FILTERS_ACTION } from '../utils/actions';
import {
  convertArrayToObjectWithPropertyFALSE,
  givePaginatedList,
  lowerizeAndCheckIncludes,
} from '../utils/utils';

export const initialFiltersState = {
  allProducts: [],
  filteredProducts: [],
  minPrice: 0,
  maxPrice: Infinity, // will be handled
  filters: {
    search: '',
    category: null,
    company: 'all',
    price: [0, 0],
    rating: -1,
    sortByOption: '',
  },
  paginateIndex: 0,
  displayableProductsLength: 0,
};

/* 
  category: {
    laptop: false,
    tv: false,
    earphone: false,
    smartwatch: false,
    mobile: false
  }
*/

// Función mejorada para calcular rangos de precio dinámicos y adaptativos
const calculateDynamicPriceRange = (products) => {
  console.log('🔍 Calculando rango de precios para', products?.length || 0, 'productos');
  
  if (!products || products.length === 0) {
    console.log('⚠️ No hay productos, usando rango por defecto');
    return { minPrice: 0, maxPrice: 100000 };
  }

  // Filtrar productos con precios válidos
  const validProducts = products.filter(product => 
    product && 
    typeof product.price === 'number' && 
    product.price > 0 && 
    !isNaN(product.price)
  );
  
  if (validProducts.length === 0) {
    console.log('⚠️ No hay productos con precios válidos, usando rango por defecto');
    return { minPrice: 0, maxPrice: 100000 };
  }

  const prices = validProducts.map(({ price }) => price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  console.log(`📊 Precios encontrados: Min=${minPrice.toLocaleString()}, Max=${maxPrice.toLocaleString()}`);
  
  // Calcular rango y margen adaptativo
  const priceRange = maxPrice - minPrice;
  
  // Margen adaptativo: 10% para rangos pequeños, 5% para rangos grandes
  const marginPercent = priceRange < 50000 ? 0.1 : 0.05;
  const margin = priceRange * marginPercent;
  
  // Aplicar margen con límites sensatos
  const adjustedMinPrice = Math.max(0, minPrice - margin);
  const adjustedMaxPrice = maxPrice + margin;
  
  // Redondeo inteligente basado en el rango de precios
  let roundingFactor;
  if (adjustedMaxPrice <= 10000) {
    roundingFactor = 100; // Redondear a centenas
  } else if (adjustedMaxPrice <= 100000) {
    roundingFactor = 1000; // Redondear a miles
  } else {
    roundingFactor = 10000; // Redondear a decenas de miles
  }
  
  const roundedMinPrice = Math.floor(adjustedMinPrice / roundingFactor) * roundingFactor;
  const roundedMaxPrice = Math.ceil(adjustedMaxPrice / roundingFactor) * roundingFactor;
  
  // Verificar que el rango sea sensato
  const finalMinPrice = Math.max(0, roundedMinPrice);
  const finalMaxPrice = Math.max(finalMinPrice + roundingFactor, roundedMaxPrice);
  
  console.log(`💰 Rango final calculado: ${finalMinPrice.toLocaleString()} - ${finalMaxPrice.toLocaleString()} CUP`);
  console.log(`🎯 Factor de redondeo usado: ${roundingFactor.toLocaleString()}`);
  console.log(`📈 Margen aplicado: ${marginPercent * 100}%`);
  
  return {
    minPrice: finalMinPrice,
    maxPrice: finalMaxPrice
  };
};

// Función para sincronizar el rango de precios con productos actualizados
const syncPriceRangeWithProducts = (state, newProducts) => {
  const { minPrice, maxPrice } = calculateDynamicPriceRange(newProducts);
  
  // Actualizar el rango de precios en los filtros si es necesario
  const currentPriceFilter = state.filters.price;
  const needsUpdate = 
    currentPriceFilter[0] < minPrice || 
    currentPriceFilter[1] > maxPrice ||
    (currentPriceFilter[0] === state.minPrice && currentPriceFilter[1] === state.maxPrice);
  
  const updatedPriceFilter = needsUpdate ? [minPrice, maxPrice] : currentPriceFilter;
  
  console.log(`🔄 Sincronización de precios: ${needsUpdate ? 'ACTUALIZADO' : 'MANTENIDO'}`);
  
  return {
    minPrice,
    maxPrice,
    priceFilter: updatedPriceFilter
  };
};

export const filtersReducer = (state, action) => {
  switch (action.type) {
    case FILTERS_ACTION.GET_PRODUCTS_FROM_PRODUCT_CONTEXT:
      const allProductsCloned = structuredClone(action.payload?.products);

      const filteredProducts = givePaginatedList(allProductsCloned);

      const allCategoryNames = action.payload?.categories
        ?.filter(category => !category.disabled) // Solo categorías habilitadas
        ?.map(({ categoryName }) => categoryName) || [];

      // Calcular rango de precios dinámico y adaptativo
      const { minPrice, maxPrice } = calculateDynamicPriceRange(allProductsCloned);

      return {
        ...state,
        allProducts: allProductsCloned,
        filteredProducts,
        minPrice,
        maxPrice,
        filters: {
          ...state.filters,
          category: convertArrayToObjectWithPropertyFALSE(allCategoryNames),
          price: [minPrice, maxPrice],
        },
      };

    case FILTERS_ACTION.UPDATE_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          category: {
            ...state.filters.category,
            [action.payloadCategory]:
              !state.filters.category[action.payloadCategory],
          },
        },
      };

    case FILTERS_ACTION.UPDATE_SEARCH_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.payloadSearch,
        },
      };

    // called onchange of filters
    case FILTERS_ACTION.UPDATE_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.payloadName]: action.payload.payloadValue,
        },
        paginateIndex: 0,
      };

    case FILTERS_ACTION.CHECK_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          category: {
            ...state.category,
            [action.payloadCategory]: true,
          },
        },
      };

    case FILTERS_ACTION.CLEAR_FILTERS:
      const { category } = state.filters;
      const allUncheckedCategoryObj = convertArrayToObjectWithPropertyFALSE(
        Object.keys(category)
      );
      
      // Recalcular rango de precios al limpiar filtros para asegurar sincronización
      const { minPrice: resetMinPrice, maxPrice: resetMaxPrice } = calculateDynamicPriceRange(state.allProducts);
      
      console.log('🧹 Limpiando filtros y recalculando rango de precios');
      
      return {
        ...state,
        minPrice: resetMinPrice,
        maxPrice: resetMaxPrice,
        filters: {
          ...state.filters,
          search: '',
          category: allUncheckedCategoryObj,
          company: 'all',
          price: [resetMinPrice, resetMaxPrice],
          rating: -1,
          sortByOption: '',
        },
        paginateIndex: 0,
      };

    case FILTERS_ACTION.UPDATE_PAGINATION:
      return {
        ...state,
        paginateIndex: action.payloadIndex,
      };

    case FILTERS_ACTION.APPLY_FILTERS:
      const { allProducts, filters } = state;

      const {
        search: searchText,
        category: categoryObjInState,
        company: companyInState,
        price: priceInState,
        rating: ratingInState,
        sortByOption,
      } = filters;

      const isAnyCheckboxChecked = Object.values(categoryObjInState).some(
        (categoryBool) => categoryBool
      );

      // this temp products will become filteredProducts
      let tempProducts = allProducts;

      // search handled here
      // company is not filtered here after submitting!!
      tempProducts = allProducts.filter(({ name }) => {
        const trimmedSearchText = searchText.trim();
        return lowerizeAndCheckIncludes(name, trimmedSearchText);
      });

      // category checkbox handled here
      if (isAnyCheckboxChecked) {
        tempProducts = tempProducts.filter(
          ({ category: categoryPropertyOfProduct }) =>
            categoryObjInState[categoryPropertyOfProduct]
        );
      }

      // company dropdown handled here
      if (companyInState !== 'all') {
        tempProducts = tempProducts.filter(
          ({ company: companyPropertyOfProduct }) =>
            companyPropertyOfProduct === companyInState
        );
      }

      // price handled here, no (if) condition, this will run always!!
      tempProducts = tempProducts.filter(
        ({ price: pricePropertyOfProduct }) => {
          const [currMinPriceRange, currMaxPriceRange] = priceInState;
          return (
            pricePropertyOfProduct >= currMinPriceRange &&
            pricePropertyOfProduct <= currMaxPriceRange
          );
        }
      );

      // ratings handled here, no (if) condition, this will run always!!
      tempProducts = tempProducts.filter(({ stars }) => stars >= ratingInState);

      // sort handled here!!, if sortByOption is '', ignore sorting
      if (!!sortByOption) {
        switch (sortByOption) {
          case SORT_TYPE.PRICE_LOW_TO_HIGH: {
            tempProducts = [...tempProducts].sort((a, b) => a.price - b.price);
            break;
          }

          case SORT_TYPE.PRICE_HIGH_TO_LOW: {
            tempProducts = [...tempProducts].sort((a, b) => b.price - a.price);
            break;
          }

          case SORT_TYPE.NAME_A_TO_Z: {
            tempProducts = [...tempProducts].sort((a, b) => {
              a = a.name.toLowerCase();
              b = b.name.toLowerCase();

              if (a > b) return 1;

              if (a < b) return -1;

              return 0;
            });
            break;
          }

          case SORT_TYPE.NAME_Z_TO_A: {
            tempProducts = [...tempProducts].sort((a, b) => {
              a = a.name.toLowerCase();
              b = b.name.toLowerCase();

              if (a > b) return -1;
              if (a < b) return 1;
              return 0;
            });

            break;
          }

          default:
            throw new Error(`${sortByOption} is not defined`);
        }
      }

      // pagination logic
      tempProducts = givePaginatedList(tempProducts);

      // Verificar si necesitamos sincronizar el rango de precios después del filtrado
      const filteredProductsFlat = tempProducts.flat();
      if (filteredProductsFlat.length > 0) {
        const { minPrice: filteredMinPrice, maxPrice: filteredMaxPrice } = calculateDynamicPriceRange(filteredProductsFlat);
        console.log(`🎯 Productos filtrados: rango ${filteredMinPrice.toLocaleString()} - ${filteredMaxPrice.toLocaleString()}`);
      }

      return {
        ...state,
        filteredProducts: tempProducts,
        displayableProductsLength: tempProducts.flat().length,
        paginateIndex: 0,
      };
    default:
      throw new Error(`Error: ${action.type} in filtersReducer does not exist`);
  }
};