import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'


const client = new ApolloClient({
  uri: 'https://api.github.com/graphql', // GitHub GraphQL API endpoint
  headers: {
    Authorization: `Bearer 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`, // Replace with your GitHub access token
  },
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
)
