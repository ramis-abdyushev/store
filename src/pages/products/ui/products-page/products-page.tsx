import { memo, useCallback, useMemo, useState } from 'react';
import { ProductsList } from '../products-list/products-list';
import { ProductsListSkeleton } from '../products-list/products-list-skeleton';
import classes from './products-page.module.scss';
import { useGetProductsQuery } from 'entities/product';
import { MenuItem, Pagination, SearchField, TextField } from 'shared/ui';

const pageLimitOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
];

export default memo(function ProductsPage() {
  const [pageLimit, setPageLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isFetching, error } = useGetProductsQuery({
    pageLimit,
    currentPage,
    searchQuery,
  });

  const maxPageNumber = useMemo(() => {
    return data?.total ? Math.ceil(data.total / pageLimit) : 0;
  }, [data?.total, pageLimit]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, []);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const changePageLimit = useCallback((newLimit: string) => {
    setPageLimit(+newLimit);
    setPage(1);
  }, []);

  return (
    <div className={classes.productsPage}>
      <div>
        <SearchField onChange={search} />
        <TextField select value={pageLimit} onChange={changePageLimit}>
          {pageLimitOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div>
        {error ? (
          <div>Ошибка: {JSON.stringify(error)}</div>
        ) : !data?.total && !isFetching ? (
          <div>Нет данных</div>
        ) : (
          <div>
            {isFetching ? (
              <ProductsListSkeleton limit={pageLimit} />
            ) : (
              data?.products && <ProductsList products={data.products} />
            )}
            {!!maxPageNumber && (
              <Pagination
                count={maxPageNumber}
                page={currentPage}
                onChange={setPage}
                size="large"
              />
            )}
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
});
