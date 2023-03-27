document.addEventListener('alpine:init', () => {
  /**
   * @typedef {'idle' | 'loaded' | 'loading' | ' error'} Status
   */

  Alpine.store('status', 'idle');

  /**
   * @param status {Status}
   */
  const setStatus = (status) => {
    Alpine.store('status', status);
  };

  /**
   * User type definition
   * @typedef {Object} Repo
   * @property {string} name
   * @property {string} topics
   * @property {string} homepageUrl
   * @property {string} description
   * @property {string} url
   */

  const repos = {
    /**
     * @type {Repo[]}
     */
    items: [],
    async init() {
      setStatus('loading');
      this.items = [];
      try {
        const response = await fetch('/.netlify/functions/fetch-projects');
        if (!response.ok) {
          throw response;
        }
        this.items = response.json();
        setStatus('loaded');
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    },
  };

  Alpine.store('repos', repos);
});
