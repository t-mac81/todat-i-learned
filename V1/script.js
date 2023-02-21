'use strict';
const CATEGORIES = [
  { name: 'technology', color: '#3b82f6' },
  { name: 'science', color: '#16a34a' },
  { name: 'finance', color: '#ef4444' },
  { name: 'society', color: '#eab308' },
  { name: 'entertainment', color: '#db2777' },
  { name: 'health', color: '#14b8a6' },
  { name: 'history', color: '#f97316' },
  { name: 'news', color: '#8b5cf6' },
];

const initialFacts = [
  {
    id: 1,
    text: 'React is being developed by Meta (formerly facebook)',
    source: 'https://opensource.fb.com/',
    category: 'technology',
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: 'Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%',
    source:
      'https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids',
    category: 'society',
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: 'Lisbon is the capital of Portugal',
    source: 'https://en.wikipedia.org/wiki/Lisbon',
    category: 'society',
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

// load data from supabase
const getData = async function () {
  try {
    const res = await fetch(
      'https://urkohljbvlibwnxvmguo.supabase.co/rest/v1/facts',
      {
        headers: {
          apikey:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVya29obGpidmxpYndueHZtZ3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY4MjQwNjksImV4cCI6MTk5MjQwMDA2OX0.YZIdr1y_uwD9oZtR4UNLcOh7lTbSUW_etVhbglzLZ8c',
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVya29obGpidmxpYndueHZtZ3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY4MjQwNjksImV4cCI6MTk5MjQwMDA2OX0.YZIdr1y_uwD9oZtR4UNLcOh7lTbSUW_etVhbglzLZ8c',
        },
      }
    );
    const data = await res.json();
    console.log(data);
    createFactsList(data);
  } catch (e) {
    console.log(e);
  }
};

getData();
// select DOM elements
const btn = document.querySelector('.btn-open');
const form = document.querySelector('.fact-form');
const factList = document.querySelector('.facts-list');

//Create DOM elements:
factList.innerHTML = '';

const createFactsList = function (dataArr) {
  const htmlArr = dataArr.map((fact) => {
    return `
    <li class="fact">
        <p>
        ${fact.text}<a
            class="source"
            href="${fact.source}"
            target="_blank"
            >(Source)</a
        >
        </p>
        <span class="tag" style="background-color: ${
          CATEGORIES.find((category) => category.name === fact.category).color
        }"
        >${fact.category}</span
        >
        <div class="vote-buttons">
            <button>👍 ${fact.votesInteresting}</button>
            <button>🤯 ${fact.votesMindblowing}</button>
            <button>⛔️ ${fact.votesFalse}</button>
        </div>
    </li>`;
  });

  const html = htmlArr.join('');
  factList.insertAdjacentHTML('afterbegin', html);
};

// createFactsList(initialFacts);

// toggle form visibility
btn.addEventListener('click', () => {
  if (form.classList.contains('hidden')) {
    form.classList.remove('hidden');
    btn.textContent = 'Close';
  } else {
    form.classList.add('hidden');
    btn.textContent = 'Share A Fact';
  }
});
