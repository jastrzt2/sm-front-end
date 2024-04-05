import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/context/AuthContext'
import { useGetSavedPosts } from '@/lib/react-query/queriesAndMutations';
import { User } from 'lucide-react'
import React from 'react'

const Saved = () => {
  const { data: posts, isLoading, error } = useGetSavedPosts();
  if (isLoading) return <Loader />;
  if (error) return <div>Something went wrong</div>;

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Saved Posts</h2>
        
        <GridPostList posts={posts} />
      </div>
    </div>
  );
};

export default Saved