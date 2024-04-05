import { EditCommentParams, INewPost, INewUser, IUpdatePost, NewComment } from "@/types";
import { Query } from "@tanstack/react-query";

export async function getUserById(userId: String) {
  console.log()
  if (userId === '' || userId === null)
    throw new Error('No user ID provided')
  const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`);
  if (!response.ok) {
    throw new Error('An Error while fetching user');
  }
  const user = response.json();
  console.log('User from id '+ userId + 'user' + user)
  return user;
};

export async function createUserAccount(user: INewUser) {
  try {
    console.log("tam" + JSON.stringify(user));
    const response = await fetch('http://localhost:8080/api/v1/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    console.log("tutaj" + response);
    const data = await response.json();

    return { success: response.ok, data };
  } catch (error) {
    console.error('An error occurred while creating the user', error);
    return { success: false, data: { string: "CreatingUserFailed" } };
  }
}

export async function signInAccount(user: { email: string; password: string; }) {
  try {
    const response = await fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('Failed to sign in');
    }

    const { token } = await response.json();
    localStorage.setItem('cookieFallback', token);

    return token;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("cookieFallback") || '';
    console.log("Token" + token)
    const response = await fetch('http://localhost:8080/api/v1/users/details', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error fetching current user: ${errorData}`);
    }

    const user = await response.json();
    console.log('Current user:', user);
    return user;
  }
  catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}

export async function signOutAccount() {
  try {
    localStorage.removeItem('cookieFallback');
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
  }
}


export async function createPost(post: INewPost) {
  try {
    const formData = new FormData();

    formData.append('userId', post.userId);
    formData.append('caption', post.caption);

    formData.append('location', post.location || '');
    formData.append('tags', post.tags || '');

    if (post.file && post.file.length > 0) {
      formData.append('file', post.file[0]);
    }

    const response = await fetch('http://localhost:8080/api/v1/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`
      },
      body: formData,
    });


    console.log(response)

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Network response was not ok: ' + errorData.message);
    }

    const data = await response.json();
    console.log('Post created:', data);
    return data;

  } catch (error) {
    console.error('Error while creating post:', error);
  }
}

export async function getRecentPosts() {
  try {
    const response = await fetch("http://localhost:8080/api/v1/posts/getPosts");
    console.log("response", response)
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const posts = await response.json();

    console.log(posts)
    return posts;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw error;
  }
}

export async function getPostById(postId?: string) {
  try {
    if (!postId) {
      throw new Error('No post ID provided');
    }
    const response = await fetch(`http://localhost:8080/api/v1/posts/get/${postId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const post = await response.json();
    if (!post) {
      throw new Error('Post not found');
    }
    console.log(post);

    return post;
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
}

export async function getSavedPosts() {
  try {
    const response = await fetch("http://localhost:8080/api/v1/users/getSavedPosts", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    throw error;
  }
}

export async function getPostList({ queryKey }) {
  const [, postIds] = queryKey;
  const queryString = postIds.map(id => `ids=${encodeURIComponent(id)}`).join('&');
  const url = `http://localhost:8080/api/v1/posts/getPostsList?${queryString}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts list:', error);
    throw error;
  }
}


export async function likePost(postId: string, userId: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`,
      },
      body: JSON.stringify({
        userId: userId
      })
    });

    if (response.ok) {
      const updatedPost = await response.json();
      return updatedPost;
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/users/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`,
      },
      body: JSON.stringify({
        postId: postId
      })
    });

    if (response.ok) {
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function editPost(post: IUpdatePost) {
  try {
    const formData = new FormData();

    formData.append('caption', post.caption);
    formData.append('postId', post.postId);

    formData.append('location', post.location || '');
    formData.append('tags', post.tags || '');

    if (post.file && post.file.length > 0) {
      formData.append('file', post.file[0]);
    }

    const response = await fetch('http://localhost:8080/api/v1/posts/edit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`
      },
      body: formData,
    });


    console.log(response)

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Network response was not ok: ' + errorData.message);
    }

    const data = await response.json();
    console.log('Post updated:', data);
    return data;

  } catch (error) {
    console.error('Error while creating post:', error);
  }
}

export async function deletePost(postId: string) {
  try {

    const formData = new FormData();

    formData.append('postId', postId);
    const response = await fetch('http://localhost:8080/api/v1/posts/delete', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`
      },
      body: formData,
    });

    console.log(response)

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Network response was not ok: ' + errorData.message);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error while creating post:', error);
  }
}

export async function addComment(comment: { postId: string; text: string; userId: string; }) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/comments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`,
      },
      body: JSON.stringify(comment)
    });

    if (response.ok) {
      const updatedPost = await response.json();
      return updatedPost;
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getComments(postId: string) {
  try {
    if (!postId) {
      throw new Error('No post ID provided');
    }
    const response = await fetch(`http://localhost:8080/api/v1/posts/getComments/${postId}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const comments = await response.json();
    if (!comments) {
      throw new Error('No comments fetched');
    }
    console.log(comments);

    return comments;
  } catch (error) {
    console.error(`Error fetching comments of post with ID ${postId}:`, error);
    throw error;
  }
}

export async function deleteComment(commentId: string) {
  try {
    if (!commentId) {
      throw new Error('No comment ID provided');
    }
    console.log("tutaj")
    const response = await fetch(`http://localhost:8080/api/v1/comments/delete/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    console.log('Comment deleted successfully');
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export async function editComment(updatedComment: EditCommentParams) {
  try {
    if (!updatedComment.commentId) {
      throw new Error('No comment ID provided');
    }
    const response = await fetch(`http://localhost:8080/api/v1/comments/edit/${updatedComment.commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`,
      },
      body: JSON.stringify(updatedComment.commentData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error('Error editing comment:', error);
    throw error;
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam?: string }) {
  try {
    console.log("pageParam (cursor)", pageParam);
    const url = new URL('http://localhost:8080/api/v1/posts/get');
    if (pageParam) {
      url.searchParams.append('cursor', pageParam);
    }
    console.log("url", url);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const posts = await response.json(); 
    console.log(posts); 
    return posts; 
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; 
  }
}


export async function searchPosts(searchTerm: string) {
  try {
    const response = await fetch('http://localhost:8080/api/v1/posts/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`, // Upewnij się, że token jest odpowiednio zarządzany
      },
      body: JSON.stringify({ searchTerm }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const posts = await response.json();
    return posts; 
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}
