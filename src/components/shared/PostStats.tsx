import { useUserContext } from '@/context/AuthContext';
import { useLikePost } from '@/lib/react-query/queriesAndMutations';
import { checkIsLiked } from '@/lib/utils';
import { IPost } from '@/types';
import { useState, useEffect } from 'react';

type PostStatsProps = {
    post: IPost;
    userId: string;
}

const PostStats = ({ post, userId}: PostStatsProps) => {
  const likesList = post.likes || [];
  //const likesList = post.likes ? post.likes.map((user: any) => user.userId) : [];
  const [likes, setLikes] = useState(likesList);
  //const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  //const { mutate: savePost } = useSavePost();
  //const { mutate: deleteSavedPost } = useDeleteSavedPost();

  const { user } = useUserContext();

  useEffect(() => {
    setLikes(post.likes || []);
  }, [post.likes]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
  
    // Optimistically updating the UI
    setLikes((currentLikes: string[]) => {
      if (currentLikes.includes(user.id)) {
        return currentLikes.filter((id) => id !== user.id);
      } else {
        return [...currentLikes, user.id];
      }
    });
  
    likePost({ postId: post.id, userId: user.id});
  };

  //const handleSavePost = () => {};

  return (
    <div className="flex justify-between itmens-center z-20">
        <div className="flex gap-2 mr-5">
            <img 
            src={`${checkIsLiked(likes, userId) ? 
              "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"}
            `}
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            className='cursor-pointer'
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>

        <div className="flex gap-2">
            <img 
            src="/assets/icons/save.svg"
            alt="like"
            width={20}
            height={20}
            onClick={ () => {} }
            className='cursor-pointer'
            />
        </div>
    </div>
  )
}

export default PostStats