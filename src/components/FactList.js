import supabase from '../supabase';
import CATEGORIES from '../data';
import { useState } from 'react';

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
          <Fact setFactData={setFactData} key={fact.id} fact={fact} />
        ))}
      </ul>
      <p>There are {factData.length} facts in the database, add your own!</p>
    </section>
  );
}

function Fact({ fact, setFactData }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleVote = async (id, voteType, currentVotes) => {
    setIsUpdating(true);
    const { data, error } = await supabase
      .from('facts')
      .update({ [voteType]: currentVotes + 1 })
      .eq('id', id)
      .select();
    if (!error) {
      setFactData(facts =>
        facts.map(f => (f.id === data[0].id ? (f = data[0]) : f))
      );
    } else alert('There was a problem sending the data.');
    setIsUpdating(false);
  };
  return (
    <li className="fact">
      <p>
        {fact.votesFalse > 4 ? (
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
            handleVote(fact.id, 'votesInteresting', fact.votesInteresting)
          }
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() =>
            handleVote(fact.id, 'votesMindblowing', fact.votesMindblowing)
          }
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button
          onClick={() => handleVote(fact.id, 'votesFalse', fact.votesFalse)}
          disabled={isUpdating}
        >
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default FactList;
