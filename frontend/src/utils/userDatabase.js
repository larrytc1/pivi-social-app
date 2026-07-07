export function getUserByEmail(email) {
  const allUsers = getAllUsers();
  return allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function getAllUsers() {
  const users = localStorage.getItem('piviUsers');
  return users ? JSON.parse(users) : [];
}

export function getUserById(userId) {
  const allUsers = getAllUsers();
  return allUsers.find(user => user.id === userId);
}

export function updateUser(userId, updates) {
  const allUsers = getAllUsers();
  const userIndex = allUsers.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    allUsers[userIndex] = { ...allUsers[userIndex], ...updates };
    localStorage.setItem('piviUsers', JSON.stringify(allUsers));
    console.log('✏️ USER_UPDATED', { userId, ...updates });
    return allUsers[userIndex];
  }
  return null;
}

// Posts Database
export function getAllPosts() {
  const posts = localStorage.getItem('piviPosts');
  return posts ? JSON.parse(posts) : [];
}

export function getPostById(postId) {
  const allPosts = getAllPosts();
  return allPosts.find(post => post.id === postId);
}

export function updatePost(postId, updates) {
  const allPosts = getAllPosts();
  const postIndex = allPosts.findIndex(post => post.id === postId);
  if (postIndex !== -1) {
    allPosts[postIndex] = { ...allPosts[postIndex], ...updates };
    localStorage.setItem('piviPosts', JSON.stringify(allPosts));
    console.log('✏️ POST_UPDATED', { postId, ...updates });
    return allPosts[postIndex];
  }
  return null;
}

export function createPost(post) {
  const allPosts = getAllPosts();
  const newPost = {
    ...post,
    id: post.id || 'post_' + Date.now(),
    likes: 0,
    comments: [],
    shares: 0,
    likedBy: [],
    createdAt: new Date().toISOString()
  };
  allPosts.push(newPost);
  localStorage.setItem('piviPosts', JSON.stringify(allPosts));
  console.log('📝 POST_CREATED', newPost);
  return newPost;
}

// Comments Database
export function addComment(postId, comment) {
  const post = getPostById(postId);
  if (post) {
    const newComment = {
      id: 'comment_' + Date.now(),
      ...comment,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };
    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push(newComment);
    updatePost(postId, { comments: post.comments });
    console.log('💬 COMMENT_ADDED_TO_DB', { postId, commentId: newComment.id });
    return newComment;
  }
  return null;
}

export function likeComment(postId, commentId, userId) {
  const post = getPostById(postId);
  if (post && post.comments) {
    const comment = post.comments.find(c => c.id === commentId);
    if (comment) {
      if (!comment.likedBy) {
        comment.likedBy = [];
      }
      const userLikedIndex = comment.likedBy.indexOf(userId);
      if (userLikedIndex === -1) {
        comment.likedBy.push(userId);
        comment.likes = (comment.likes || 0) + 1;
      } else {
        comment.likedBy.splice(userLikedIndex, 1);
        comment.likes = Math.max(0, (comment.likes || 1) - 1);
      }
      updatePost(postId, { comments: post.comments });
      console.log('❤️ COMMENT_LIKED_IN_DB', { postId, commentId, userId });
      return comment;
    }
  }
  return null;
}

// Likes Database
export function toggleLike(postId, userId) {
  const post = getPostById(postId);
  if (post) {
    if (!post.likedBy) {
      post.likedBy = [];
    }
    const userLikedIndex = post.likedBy.indexOf(userId);
    if (userLikedIndex === -1) {
      post.likedBy.push(userId);
      post.likes = (post.likes || 0) + 1;
    } else {
      post.likedBy.splice(userLikedIndex, 1);
      post.likes = Math.max(0, (post.likes || 1) - 1);
    }
    updatePost(postId, { likes: post.likes, likedBy: post.likedBy });
    console.log('❤️ LIKE_TOGGLED_IN_DB', { postId, userId, totalLikes: post.likes, liked: userLikedIndex === -1 });
    return post;
  }
  return null;
}

// Initialize default posts if none exist
export function initializeDefaultPosts() {
  const existingPosts = getAllPosts();
  if (existingPosts.length === 0) {
    const defaultPosts = [
      {
        id: 1,
        userId: 'user_demo',
        author: '@samwilson',
        username: 'samwilson',
        avatar: '👨‍🎨',
        title: 'City lights at night',
        description: 'Downtown never sleeps',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
        likes: 1,
        comments: [],
        shares: 0,
        likedBy: [],
        uploadedAt: '2 hours ago',
        type: 'picture',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        userId: 'user_demo2',
        author: '@wanderlust',
        username: 'wanderlust',
        avatar: '🌍',
        title: 'Mountain View',
        description: 'Breathtaking mountain scenery at sunset.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        likes: 5,
        comments: [],
        shares: 0,
        likedBy: [],
        uploadedAt: '1 hour ago',
        type: 'picture',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        userId: 'user_demo3',
        author: '@oceanvibes',
        username: 'oceanvibes',
        avatar: '🌊',
        title: 'Beach Sunset',
        description: 'Golden hour at the beach',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
        likes: 12,
        comments: [],
        shares: 0,
        likedBy: [],
        uploadedAt: '30 minutes ago',
        type: 'picture',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('piviPosts', JSON.stringify(defaultPosts));
    console.log('📚 DEFAULT_POSTS_INITIALIZED', { count: defaultPosts.length });
  }
}