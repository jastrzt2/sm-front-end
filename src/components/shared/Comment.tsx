import { useUserContext } from "@/context/AuthContext";
import { deleteComment } from "@/lib/api/api";
import { useDeleteComment, useEditComment, useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { EditCommentParams, IComment, NewComment } from "@/types";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { set } from "react-hook-form";
import Loader from "./Loader";



interface CommentProps {
  comment: IComment;
}

const Comment = ({ comment }: CommentProps) => {
  const { data: user, isLoading, isError, error } = useGetUserById(comment.userId);
  const { user: currentUser } = useUserContext();
  const { mutateAsync: deleteComment } = useDeleteComment(comment.postId || "");
  const { mutateAsync: editComment, isPending: isSavingEditedComment } = useEditComment()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const toggleEdit = () => setIsEditing(!isEditing);
  const modalRef = useRef(null);


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
        <h5 className="font-bold">{user?.name}</h5>
        {isEditing ? (
          <textarea
            className="comment-textarea bg-dark-3 rounded p-2 w-full"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <p className="comment-text" onDoubleClick={toggleEdit}>{comment.text}</p>
        )}
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

        <div onClick={openModal} className="inline-block" style={{ cursor: 'pointer' }}>...</div>

        {isModalOpen && (
          <div ref={modalRef} className="" style={{ position: 'absolute', zIndex: 1000 } }>
            <div className="flex flex-col bg-white rounded-md shadow-lg">
              <button className={`bg-dark-3 hover:bg-dark-4 text-white font-bold py-2 px-4 rounded-t-md ${currentUser.id !== comment.userId && 'hidden'}`}
                onClick={() => { handleEdit(); closeModal(); }}>Edit </button>
              <button className={`bg-dark-3 hover:bg-dark-4 text-white font-bold py-2 px-4 ${currentUser.id !== comment.userId && 'hidden'}`}
                onClick={() => { handleDelete(); closeModal(); }}>Delete</button>
              <button className="bg-dark-3 hover:bg-dark-4 text-white font-bold py-2 px-4 rounded-b-md" onClick={() => { }}>Report</button>
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