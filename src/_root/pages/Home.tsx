import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useGetPosts } from '@/lib/react-query/queriesAndMutations';
import { IPost } from '@/types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const Home = () => {
  const { ref, inView } = useInView();
  const {
    data: posts,
    isLoading: isPostLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetPosts(); // Zakładam, że ten hook jest już skonfigurowany do paginacji

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className='h3-bold md:h2-bold text-left w-full'>
            Home Feed
          </h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages.map((page, index) => page.map((post: IPost) => (
                <li key={`post-${index}-${post.id}`} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              )))}
            </ul>
          )}
          {hasNextPage && (
            <div ref={ref} className="mt-10">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home;
