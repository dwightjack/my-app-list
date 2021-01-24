import { app, h, text } from 'https://unpkg.com/hyperapp@2';

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
  h('article', { class: 'card' }, [
    h(
      'header',
      {},
      h('h2', {}, [
        h(
          'a',
          {
            href: homepageUrl,
            target: '_blank',
          },
          text(name),
        ),
      ]),
    ),
    h('p', {}, text(description)),
    h(
      'p',
      { class: 'cluster' },
      topics.map((topic) => h('span', { class: 'label' }, text(topic))),
    ),
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
      'main',
      {},
      branch(status, {
        loading: h('p', {}, text('Loading...')),
        loaded: h('div', {}, repos.map(repoItem)),
        error: h('p', {}, text('Error')),
      }),
    ),
});
