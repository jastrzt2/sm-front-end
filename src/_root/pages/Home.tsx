import PostForm from '@/components/forms/PostForm';
import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';

export const Home = () => {
  const { data: posts, isLoading: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();
  console.log(posts);
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
              
            <div>fd</div>
              {posts?.map((post: {
                [key: string]: any;
                $id: string;
                $collectionId: string;
                $databaseId: string;
                $createdAt: string;
                $updatedAt: string;
                $permissions: string[];
              }) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>

          )
          }
        </div>
      </div>
    </div>
  )
}


export default Home