import { useEffect, useState } from 'react';
import './style.css';
import supabase from './supabase';
import CATEGORIES from './data';
import Header from './components/header';

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

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
        <NewFactForm
          factData={factData}
          setFactData={setFactData}
          setShowForm={setShowForm}
        />
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

function NewFactForm({ setFactData, setShowForm, factData }) {
  const [text, setText] = useState('');
  const [source, setSource] = useState('http://example.com');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  function handleSubmit(e) {
    //prevent page reload
    e.preventDefault();

    // check if data is valid
    if (text && isValidHttpUrl(source) && category) {
      // create new fact object
      const newFact = {
        text,
        source,
        category,
      };
      // send new row to supabase
      updateFacts(newFact);
    }
    // reset input fields
    setText('');
    setSource('');
    setCategory('');
    // 5. close the form
    setShowForm(false);
  }

  function updateFacts(newFact) {
    const sendData = async function () {
      setIsUploading(true);
      const { data, error } = await supabase
        .from('facts')
        .insert([newFact])
        .select();
      // update state so that new fact is displayed on top
      if (!error) setFactData(facts => [data[0], ...facts]);
      else alert('There was a problem sending data');
      setIsUploading(false);
    };
    sendData();
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        maxLength={200}
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={e => setSource(e.target.value)}
      />
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose Category:</option>
        {CATEGORIES.map(cat => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory('all')}
          >
            All
          </button>
        </li>
        {CATEGORIES.map(category => (
          <li className="category" key={category.name}>
            <button
              className="btn btn-category"
              style={{ backgroundColor: category.color }}
              onClick={() => setCurrentCategory(category.name)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ factData, setFactData }) {
  if (factData.length === 0)
    return (
      <p className="message">
        There are no facts in this category yet. Add the first one!
      </p>
    );

  return (
    <section>
      {' '}
      <ul className="facts-list">
        {factData.map(fact => (
          <Fact
            factData={factData}
            setFactData={setFactData}
            key={fact.id}
            fact={fact}
          />
        ))}
      </ul>
      <p>There are {factData.length} facts in the database, add your own!</p>
    </section>
  );
}

function Fact({ fact, factData, setFactData }) {
  const upvote = async (id, voteType, currentVotes) => {
    const { data, error } = await supabase
      .from('facts')
      .update({ [voteType]: currentVotes + 1 })
      .eq('id', id)
      .select();
    if (!error) {
      const index = factData.findIndex(fact => fact.id === data[0].id);

      setFactData(facts => {
        const factArr = [...facts];
        factArr[index] = data[0];
        return factArr;
      });
    } else alert('There was a problem sending the data.');
  };
  return (
    <li className="fact">
      <p>
        {fact.votesFalse > 5 ? (
          <span className="disputed">[⛔️ DISPUTED]</span>
        ) : null}
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noreferrer"
        >
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find(
            category => category.name === fact.category
          ).color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() =>
            upvote(fact.id, 'votesInteresting', fact.votesInteresting)
          }
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() =>
            upvote(fact.id, 'votesMindblowing', fact.votesMindblowing)
          }
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => upvote(fact.id, 'votesFalse', fact.votesFalse)}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

export default App;
