import { app, h, text } from 'https://unpkg.com/hyperapp';

const SetStatus = (state, status) => ({ ...state, status });

const GotProjects = (state, repos = []) => ({
  ...SetStatus(state, 'loaded'),
  repos,
});

function branch(prop, branches) {
  return branches[prop] || branches.default;
}

function FetchProjects(dispatch) {
  dispatch(SetStatus, 'loading');
  fetch('/.netlify/functions/fetch-projects')
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((data) => dispatch(GotProjects, data))
    .catch((error) => console.error(error) || dispatch(SetStatus, 'error'));
}

const repoItem = ({ name, topics, homepageUrl, description }) =>
  h('li', {}, [
    h('h2', {}, [h('a', { href: homepageUrl, target: '_blank' }, text(name))]),
    h('p', {}, text(description)),
    h('p', {}, text(topics.join(', '))),
  ]);

app({
  init: [
    {
      status: 'idle',
      repos: [],
    },
    [FetchProjects],
  ],
  node: document.getElementById('main'),
  view: ({ repos, status }) =>
    h(
      'div',
      {},
      branch(status, {
        loading: h('p', {}, text('Loading...')),
        loaded: h('ul', {}, repos.map(repoItem)),
        error: h('p', {}, text('Error')),
      }),
    ),
});
