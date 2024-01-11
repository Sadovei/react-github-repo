import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import List from './list';
import { GET_REPOS } from '../../graphql/repositories.query';
import '@testing-library/jest-dom';

const mocks = [
  {
    request: {
      query: GET_REPOS,
      variables: { searchQuery: 'javascript-book', first: 10, after: null },
    },
    result: {
      data: {
        "search": {
          "__typename": "SearchResultItemConnection",
          "edges": [
            {
              "__typename": "SearchResultItemEdge",
              "node": {
                "__typename": "Repository",
                "id": "MDEwOlJlcG9zaXRvcnkxNDQ0MDI3MA==",
                "name": "You-Dont-Know-JS",
                "stargazerCount": 174129,
                "forkCount": 33416,
                "url": "https://github.com/getify/You-Dont-Know-JS"
              }
            },
            {
              "__typename": "SearchResultItemEdge",
              "node": {
                "__typename": "Repository",
                "id": "MDEwOlJlcG9zaXRvcnk2ODAwMjE3",
                "name": "jstutorial",
                "stargazerCount": 5419,
                "forkCount": 1358,
                "url": "https://github.com/ruanyf/jstutorial"
              }
            },
            {
              "__typename": "SearchResultItemEdge",
              "node": {
                "__typename": "Repository",
                "id": "MDEwOlJlcG9zaXRvcnk3NjI5MDA5MQ==",
                "name": "thejsway",
                "stargazerCount": 7839,
                "forkCount": 843,
                "url": "https://github.com/thejsway/thejsway"
              }
            },
            {
              "__typename": "SearchResultItemEdge",
              "node": {
                "__typename": "Repository",
                "id": "MDEwOlJlcG9zaXRvcnkzMTkzNjYwMA==",
                "name": "documentation",
                "stargazerCount": 5751,
                "forkCount": 557,
                "url": "https://github.com/documentationjs/documentation"
              }
            },
            {
              "__typename": "SearchResultItemEdge",
              "node": {
                "__typename": "Repository",
                "id": "MDEwOlJlcG9zaXRvcnkxMzIxNjM3MQ==",
                "name": "Eloquent-JavaScript",
                "stargazerCount": 2866,
                "forkCount": 809,
                "url": "https://github.com/marijnh/Eloquent-JavaScript"
              }
            },
          ],
          "pageInfo": {
            "__typename": "PageInfo",
            "endCursor": "Y3Vyc29yOjEw",
            "startCursor": "Y3Vyc29yOjE=",
            "hasNextPage": true,
            "hasPreviousPage": false
          },
          "repositoryCount": 7371
        }
      }
    },
  },
];
describe('List component', () => {
  it('renders the input and button', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <List />
      </MockedProvider>
    );

    expect(screen.getByPlaceholderText('Enter repository name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('updates the search term when input value changes', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <List />
      </MockedProvider>
    );

    const input = screen.getByPlaceholderText('Enter repository name...') as HTMLInputElement;
    const clearButton = screen.getByRole('button', { name: 'Clear' });

    expect(input).toHaveValue('javascript-book');

    // Change input value
    input.value = 'react';
    fireEvent.change(input);

    expect(input).toHaveValue('react');

    // Clear input value
    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
  });

  it('fetches and renders the repository list', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <List />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    expect(screen.getByText('documentation')).toBeInTheDocument();
    expect(screen.getByText('Eloquent-JavaScript')).toBeInTheDocument();
  });

  it('fetches more data when pagination changes', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <List />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    const parentElement = screen.getByTitle('Next Page');
    const nextPageButton = parentElement.querySelector('.ant-pagination-item-link') as HTMLButtonElement;

    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    expect(screen.getByText('You-Dont-Know-JS')).toBeInTheDocument();
    expect(screen.getByText('jstutorial')).toBeInTheDocument();
  });

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

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    expect(screen.getByText('Error: GraphQL Error')).toBeInTheDocument();
  });
});