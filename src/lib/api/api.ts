import { INewPost, INewUser } from "@/types";

export async function createUserAccount(user: INewUser) {
  try {

    const response = await fetch('http://localhost:8080/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

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

    const data = await response.json();
    console.log('Current user:', data);
    return data;
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
      // 'Content-Type': 'application/json', // chyba nie potrzebne ale trzeba sprawdzic
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
    throw error; // Rethrow to handle it in the calling context
  }
}

export async function getPostById(postId: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/posts/${postId}`);
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

export async function likePost(postId: string, userId: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`, // Uncomment if using token-based auth
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
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`, // Uncomment if using token-based auth
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
