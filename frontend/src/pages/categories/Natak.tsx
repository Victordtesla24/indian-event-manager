import CategoryPage from '../../components/categories/CategoryPage';
import { EVENT_CATEGORIES } from '../../constants/categories';

export default function Natak() {
  return (
    <CategoryPage category={EVENT_CATEGORIES.NATAK} title="Natak Events" />
  );
}
