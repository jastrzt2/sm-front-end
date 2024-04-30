import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useGetPostsList, useGetUserById, useWatchUser } from '@/lib/react-query/queriesAndMutations';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const { data: user, isLoading: isLoadingUser, isError: isUserError } = useGetUserById(id);
  const { user: currentUser } = useUserContext();
  const { data: userPosts, isLoading: isLoadingPosts, isError: isPostsError } = useGetPostsList(user?.posts || []);
  const { mutate: watchUser } = useWatchUser(id || "");
  const [isWatching, setIsWatching] = useState(currentUser?.watched?.includes(id || ""));


  if (isLoadingUser || isLoadingPosts) {
    return <Loader />;
  }

  if (isUserError || isPostsError) {
    return <div>Error while fetching data.</div>;
  }

  if (!user || !userPosts) {
    return <div>No data available</div>;
  }
  console.log("User:", user);

  const handleWatch = () => {
    watchUser(id || "");
    if (isWatching) {
        setIsWatching(false);
    } else {
        setIsWatching(true);
    }
};

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="Profile" className="rounded-full w-48 h-48 mx-auto" />
        </div>
        <div className="w-full md:w-2/3 flex flex-col justify-center">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="small-regular text-light-3">
            @{user.username}
          </p>
          <p className="text-gray-600">{user.city}</p>
          <p className="text-white">{user.bio}</p>
          <div className={`${id !== currentUser.id && 'hidden'}`}>
            <Link to={`/profile/${user.id}/edit`} className="text-primary-500">Edit Profile</Link>
          </div>
          <div className={`${id === currentUser.id && 'hidden'}`}>
            <Button className='bg-primary-600 mt-5' onClick={handleWatch}>
              {isWatching ? 'Unwatch' : 'Watch'}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <GridPostList posts={userPosts} showUser={false} showStats={true} />
      </div>
    </div>
  );
};

export default Profile