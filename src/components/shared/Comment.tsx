import { useUserContext } from "@/context/AuthContext";
import { deleteComment } from "@/lib/api/api";
import { useDeleteComment, useEditComment, useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { EditCommentParams, IComment, NewComment } from "@/types";
import { useState } from "react";
import ReactDOM from "react-dom";
import { set } from "react-hook-form";



interface CommentProps {
  comment: IComment;
}

const Comment = ({ comment }: CommentProps) => {
  const { data: user, isLoading, isError, error } = useGetUserById(comment.userId);
  const { user: currentUser } = useUserContext();
  const { mutateAsync: editComment, isPending: isSavingEditedComment } = useEditComment()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const toggleEdit = () => setIsEditing(!isEditing);


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user: {error.message}</div>;

  if (isLoading) return <div>Loading...</div>;

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
    <div className="flex items-start space-x-4 comment-container">
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



        <div onClick={openModal} className="menu-trigger">...</div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="flex flex-col">
            <button className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 ${currentUser.id !== comment.userId && 'hidden'}`}
             onClick={() => { handleEdit(); closeModal(); }}>Edit </button>
            <button className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 ${currentUser.id !== comment.userId && 'hidden'}`}
             onClick={() => { handleDelete(); closeModal(); }}>Delete</button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4" onClick={() => { }}>Report</button> 
          </div>
        </Modal>
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bg-d p-2" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Comment;