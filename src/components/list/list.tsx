import { useQuery } from '@apollo/client'
import { Button, Input, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { GET_REPOS } from '../../utils/graphQL'
import './list.scss'

const columnsData = [
  {
    title: 'Name',
    dataIndex: 'node',
    render: ({ name, url }: { name: string; url: string }) => (
      <a href={url}>{name}</a>
    ),
  },
  {
    title: '🌟Stars',
    dataIndex: 'node',
    render: ({ stargazerCount }: { stargazerCount: string }) => stargazerCount,
  },
  {
    title: '🍴Forks',
    dataIndex: 'node',
    render: ({ forkCount }: { forkCount: string }) => forkCount,
  },
]

const List: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('javascript')
  const [searchTerm, setSearchTerm] = useState<string>('javascript')

  const { loading, error, data } = useQuery(GET_REPOS, {
    variables: { searchQuery, first: 100, after: null },
  })

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchTerm)
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div>
      <h1>GitHub Repository Search</h1>
      <Input
        placeholder="Enter repository name..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <Button onClick={() => setSearchTerm('')}>Clear</Button>
      <hr />

      {loading && <p data-testid="loading-message" >Loading...</p>}
      {error && <p ata-testid="error-message">Error: {error.message}</p>}

      {data?.search.edges.length > 0 && (
          <Table
            dataSource={data.search.edges}
            rowKey={(record) => record.node.id}
            columns={columnsData}
          />
      )}
    </div>
  )
}

export default List
