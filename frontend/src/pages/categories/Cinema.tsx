import CategoryPage from '../../components/categories/CategoryPage';
import { EVENT_CATEGORIES } from '../../constants/categories';

export default function Cinema() {
  return (
    <CategoryPage category={EVENT_CATEGORIES.CINEMA} title="Cinema Events" />
  );
}
