import { useQuery } from '@apollo/client'
import { Button, Input, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import './list.scss'
import merge from 'lodash/merge';
import { GET_REPOS } from '../../graphql/repositories.query';

interface IPageInfo {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const columnsData = [
  {
    title: 'Name',
    dataIndex: 'node',
    render: ({ name, url }: { name: string; url: string }) => (
      <a href={url} target='_blank' rel="noopener noreferrer">{name}</a>
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

const ITEMS_PER_PAGE = 10;

const List: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('javascript-book');
  const [searchTerm, setSearchTerm] = useState<string>('javascript-book');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fetchedPages, setFetchedPages] = useState<number[]>([1]);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<IPageInfo>({
    endCursor: '',
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const { loading, error, data, fetchMore } = useQuery(GET_REPOS, {
    variables: { searchQuery, first: 10, after: null },
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchTerm);
      setCurrentPage(1)
      setFetchedPages([1])
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    if (data && data.search) {
      setPageInfo({
        endCursor: data.search.pageInfo.endCursor,
        hasNextPage: data.search.pageInfo.hasNextPage,
        hasPreviousPage: data.search.pageInfo.hasPreviousPage,
      });
    }
  }, [data]);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);

    if (pageInfo.endCursor && !fetchedPages.includes(page)) {
      setIsFetchingMore(true)

      try {
        const { data: fetchMoreData } = await fetchMore({
          variables: {
            searchQuery,
            first: ITEMS_PER_PAGE,
            after: pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return merge({}, prev, {
              search: {
                edges: [...prev.search.edges, ...fetchMoreResult.search.edges],
                pageInfo: fetchMoreResult.search.pageInfo,
              },
            });
          },
        });

        // Update pageInfo in the state
        setPageInfo({
          endCursor: fetchMoreData.search.pageInfo.endCursor,
          hasNextPage: fetchMoreData.search.pageInfo.hasNextPage,
          hasPreviousPage: fetchMoreData.search.pageInfo.hasPreviousPage,
        });

        setFetchedPages((prevPages) => [...prevPages, page]);
      } catch (error) {
        console.error('Error fetching more data:', error);
      } finally {
        setIsFetchingMore(false); // Set loading state back to false
      }

      setFetchedPages((prevPages) => [...prevPages, page])

    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
      {loading || isFetchingMore ? (
        <p data-testid="loading-message">Loading...</p>
      ) : error ? (
        <p ata-testid="error-message">Error: {error.message}</p>
      ) : data?.search?.edges ? (
        <Table
          dataSource={data.search.edges}
          rowKey={(record) => record.node.id}
          columns={columnsData}
          pagination={{
            current: currentPage,
            pageSize: ITEMS_PER_PAGE,
            total: data.search.repositoryCount || 0,
            onChange: handlePageChange,
            simple: true,
          }}
        />
      ) : null}
    </div>
  );
}

export default List
