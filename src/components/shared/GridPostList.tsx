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
                        <img src={post.imageUrl} alt="post" className='h-full w-full object-cover' />
                    </Link>

                    <div className='grid-post_user'>
                        {showUser && (
                            <div className='flex'>
                                <img src={post.creatorImageUrl ||
                                    '/assets/icons/profile-placeholder.svg'} alt="user"
                                    className="w-8 h-8 lg:h-12 lg:w-12 rounded-full" />

                            </div>
                        )}
                        {showUser && <PostStats post={post} userId={user.id} />}
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default GridPostList