import { gql } from 'graphql-tag'

export const GET_REPOS = gql`
  query GetRepos($searchQuery: String!, $first: Int, $after: String) {
    search(
      query: $searchQuery
      type: REPOSITORY
      first: $first
      after: $after
    ) {
      edges {
        node {
          ... on Repository {
            id
            name
            stargazerCount
            forkCount
            url
          }
        }
      }
    }
  }
`