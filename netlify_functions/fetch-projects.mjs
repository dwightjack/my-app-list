import ky from 'ky';

export async function handler() {
  try {
    const body = await ky
      .post('https://api.github.com/graphql', {
        headers: {
          authorization: `bearer ${process.env.GITHUB_API_TOKEN}`,
        },
        json: {
          query: `{
          search(type: REPOSITORY, query: "user:dwightjack topic:web-application", last: 100) {
            repos: edges {
              repo: node {
                ... on Repository {
                  url,
                  name,
                  description,
                  homepageUrl,
                  repositoryTopics(last: 10) {
                    nodes {
                      topic {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
        },
      })
      .json();

    const repos = body.data.search.repos.map(({ repo }) => {
      const { repositoryTopics, ...data } = repo;
      return {
        ...data,
        topics: repositoryTopics.nodes.map(({ topic }) => topic.name),
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(repos),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}
