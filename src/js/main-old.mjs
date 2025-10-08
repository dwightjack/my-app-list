//@ts-check
import { reactive, html } from 'https://esm.sh/@arrow-js/core';

/**
 * @typedef {Object} Repository
 * @property {string} name
 * @property {string} topics
 * @property {string} homepageUrl
 * @property {string} description
 * @property {string} url
 */

/**
 * @typedef {Object} Data
 * @property {'idle' | 'loading' | 'loaded' | 'error'} status
 * @property {Repository[]} repos
 */

/**
 * @type {Data}
 */
const data = reactive({
  status: 'idle',
  repos: [],
});

function branch(branches) {
  return branches[data.status] || branches.default;
}

async function fetchProjects() {
  data.status = 'loading';

  try {
    const response = await fetch('/.netlify/functions/fetch-projects');
    if (!response.ok) {
      throw response;
    }
    Object.assign(data, {
      status: 'loaded',
      repos: await response.json(),
    });
  } catch (error) {
    console.error(error);
    Object.assign(data, {
      status: 'error',
      repos: [],
    });
  }
}

/**
 *
 * @param {Repository} repository
 * @returns
 */
function RepoItem({ name, topics, homepageUrl, description, url }) {
  return html`<article class="card">
    <header>
      <h2>
        <a href="${homepageUrl}" target="_blank">${name}</a>
      </h2>
    </header>
    <p>
      ${description}<br />
      <small>
        <a href="${url}" target="_blank">GitHub</a>
      </small>
    </p>
    <p>${topics.map((txt) => html`<span class="label">${txt}</span>`)}</p>
  </article>`.key(url);
}

const template = html`${() =>
  branch({
    loading: html`<p>Loading...</p>`,
    loaded: data.repos.map(RepoItem),
    error: html`<p>Error!</p>`,
  })}`;

template(document.getElementById('main'));

fetchProjects();
