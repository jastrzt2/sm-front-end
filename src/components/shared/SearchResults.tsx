import { IPost } from '@/types';
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: IPost[];
}

const SearchResults = ( { isSearchFetching, searchedPosts} : SearchResultsProps) => {
  if(isSearchFetching) return <Loader />
  
  
 if( searchedPosts && searchedPosts.length > 0) return (
  <GridPostList posts={searchedPosts} />
  )
  if( searchedPosts) 

  return (
    <p className='text-light-4 mt-10 text-center w-full'>No results</p>
  )
}

export default SearchResults