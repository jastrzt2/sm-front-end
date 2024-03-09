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

export async function getCurrentUser(token: string) {
  try {
    
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
  let uploadedFileUrl = "";
  let publicId = "";
  try {
    if(post.file.length > 0){
      const uploadResponse = await uploadFile(post.file);
      uploadedFileUrl = uploadResponse; // Save the public_id from the response
    }

    const newPost = {
      userId: post.userId,
      caption: post.caption,
      location: post.location,
      tags: post.tags,
      imageUrl: uploadedFileUrl
    };


    const response = await fetch('http://localhost:8080/api/v1/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("cookieFallback")}`
      },
      body: JSON.stringify(newPost)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Post created:', data);
    return data;

  } catch (error) {
    console.error('Error signing out:', error);
    if (publicId) {
      await deleteImage(publicId); // Attempt to delete the uploaded image if post creation fails
    }
  }
}

export async function uploadFile(files: File[]) {
  const file = files[0];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ykxu8scn');
  try {
    // Replace `your_cloud_name` with your actual Cloudinary cloud name
    const cloudinaryURL = `https://api.cloudinary.com/v1_1/dyucisq5v/image/upload`;
    
    const response = await fetch(cloudinaryURL, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error('Cloudinary upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
}

async function deleteImage(publicId: string | Blob) {
  try {
    const cloudinaryURL = `https://api.cloudinary.com/v1_1/dyucisq5v/image/destroy`;
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', 'your_api_key');

    const response = await fetch(cloudinaryURL, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.result === 'ok') {
      console.log('Image deleted successfully');
    } else {
      throw new Error('Cloudinary delete failed');
    }
  } catch (error) {
    console.error('Delete image error:', error);
  }
}

export async function getRecentPosts() {
  try {
    const response = await fetch("http://localhost:8080/api/v1/posts/getPosts");
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