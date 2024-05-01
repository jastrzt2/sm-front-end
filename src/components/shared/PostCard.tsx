import { useUserContext } from "@/context/AuthContext";
import { timeAgo } from "@/lib/utils"
import { IPost } from "@/types"
import { Link } from "react-router-dom"
import PostStats from "./PostStats";

const PostCard = ({ post }: { post: IPost }) => {
  const { user } = useUserContext();


  if (!post.userId) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}>
            <img src={post?.creatorImageUrl || '/assets/icons/profile-placeholder.svg'}
              alt="user"
              className="w-12 lg:h-12 rounded-full" />
          </Link>

          <div className="flex flex-col">
            <p>
              {post.creatorName}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {timeAgo(post.createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location ? post.location : ''}
              </p>
            </div>
          </div>
        </div>
        <Link to={`/update-post/${post.id}`}
          className={user.id !== post.userId ? "hidden" : ""}>
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
        </div>
        {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="post"
              className="post-card_img"
            />
          )}
      </Link>
                        
      <PostStats post={post} userId={user.id}/>
    </div>
  )
}

export default PostCard