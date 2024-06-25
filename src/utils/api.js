export const URL_APP_FILE = 'https://comment.yourcodeapp.com/assets/';
const api = (() => {
  const BASE_URL = 'http://localhost:5000/api';

  function putAcessToken(token) {
    localStorage.setItem('accessToken', token);
  }

  function getAcessToken() {
    return localStorage.getItem('accessToken');
  }

  async function _fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        token: `${getAcessToken()}`,
      },
    });
  }

  async function register({ username, email, password, role }) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        role: role || 'user',
      }),
    });
    const responseJson = await response.json();

    const { errors } = responseJson;
    if (errors) {
      const errorMessage = errors.map((error) => error.msg).join('\n');
      throw new Error(errorMessage);
    }

    return responseJson;
  }

  async function login({ email, password }) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const responseJson = await response.json();

    const { errors } = responseJson;
    if (errors) {
      const errorMessage = errors.map((error) => error.msg).join('\n');
      throw new Error(errorMessage);
    }
    return responseJson;
  }
  async function getPostsHome() {
    const response = await fetch(`${BASE_URL}/home/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }
  async function getPostsForum(page) {
    const response = await _fetchWithAuth(
      `${BASE_URL}/posts/post?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const responseJson = await response.json();
    const { data, error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return {
      data,
      hasMore: data.length > 0, // Adjust this according to your API response
      page,
    };
  }

  async function getPostsTrends() {
    const response = await fetch(`${BASE_URL}/posts/trends`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { data, error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async function getPostsUpcoming() {
    const response = await fetch(`${BASE_URL}/posts/upcoming`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { data, error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async function getPostsBookmarks() {
    const response = await _fetchWithAuth(`${BASE_URL}/posts/bookmarks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { data, error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async function getDetailPost(id) {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { data, error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async function createPost(postData) {
    const {
      ownerId,
      title,
      description,
      image,
      file,
      startDate,
      endDate,
      maxParticipants,
      category,
    } = postData;

    const payload = new FormData();
    payload.append('file', file);
    payload.append('ownerId', ownerId);
    payload.append('image', image);
    payload.append('title', title);
    payload.append('description', description);
    payload.append('startDate', startDate);
    payload.append('endDate', endDate);
    payload.append('maxParticipants', maxParticipants);
    payload.append('category', category);

    const response = await _fetchWithAuth(`${BASE_URL}/posts`, {
      method: 'POST',
      body: payload,
    });
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }
  async function editPost(editData) {
    const {
      postId,
      file,
      title,
      description,
      image,
      startDate,
      endDate,
      maxParticipants,
      category,
    } = editData;

    // Create FormData payload
    const payload = new FormData();
    if (file) payload.append('file', file);
    if (image) payload.append('image', image);
    if (title) payload.append('title', title);
    if (description) payload.append('description', description);
    if (category) payload.append('category', category);
    if (category === 'Event') {
      if (startDate) payload.append('startDate', startDate);
      if (endDate) payload.append('endDate', endDate);
      if (maxParticipants) payload.append('maxParticipants', maxParticipants);
    }

    try {
      const response = await _fetchWithAuth(`${BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        body: payload,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }

      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.error('Error updating post:', err.message);
      throw err;
    }
  }

  async function deletePost(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  async function getMyPosts(userId) {
    const response = await _fetchWithAuth(`${BASE_URL}/posts/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { data, error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
  async function getRecentEvents(userId) {
    const response = await _fetchWithAuth(`${BASE_URL}/events/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { data, error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async function getOwnProfile() {
    const response = await _fetchWithAuth(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseJson = await response.json();
    const { data, error } = responseJson;

    if (error) {
      throw new Error(error);
    }
    return data;
  }
  async function getAllUser() {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { data, error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
  async function getDetailUser(userId) {
    const userById = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await userById.json();
    const { data, error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async function editProfileUser(data) {
    const { username, name, headTitle, phone, email } = data;
    const response = await _fetchWithAuth(`${BASE_URL}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        name,
        email,
        headTitle,
        phone,
      }),
    });
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }
  async function changePassword(data) {
    const { oldPassword, newPassword } = data;
    const response = await _fetchWithAuth(`${BASE_URL}/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  async function deleteUserByAuth() {
    const response = await _fetchWithAuth(`${BASE_URL}/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  async function addComment(data) {
    const { postId, content } = data;
    const response = await _fetchWithAuth(
      `${BASE_URL}/posts/${postId}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      },
    );
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  async function editComment(formData) {
    const { postId, commentId, content } = formData;
    const response = await _fetchWithAuth(
      `${BASE_URL}/posts/${postId}/comments/${commentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      },
    );
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  async function deleteComment(data) {
    const { postId, commentId } = data;
    const response = await _fetchWithAuth(
      `${BASE_URL}/posts/${postId}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  async function joinEvent(dataParticipant) {
    const { eventId } = dataParticipant;
    const response = await _fetchWithAuth(
      `${BASE_URL}/events/${eventId}/join`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  async function leaveEvent(dataParticipant) {
    const { eventId } = dataParticipant;
    const response = await _fetchWithAuth(
      `${BASE_URL}/events/${eventId}/leave`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  async function addBookmark(dataPost) {
    const { postId } = dataPost;
    const response = await _fetchWithAuth(
      `${BASE_URL}/posts/${postId}/bookmarks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  async function removeBookmark(dataPost) {
    const { postId } = dataPost;
    const response = await _fetchWithAuth(
      `${BASE_URL}/posts/${postId}/bookmarks`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const responseJson = await response.json();
    const { error } = responseJson;
    if (error) {
      throw new Error(error.message);
    }
    return responseJson;
  }

  return {
    register,
    login,
    putAcessToken,
    getAcessToken,
    _fetchWithAuth,
    getOwnProfile,
    getPostsHome,
    getPostsForum,
    getPostsTrends,
    getPostsUpcoming,
    getPostsBookmarks,
    getRecentEvents,
    getDetailPost,
    createPost,
    editPost,
    deletePost,
    getMyPosts,
    getAllUser,
    getDetailUser,
    editProfileUser,
    changePassword,
    deleteUserByAuth,
    addComment,
    editComment,
    deleteComment,
    joinEvent,
    leaveEvent,
    addBookmark,
    removeBookmark,
  };
})();

export default api;
