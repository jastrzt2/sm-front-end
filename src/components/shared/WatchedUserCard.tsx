import { useGetUserById } from '@/lib/react-query/queriesAndMutations';
import Loader from './Loader';
import { Link } from 'react-router-dom';
interface WatchedUserCardProps {
  userId: string;
}

const WatchedUserCard: React.FC<WatchedUserCardProps> = ({ userId }) => {
  const { data: user, isLoading: isLoadingUser } = useGetUserById(userId);

  if (isLoadingUser) {
    return <Loader />;
  }

  console.log(user)

  return (
    <Link to={`/profile/${userId}`}>
    <div className="user-card">
      <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="Profile Picture" className="rounded-full w-48 h-48 mx-auto" />
      <div className="text-primary-500">{user.name}</div>
    </div>
    </Link>
  );
};

export default WatchedUserCard;
