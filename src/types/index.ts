export type IContextType ={
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    file: File[];
    location?: string;
    tags?: string;
    imageUrl: string;
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    city: string;
    bio: string;
    saved_posts: string[];
    liked_posts: string[];
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export type IUpdatedUser = {
    id: string;
    name: string;
    bio?: string;
    city?: string;
    file?: File[];
  };

  export type IPost = {
    id: string;
    caption: string;
    imageId: string;
    imageUrl: string;
    [key: string]: any;
  };

  export type IComment = {
    id?: string;
    text: string;
    userId: string;
    postId: string;
    createdAt: string;
    updatedAt?: string;
    likes: string[];
  };

  export type NewComment = {
    text: string;
    userId: string;
    postId: string;
  };

  export type EditCommentParams = {
    commentId: string;
    commentData: NewComment;
  };

