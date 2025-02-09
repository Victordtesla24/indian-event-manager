import CategoryPage from '../../components/categories/CategoryPage';
import { EVENT_CATEGORIES } from '../../constants/categories';

export default function Musicals() {
  return (
    <CategoryPage category={EVENT_CATEGORIES.MUSICAL} title="Musical Events" />
  );
}
