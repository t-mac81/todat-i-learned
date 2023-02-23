import supabase from '../supabase';
import CATEGORIES from '../data';

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
  const handleVote = async (id, voteType, currentVotes) => {
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
            handleVote(fact.id, 'votesInteresting', fact.votesInteresting)
          }
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() =>
            handleVote(fact.id, 'votesMindblowing', fact.votesMindblowing)
          }
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button
          onClick={() => handleVote(fact.id, 'votesFalse', fact.votesFalse)}
        >
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default FactList;
