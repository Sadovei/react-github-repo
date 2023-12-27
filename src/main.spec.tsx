import { render } from '@testing-library/react';
import App from './App.tsx';
import { MockedProvider } from '@apollo/client/testing';
import { GET_REPOS } from './utils/graphQL.ts';

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
        // Your mocked data here
      },
    },
  },
];

describe('App', () => {
  it('renders without crashing', () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );
});
});