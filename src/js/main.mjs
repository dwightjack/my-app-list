import { app, h, text } from 'https://cdn.skypack.dev/hyperapp@2';

const initialState = {
  status: 'idle',
  repos: [],
};

const SetStatus = (state, status) => ({ ...state, status });

const GotProjects = (state, repos = []) => ({
  ...SetStatus(state, 'loaded'),
  repos,
});

function branch(prop, branches) {
  return branches[prop] || branches.default;
}

async function FetchProjects(dispatch) {
  dispatch(SetStatus, 'loading');

  try {
    const response = await fetch('/.netlify/functions/fetch-projects');
    if (!response.ok) {
      throw response;
    }
    dispatch(GotProjects, await response.json());
  } catch (error) {
    console.error(error);
    dispatch(SetStatus, 'error');
  }
}

function Link(href, txt) {
  return h('a', { target: '_blank', href }, text(txt));
}

function Label(txt) {
  return h('span', { class: 'label' }, text(txt));
}

function RepoItem({ name, topics, homepageUrl, description, url }) {
  return h('article', { class: 'card' }, [
    h('header', {}, h('h2', {}, Link(homepageUrl, name))),
    h('p', {}, [
      h('div', {}, text(description)),
      h('small', {}, Link(url, 'GitHub')),
    ]),
    h('p', { class: 'cluster' }, topics.map(Label)),
  ]);
}

app({
  init: [initialState, [FetchProjects]],
  node: document.getElementById('main'),
  view: ({ repos, status }) =>
    h(
      'main',
      {},
      branch(status, {
        loading: h('p', {}, text('Loading...')),
        loaded: h('div', {}, repos.map(RepoItem)),
        error: h('p', {}, text('Error')),
      }),
    ),
});
