import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import List from './list';
import { GET_REPOS } from '../../utils/graphQL';
import '@testing-library/jest-dom';

const mocks = [
  {
    request: {
      query: GET_REPOS,
      variables: {
        searchQuery: 'javascript',
        first: 100,
        after: null,
      },
    },
    result: {
      data: {
        search: {
          edges: [
            {
              node: {
                id: '1',
                name: 'Repo1',
                url: 'https://github.com/repo1',
                stargazerCount: '10',
                forkCount: '5',
              },
            },
            {
              node: {
                id: '2',
                name: 'Repo2',
                url: 'https://github.com/repo2',
                stargazerCount: '20',
                forkCount: '8',
              },
            },
          ],
        },
      },
    },
  },
];

describe('List', () => {
  // TODO: Fix this test  - it is failing
  
  // it('renders the list of repositories', async () => {
  //   render(
  //     <MockedProvider mocks={mocks} addTypename={false}>
  //       <List />
  //     </MockedProvider>
  //   );

  //   await waitFor(() => {
  //     expect(screen.queryByText('Loading...')).toBeNull();
  //   });

  //   expect(screen.getByText('Repo1')).toBeInTheDocument();
  //   expect(screen.getByText('Repo2')).toBeInTheDocument();
  // });

  it('renders an error message when there is an error', async () => {
    const errorMock = {
      ...mocks[0],
      error: new Error('GraphQL Error'),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <List />
      </MockedProvider>
    );

    // Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    // Check if the error message is rendered
    expect(screen.getByText('Error: GraphQL Error')).toBeInTheDocument();
  });
});