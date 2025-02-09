import CategoryPage from '../../components/categories/CategoryPage';
import { EVENT_CATEGORIES } from '../../constants/categories';

export default function Folk() {
  return (
    <CategoryPage category={EVENT_CATEGORIES.FOLK} title="Folk Events" />
  );
}
