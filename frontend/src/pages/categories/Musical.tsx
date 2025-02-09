import CategoryPage from '../../components/categories/CategoryPage';
import { EVENT_CATEGORIES } from '../../constants/categories';

export default function Musical() {
  return (
    <CategoryPage category={EVENT_CATEGORIES.MUSICAL} title="Musical Events" />
  );
}
