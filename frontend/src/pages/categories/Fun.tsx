import CategoryPage from '../../components/categories/CategoryPage';
import { EVENT_CATEGORIES } from '../../constants/categories';

export default function Fun() {
  return (
    <CategoryPage category={EVENT_CATEGORIES.FUN} title="Fun Events" />
  );
}
