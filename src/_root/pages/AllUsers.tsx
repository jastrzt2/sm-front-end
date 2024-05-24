import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import WatchedUserCard from '@/components/shared/WatchedUserCard';
import { useUserContext } from '@/context/AuthContext';
import { useGetWatchedPosts } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer';

const AllUsers = () => {
  const { ref, inView } = useInView();
  const { user } = useUserContext();
  const {
    data: posts,
    isLoading: isPostLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetWatchedPosts();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (!user) {
    return <div className="flex-center w-full h-full"><Loader /></div>;
  }

  if (user.watched.length === 0) {
    return <div className="flex-center w-full h-full"><p className="h3-bold">You are not following anyone yet.</p></div>;
  }

  return (
    <div className="flex flex-1 justify-center">
      <div className="home-container">
        <h3 className="h3-bold md:h2-bold text-center w-full">Watched Users</h3>
        {user.watched.length > 0 && (
          <div className="watched-users-container">
            <div className="horizontal-scroll">
              {user.watched.map((userId: string) => (
                <WatchedUserCard key={userId} userId={userId} />
              ))}
            </div>
          </div>
        )}
        <div className="home-posts">
          {isPostLoading && !posts ? <Loader /> : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages.map((page: any[], index: number) => page.map((post: any) => (
                <li key={`post-${index}-${post.id}`} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              )))}
            </ul>
          )}
          {hasNextPage && <div ref={ref} className="mt-10"><Loader /></div>}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
