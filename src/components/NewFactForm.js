import { useState } from 'react';
import supabase from '../supabase';
import CATEGORIES from '../data';

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

function NewFactForm({ setFactData, setShowForm }) {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
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
export default NewFactForm;
