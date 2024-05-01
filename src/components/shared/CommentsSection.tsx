import { useUserContext } from '@/context/AuthContext';
import { useAddComment, useGetComments } from '@/lib/react-query/queriesAndMutations';
import { IComment, NewComment } from '@/types';
import Comment from './Comment';
import { useEffect, useState } from 'react';
import Loader from './Loader';

interface CommentsSectionProps {
  postId: string;
  initialComments: IComment[];
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const { data: fetchedComments, isLoading, isError } = useGetComments(postId);
  const [comments, setComments] = useState<IComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const { user } = useUserContext();
  const { mutate: addComment } = useAddComment();

  useEffect(() => {
    if (fetchedComments) {
      setComments(fetchedComments);
    }
  }, [fetchedComments]);

  const handleAddComment = () => {
    
    if (!newCommentText) return;
    const newComment: NewComment = {
      userId: user.id,
      postId: postId,
      text: newCommentText,
    };
    const newCommentLocal: IComment = {
      id: Date.now().toString(),
      userId: user.id,
      postId: postId,
      createdAt: new Date().toISOString(),
      text: newCommentText,
      likes: []
    };
    setComments(prev => [...prev, newCommentLocal]);
    setNewCommentText('');
    addComment(newComment);
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error while loading comments...</div>;

  console.log("Comments:", fetchedComments);
  return (
    <div className="space-y-4 p-3" >
      <h1 className='text-xl'>Comments:</h1>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}



      <div className="pt-2">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md bg-dark-4"
          placeholder="Add a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          onClick={handleAddComment}
        >
          Add a comment
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;
