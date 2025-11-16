
import { Category as CategoryType } from './types';
import { Category } from './components/Category';
import './index.css';

const initialCategory: CategoryType = {
  id: '1',
  name: 'Frontend',
  topics: [
    { id: '1', name: 'HTML' },
    { id: '2', name: 'CSS' },
    { id: '3', name: 'JavaScript' },
    { id: '4', name: 'React' },
  ],
};

function App() {
  return (
    <div className="App">
      <Category category={initialCategory} />
    </div>
  );
}

export default App;
