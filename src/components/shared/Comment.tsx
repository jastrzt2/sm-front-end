import { useUserContext } from "@/context/AuthContext";
import { deleteComment } from "@/lib/api/api";
import { useDeleteComment, useEditComment, useGetUserById, useLikeComment } from "@/lib/react-query/queriesAndMutations";
import { EditCommentParams, IComment, NewComment } from "@/types";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { set } from "react-hook-form";
import Loader from "./Loader";
import { checkIsLiked, timeAgo } from "@/lib/utils";



interface CommentProps {
  comment: IComment;
}

const Comment = ({ comment }: CommentProps) => {
  const { data: user, isLoading, isError, error } = useGetUserById(comment.userId);
  const { user: currentUser } = useUserContext();
  const { mutate: likeComment } = useLikeComment();
  const { mutateAsync: deleteComment } = useDeleteComment(comment.postId || "");
  const { mutateAsync: editComment, isPending: isSavingEditedComment } = useEditComment()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const toggleEdit = () => setIsEditing(!isEditing);
  const modalRef = useRef(null);

  const likesList = comment.likes || [];
  const [likes, setLikes] = useState(likesList);
  useEffect(() => {
    setLikes(comment.likes || []);
  }, [comment.likes]);

  const handleLikeComment = (e: React.MouseEvent) => {
    e.stopPropagation();
  
    setLikes((currentLikes: string[]) => {
      if (currentLikes.includes(currentUser.id)) {
        return currentLikes.filter((id) => id !== currentUser.id);
      } else {
        return [...currentLikes, currentUser.id];
      }
    });
  
    likeComment(comment.id || "");
  };



  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false); 
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 


  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading user: {error.message}</div>;

  if (isLoading) return <Loader />;

  console.log("User:", user);

  const handleDelete = () => {
    deleteComment(comment.id || "");
  };

  const handleEdit = () => {
    setEditedText(comment.text);
    setIsEditing(true);
    toggleEdit();
  };

  const saveChanges = () => {
    setIsEditing(false);
    comment.text = editedText;
    const updatedCommentData: NewComment = {
      text: editedText,
      userId: comment.userId,
      postId: comment.postId,
    };

    const params: EditCommentParams = {
      commentId: comment.id || '',
      commentData: updatedCommentData,
    };

    editComment(params).then(() => {
      setIsEditing(false);
    }).catch(error => {
      console.error("Error during saving comment:", error);
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const cancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex items-start space-x-4 comment-container" style={{ position: 'relative' }}>
      <img src={user.imageUrl || "assets/icons/profile-placeholder.svg"} alt="Avatar" className="comment-avatar rounded-full"
      />
      <div className="comment-content">
        <div className="font-bold flex flex-row items-center">
          {user?.name}&nbsp;&nbsp;
          <p className="text-light-3 small-regular"> • {timeAgo(comment.createdAt)}</p>
        <div onClick={openModal} className="inline-block " style={{ cursor: 'pointer', marginLeft: 'auto' }}>...</div>
        </div>
        
        {isEditing ? (
          <textarea
            className="comment-textarea bg-dark-3 rounded p-2 w-full"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <p className="comment-text" onDoubleClick={toggleEdit}>{comment.text}</p>
        )}
        <div className="flex gap-2 mr-5">
            <img 
            src={`${checkIsLiked(likes, currentUser.id) ? 
              "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"}
            `}
            alt="like"
            width={20}
            height={20}
            onClick={handleLikeComment}
            className='cursor-pointer'
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>
        {isEditing && (
          <div className="flex flex-row gap-2">
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded" onClick={saveChanges}>
              Save
            </button>
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded" onClick={cancelEditing}>
              Cancel
            </button>
          </div>
        )}

        {isModalOpen && (
          <div ref={modalRef} className="" style={{ position: 'absolute', zIndex: 1000 } }>
            <div className="flex flex-col bg-white rounded-md shadow-lg">
              <button className={`bg-dark-3 hover:bg-dark-4 text-white font-bold py-2 px-4 rounded-t-md ${currentUser.id !== comment.userId && 'hidden'}`}
                onClick={() => { handleEdit(); closeModal(); }}>Edit </button>
              <button className={`bg-dark-3 hover:bg-dark-4 text-white font-bold py-2 px-4 ${currentUser.id !== comment.userId && 'hidden'}`}
                onClick={() => { handleDelete(); closeModal(); }}>Delete</button>
              <button className={`bg-dark-3 hover:bg-dark-4 text-white font-bold py-2 px-4 rounded-b-md ${currentUser.id !== comment.userId && 'rounded-t-md'}`} onClick={() => { }}>Report</button>
            </div>
          </div>
        )}

      </div>
    </div>

  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div onClick={onClose}style={{ zIndex: 999 }} >
      <div className="bg-d p-2" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Comment;