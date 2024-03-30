import { EditCommentParams, INewPost, INewUser, IUpdatePost, NewComment } from '@/types'
import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { addComment, createPost, createUserAccount, deleteComment, deletePost, editComment, editPost, getComments, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserById, likePost, savePost, searchPosts, signInAccount, signOutAccount } from '../api/api'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string;
        }) => signInAccount(user),
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useGetUserById = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId || ''),
        enabled: !!userId,
    });
};


//
//  
//

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    });
};

export const useGetRecentPosts = () => {

    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    });
}

export const useGetPostById = (postId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId,
    });
};

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage: any) => {
            if (lastPage && lastPage.length === 0) {
                return null;
            }
            console.log("Strong" + lastPage + "siema" + lastPage.length + "elo ")
            const lastId = lastPage[lastPage.length - 1].id;
            return lastId;
        },
        initialPageParam: 0,
    });
};





export const useSearchPosts = (searchQuery: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POSTS, searchQuery],
        queryFn: () => searchPosts(searchQuery),
        enabled: !!searchQuery,
    });
}

//actions

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }
        ) => likePost(postId, userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => savePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: IUpdatePost) => editPost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
            });
        },
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) => deletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comment: NewComment) => addComment(comment),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
            });
        },
    });
};

export const useGetComments = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS, postId],
        queryFn: () => getComments(postId),
        enabled: !!postId,
    });
};

export const useEditComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedCommentData: EditCommentParams) => editComment(updatedCommentData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
            });
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
            });
        },
    });
};