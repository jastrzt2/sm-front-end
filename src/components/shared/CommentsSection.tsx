import { useUserContext } from '@/context/AuthContext';
import { useAddComment, useGetComments, useGetPostById } from '@/lib/react-query/queriesAndMutations';
import { IComment } from '@/types';
import Comment from './Comment';
import React, { useEffect, useState } from 'react';

interface CommentsSectionProps {
  postId: string;
  initialComments: IComment[];
}

const CommentsSection = ({ postId, initialComments }: CommentsSectionProps) => {
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
    const newComment: IComment = {
      id: Date.now().toString(),
      userId: user.id,
      postId: postId,
      createdAt: new Date().toISOString(),
      text: newCommentText,
    };
    setComments(prev => [...prev, newComment]);
    setNewCommentText('');
    addComment(newComment);
  };

  if (isLoading) return <div>Ładowanie komentarzy...</div>;
  if (isError) return <div>Błąd podczas ładowania komentarzy.</div>;

  console.log("Comments:", fetchedComments);
  return (
    <div className="space-y-4">
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
          Dodaj komentarz
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;
