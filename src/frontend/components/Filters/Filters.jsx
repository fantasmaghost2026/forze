import { FaStar } from 'react-icons/fa';
import { giveUniqueLabelFOR, midValue, toastHandler } from '../../utils/utils';
import styles from './Filters.module.css';

import { useFiltersContext } from '../../contexts/FiltersContextProvider';
import { useAllProductsContext } from '../../contexts/ProductsContextProvider';
import { MdClose } from 'react-icons/md';
import {
  FILTER_INPUT_TYPE,
  SORT_TYPE,
  ToastType,
  RATINGS,
} from '../../constants/constants';
import { Slider } from '@mui/material';
import { useEffect } from 'react';

const Filters = ({
  isFilterContainerVisible,
  handleFilterToggle,
  isMobile,
}) => {
  const {
    minPrice: minPriceFromContext,
    maxPrice: maxPriceFromContext,
    filters,
    updateFilters,
    updatePriceFilter,
    updateCategoryFilter,
    clearFilters,
  } = useFiltersContext();

  const { products: productsFromProductContext } = useAllProductsContext();

  const {
    category: categoryFromContext,
    company: companyFromContext,
    price: priceFromContext,
    rating: ratingFromContext,
    sortByOption: sortByOptionFromContext,
  } = filters;

  // Obtener categorías y compañías de productos habilitados
  const enabledProducts = productsFromProductContext.filter(product => product && product.price > 0);
  
  const categoriesList = [
    ...new Set(enabledProducts.map((product) => product.category))
  ].filter(Boolean);
  
  const companiesList = [
    ...new Set(enabledProducts.map((product) => product.company))
  ].filter(Boolean);

  // Efecto para sincronizar el rango de precios cuando cambien los productos
  useEffect(() => {
    if (enabledProducts.length > 0) {
      const prices = enabledProducts.map(p => p.price);
      const currentMin = Math.min(...prices);
      const currentMax = Math.max(...prices);
      
      console.log(`🔄 Productos actualizados: ${enabledProducts.length} productos`);
      console.log(`📊 Rango actual en productos: ${currentMin.toLocaleString()} - ${currentMax.toLocaleString()}`);
      console.log(`📊 Rango en filtros: ${minPriceFromContext.toLocaleString()} - ${maxPriceFromContext.toLocaleString()}`);
    }
  }, [enabledProducts.length, minPriceFromContext, maxPriceFromContext]);

  const handleClearFilter = () => {
    clearFilters();
    toastHandler(ToastType.Success, 'Filtros limpiados exitosamente');
  };

  // Calcular valores para mostrar en el slider
  const displayMinPrice = Math.max(0, minPriceFromContext);
  const displayMaxPrice = Math.max(displayMinPrice + 1000, maxPriceFromContext);
  const currentPriceRange = [
    Math.max(displayMinPrice, priceFromContext[0]),
    Math.min(displayMaxPrice, priceFromContext[1])
  ];

  return (
    <form
      className={`${styles.filtersContainer} ${
        isFilterContainerVisible && isMobile && styles.showFiltersContainer
      }`}
      onSubmit={(e) => e.preventDefault()}
    >
      {isMobile && (
        <div>
          <MdClose onClick={handleFilterToggle} />
        </div>
      )}

      <header>
        <p>Filtros</p>
        <button className='btn btn-danger' onClick={handleClearFilter}>
          Limpiar Filtros
        </button>
      </header>

      <fieldset>
        <legend>Rango de Precio</legend>
        
        <div className={styles.priceInfo}>
          <small>Rango disponible: ${displayMinPrice.toLocaleString()} - ${displayMaxPrice.toLocaleString()} CUP</small>
        </div>

        <Slider
          name={FILTER_INPUT_TYPE.PRICE}
          getAriaLabel={() => 'Rango de precios'}
          valueLabelDisplay='auto'
          min={displayMinPrice}
          max={displayMaxPrice}
          value={currentPriceRange}
          onChange={updatePriceFilter}
          step={Math.max(1000, Math.floor((displayMaxPrice - displayMinPrice) / 100))}
          disableSwap
          valueLabelFormat={(value) => `$${value.toLocaleString()}`}
          style={{
            color: 'var(--primary-500)',
            width: '80%',
            margin: 'auto -1rem auto 1rem',
          }}
        />

        <div className={styles.flexSpaceBtwn}>
          <span>${displayMinPrice.toLocaleString()}</span>
          <span>${midValue(displayMinPrice, displayMaxPrice).toLocaleString()}</span>
          <span>${displayMaxPrice.toLocaleString()}</span>
        </div>
        
        <div className={styles.currentRange}>
          <strong>Seleccionado: ${currentPriceRange[0].toLocaleString()} - ${currentPriceRange[1].toLocaleString()}</strong>
        </div>
      </fieldset>

      <fieldset>
        <legend>Categoría</legend>

        {categoriesList.length > 0 ? (
          categoriesList.map((singleCategory, index) => (
            <div key={index}>
              <input
                type='checkbox'
                name={FILTER_INPUT_TYPE.CATEGORY}
                id={giveUniqueLabelFOR(singleCategory, index)}
                checked={categoryFromContext[singleCategory] || false}
                onChange={() => updateCategoryFilter(singleCategory)}
              />{' '}
              <label htmlFor={giveUniqueLabelFOR(singleCategory, index)}>
                {singleCategory}
              </label>
            </div>
          ))
        ) : (
          <p className={styles.noOptions}>No hay categorías disponibles</p>
        )}
      </fieldset>

      <fieldset>
        <legend>Marca</legend>

        <select
          name={FILTER_INPUT_TYPE.COMPANY}
          onChange={updateFilters}
          value={companyFromContext}
        >
          <option value='all'>Todas</option>
          {companiesList.map((company, index) => (
            <option key={giveUniqueLabelFOR(company, index)} value={company}>
              {company}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className={styles.ratingFieldset}>
        <legend>Calificación</legend>

        {RATINGS.map((singleRating, index) => (
          <div key={singleRating}>
            <input
              type='radio'
              name={FILTER_INPUT_TYPE.RATING}
              data-rating={singleRating}
              onChange={updateFilters}
              id={giveUniqueLabelFOR(`${singleRating} estrellas`, index)}
              checked={singleRating === ratingFromContext}
            />{' '}
            <label htmlFor={giveUniqueLabelFOR(`${singleRating} estrellas`, index)}>
              {singleRating} <FaStar /> y más
            </label>
          </div>
        ))}
      </fieldset>

      <fieldset>
        <legend>Ordenar Por</legend>

        {Object.values(SORT_TYPE).map((singleSortValue, index) => (
          <div key={singleSortValue}>
            <input
              type='radio'
              name={FILTER_INPUT_TYPE.SORT}
              data-sort={singleSortValue}
              onChange={updateFilters}
              id={giveUniqueLabelFOR(singleSortValue, index)}
              checked={singleSortValue === sortByOptionFromContext}
            />{' '}
            <label htmlFor={giveUniqueLabelFOR(singleSortValue, index)}>
              {singleSortValue}
            </label>
          </div>
        ))}
      </fieldset>
    </form>
  );
};

export default Filters;