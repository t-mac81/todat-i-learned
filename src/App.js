import { useEffect, useState } from 'react';
import './style.css';
import supabase from './supabase';
import Header from './components/header';
import NewFactForm from './components/NewFactForm';
import CategoryFilter from './components/CategoryFilter';
import FactList from './components/FactList';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [factData, setFactData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    const getData = async function () {
      setIsLoading(true);

      let query = supabase.from('facts').select('*');

      if (currentCategory !== 'all')
        query = query.eq('category', currentCategory);

      let { data: facts, error } = await query.order('votesInteresting', {
        ascending: false,
      });

      if (!error) setFactData(facts);
      else alert('There was a problem getting data...');
      setIsLoading(false);
    };
    getData();
  }, [currentCategory]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFactData={setFactData} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList factData={factData} setFactData={setFactData} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

export default App;
