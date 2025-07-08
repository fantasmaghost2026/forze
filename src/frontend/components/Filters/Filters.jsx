import { FaStar } from 'react-icons/fa';
import { 
  giveUniqueLabelFOR, 
  toastHandler, 
  formatLargeNumber, 
  calculateOptimalMidValue 
} from '../../utils/utils';
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

  const categoriesList = [
    ...new Set(productsFromProductContext.map((product) => product.category)),
  ];
  const companiesList = [
    ...new Set(productsFromProductContext.map((product) => product.company)),
  ];

  const handleClearFilter = () => {
    clearFilters();
    toastHandler(ToastType.Success, 'Filtros limpiados exitosamente');
  };

  // Calcular el paso óptimo para el slider basado en el rango
  const calculateOptimalStep = (min, max) => {
    const range = max - min;
    
    if (range <= 1000) return 10;      // Pasos de 10 para rangos pequeños
    if (range <= 10000) return 100;    // Pasos de 100 para rangos medianos
    if (range <= 100000) return 1000;  // Pasos de 1000 para rangos grandes
    if (range <= 1000000) return 5000; // Pasos de 5000 para rangos muy grandes
    return 10000;                       // Pasos de 10000 para rangos enormes
  };

  const optimalStep = calculateOptimalStep(minPriceFromContext, maxPriceFromContext);
  const midValue = calculateOptimalMidValue(minPriceFromContext, maxPriceFromContext);

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

        <div className={styles.priceRangeInfo}>
          <small>
            Rango: ${formatLargeNumber(minPriceFromContext)} - ${formatLargeNumber(maxPriceFromContext)} CUP
          </small>
        </div>

        <Slider
          name={FILTER_INPUT_TYPE.PRICE}
          getAriaLabel={() => 'Distancia mínima'}
          valueLabelDisplay='auto'
          min={minPriceFromContext}
          max={maxPriceFromContext}
          value={priceFromContext}
          onChange={updatePriceFilter}
          step={optimalStep}
          disableSwap
          style={{
            color: 'var(--primary-500)',
            width: '80%',
            margin: 'auto -1rem auto 1rem',
          }}
        />

        <div className={styles.flexSpaceBtwn}>
          <span>${formatLargeNumber(minPriceFromContext)}</span>
          <span>${formatLargeNumber(midValue)}</span>
          <span>${formatLargeNumber(maxPriceFromContext)}</span>
        </div>

        <div className={styles.selectedRange}>
          <small>
            Seleccionado: ${formatLargeNumber(priceFromContext[0])} - ${formatLargeNumber(priceFromContext[1])} CUP
          </small>
        </div>
      </fieldset>

      <fieldset>
        <legend>Categoría</legend>

        {categoriesList.map((singleCategory, index) => (
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
        ))}
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