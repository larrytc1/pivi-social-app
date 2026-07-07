export function getUserByEmail(email) {
  const allUsers = getAllUsers();
  const user = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  console.log('USER_LOOKUP', { email, found: !!user });
  return user;
}

export function getAllUsers() {
  try {
    const users = localStorage.getItem('piviUsers');
    const parsedUsers = users ? JSON.parse(users) : [];
    console.log('GET_ALL_USERS', { count: parsedUsers.length });
    return parsedUsers;
  } catch (error) {
    console.error('ERROR_PARSING_USERS', error);
    return [];
  }
}

export function getUserById(userId) {
  const allUsers = getAllUsers();
  return allUsers.find(user => user.id === userId);
}

export function createUser(email, password) {
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    console.log('CREATE_USER_FAILED - EMAIL_ALREADY_EXISTS', { email });
    return null;
  }

  const userId = 'user_' + Date.now();
  const newUser = {
    id: userId,
    email: email.toLowerCase(),
    password: password,
    createdAt: new Date().toISOString(),
    posts: [],
    followers: 0,
    following: 0
  };

  try {
    const allUsers = getAllUsers();
    allUsers.push(newUser);
    localStorage.setItem('piviUsers', JSON.stringify(allUsers));
    console.log('USER_CREATED', { userId, email });
    return newUser;
  } catch (error) {
    console.error('ERROR_CREATING_USER', error);
    return null;
  }
}

export function updateUser(userId, updates) {
  const allUsers = getAllUsers();
  const userIndex = allUsers.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    allUsers[userIndex] = { ...allUsers[userIndex], ...updates };
    localStorage.setItem('piviUsers', JSON.stringify(allUsers));
    console.log('USER_UPDATED', { userId, ...updates });
    return allUsers[userIndex];
  }
  return null;
}

export function getAllPosts() {
  try {
    const posts = localStorage.getItem('piviPosts');
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error('ERROR_PARSING_POSTS', error);
    return [];
  }
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
    console.log('POST_UPDATED', { postId, ...updates });
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
  console.log('POST_CREATED', newPost);
  return newPost;
}

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
    console.log('COMMENT_ADDED_TO_DB', { postId, commentId: newComment.id });
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
      console.log('COMMENT_LIKED_IN_DB', { postId, commentId, userId });
      return comment;
    }
  }
  return null;
}

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
    console.log('LIKE_TOGGLED_IN_DB', { postId, userId, totalLikes: post.likes, liked: userLikedIndex === -1 });
    return post;
  }
  return null;
}

export function initializeDefaultPosts() {
  const existingPosts = getAllPosts();
  const hasPictures = existingPosts.some(p => !p.type || p.type === 'picture');
  if (!hasPictures) {
    const defaultPosts = [
      {
        id: 1,
        userId: 'user_demo',
        author: '@samwilson',
        username: 'samwilson',
        avatar: 'SW',
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
        avatar: 'WL',
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
        avatar: 'OV',
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
    const allPosts = getAllPosts();
    const merged = [...allPosts, ...defaultPosts];
    localStorage.setItem('piviPosts', JSON.stringify(merged));
    console.log('DEFAULT_POSTS_INITIALIZED', { count: defaultPosts.length });
  }
}

export function initializeDefaultVideos() {
  const existingPosts = getAllPosts();
  const hasVideos = existingPosts.some(p => p.type === 'video');
  if (!hasVideos) {
    const defaultVideos = [
      {
        id: 'video_1',
        userId: 'user_demo',
        author: '@traveler_john',
        username: 'traveler_john',
        avatar: 'TJ',
        title: 'Summer Vibes',
        description: 'Exploring the best beaches this summer. Nothing beats the ocean breeze and warm sunshine.',
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
        duration: '2:34',
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        views: 0,
        uploadedAt: '3 hours ago',
        type: 'video',
        createdAt: new Date().toISOString()
      },
      {
        id: 'video_2',
        userId: 'user_demo2',
        author: '@nature_lover',
        username: 'nature_lover',
        avatar: 'NL',
        title: 'Into the Wild',
        description: 'A peaceful hike through ancient forests. The sounds of nature are the best therapy.',
        thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop',
        duration: '5:12',
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        views: 0,
        uploadedAt: '1 hour ago',
        type: 'video',
        createdAt: new Date().toISOString()
      },
      {
        id: 'video_3',
        userId: 'user_demo3',
        author: '@citylife',
        username: 'citylife',
        avatar: 'CL',
        title: 'City at Night',
        description: 'The city never sleeps. A stunning time-lapse of downtown lights and late-night energy.',
        thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop',
        duration: '1:48',
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        views: 0,
        uploadedAt: '30 minutes ago',
        type: 'video',
        createdAt: new Date().toISOString()
      },
      {
        id: 'video_4',
        userId: 'user_demo4',
        author: '@foodie_chef',
        username: 'foodie_chef',
        avatar: 'FC',
        title: 'Quick Pasta Recipe',
        description: 'My secret pasta recipe ready in under 15 minutes. Simple ingredients, incredible flavour.',
        thumbnail: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop',
        duration: '3:22',
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        views: 0,
        uploadedAt: '5 hours ago',
        type: 'video',
        createdAt: new Date().toISOString()
      },
      {
        id: 'video_5',
        userId: 'user_demo5',
        author: '@adventure_seeker',
        username: 'adventure_seeker',
        avatar: 'AS',
        title: 'Mountain Trail Run',
        description: 'Running at 3000m altitude. Challenging but the views from the top make every step worth it.',
        thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop',
        duration: '4:05',
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        views: 0,
        uploadedAt: '2 hours ago',
        type: 'video',
        createdAt: new Date().toISOString()
      }
    ];
    const allPosts = getAllPosts();
    const merged = [...allPosts, ...defaultVideos];
    localStorage.setItem('piviPosts', JSON.stringify(merged));
    console.log('DEFAULT_VIDEOS_INITIALIZED', { count: defaultVideos.length });
  }
}

export function incrementVideoViews(videoId) {
  const post = getPostById(videoId);
  if (post && post.type === 'video') {
    const newViews = (post.views || 0) + 1;
    updatePost(videoId, { views: newViews });
    console.log('VIDEO_VIEWS_INCREMENTED', { videoId, views: newViews });
    return newViews;
  }
  return null;
}