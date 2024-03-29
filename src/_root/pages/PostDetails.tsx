import PostStats from '@/components/shared/PostStats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useDeletePost, useGetPostById } from '@/lib/react-query/queriesAndMutations'
import { timeAgo } from '@/lib/utils';
import { Loader } from 'lucide-react';
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id || '');
  const { user } = useUserContext();
  const { mutate: deletePost } = useDeletePost();


  const handleDeletePost = () => {
    deletePost( id || '');
    navigate(-1);
  };


  return (
    <div className="post_details-container">
      {isLoading ? <Loader /> : (
        <div className="post_details-card">
          <img
            src={post.imageUrl}
            alt="post"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post.userId}`} className="flex items-center gap-3">
                <img src={post.creatorImageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="user"
                  className="w-8 h-8 lg:h-12 lg:w-12 rounded-full" />

                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post.creatorName}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {timeAgo(post.createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link to={`/update-post/${post.id}`} className={`${user.id !== post?.userId && 'hidden'}`}>
                  <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${user.id !== post?.userId && 'hidden'}`}>
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />

            <div className="small-medium lg:base-medium py-5">
              <p>{post.caption}</p>
              <ul className="flex gap-1 mt-2">
                {/* {post.tags.map((tag: string) => (
                            <li key={tag} className="text-light-3">
                                #{tag}
                            </li>
                        ))} */}
                {post.tags}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>

          </div>
        </div>
      )
      }
    </div>
  )
}

export default PostDetails