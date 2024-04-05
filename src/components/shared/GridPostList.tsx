import { useUserContext } from '@/context/AuthContext';
import { IPost } from '@/types';
import React from 'react'
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type GridPostListProps = {
    posts: IPost[];
    showUser?: boolean;
    showStats?: boolean;
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
    const { user } = useUserContext();
    console.log("Posty:", posts);

    return (
        <ul className="grid-container">
            {posts.map((post) => (
                <li key={post.id} className="relative min-w-80 h-80">
                    <Link to={`/posts/${post.id}`} className="grid-post_link">
                        {post.imageUrl ? (
                            <img src={post.imageUrl} alt="post" className='h-full w-full object-cover' />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-dark-2">
                                <p>{post.caption}</p> 
                            </div>
                        )}
                    </Link>
                    <div className='grid-post_user'>
                        {showUser && (
                            <Link to={`/profile/${post.userId}`}>
                                <div className="flex items-center justify-start gap-2 flex-1">
                                    <img
                                        src={
                                            post.creatorImageUrl ||
                                            "/assets/icons/profile-placeholder.svg"
                                        }
                                        alt="creator"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <p className="line-clamp-1">{post.creatorName}</p>
                                </div>
                            </Link>
                        )}
                        {showStats && <PostStats post={post} userId={user.id} />}
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default GridPostList