/**
 * @typedef {Object} Repository
 * @property {string} name
 * @property {string} topics
 * @property {string} homepageUrl
 * @property {string} description
 * @property {string} url
 */

/**
 * @typedef {()=> T} Observable<T>
 * @template {any} T
 */

/**
 * @typedef {'idle' | 'loading' | 'loaded' | 'error'} Status
 */

class ViewModel {
  /**
   * @type {Observable<Status>}
   */
  status = ko.observable("idle");
  /**
   * @type {Observable<Repository[]>}
   */
  repos = ko.observableArray([]);

  /**
   * @type {Observable<boolean>}
   */
  isLoading = ko.computed(() => this.status() === "loading");

  /**
   * @type {Observable<boolean>}
   */
  isError = ko.computed(() => this.status() === "error");

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
