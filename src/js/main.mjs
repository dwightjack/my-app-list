// @ts-check
/**
 * @typedef {import("knockout")} ko
 */

/**
 * @typedef {Object} Repository
 * @property {string} name
 * @property {string} topics
 * @property {string} homepageUrl
 * @property {string} description
 * @property {string} url
 */

/**
 * @typedef {'idle' | 'loading' | 'loaded' | 'error'} Status
 */

class ViewModel {
  // oxlint-disable-next-line no-inline-comments
  status = ko.observable(/**  @type {Status} */ ("idle"));

  // oxlint-disable-next-line no-inline-comments
  repos = ko.observableArray(/**  @type {Repository[]} */ ([]));

  isLoading = ko.pureComputed(() => this.status() === "loading");

  isError = ko.pureComputed(() => this.status() === "error");

  async fetchProjects() {
    this.status("loading");

    try {
      const response = await fetch("/.netlify/functions/fetch-projects");
      if (!response.ok) {
        throw response;
      }
      this.status("loaded");
      this.repos.push(...(await response.json()));
    } catch (error) {
      console.error(error);
      this.status("error");
      this.repos.removeAll();
    }
  }
}
const vm = new ViewModel();
ko.applyBindings(vm, document.querySelector("#main"));

vm.fetchProjects();
