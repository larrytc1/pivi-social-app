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
  const post = allPosts.find(p => p.id === postId);
  if (post) return post;
  return getTaggedPostById(postId);
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
  const inRegular = !!getAllPosts().find(p => p.id === postId);
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
    if (inRegular) {
      updatePost(postId, { comments: post.comments });
    } else {
      updateTaggedPost(postId, { comments: post.comments });
    }
    console.log('COMMENT_ADDED_TO_DB', { postId, commentId: newComment.id });
    return newComment;
  }
  return null;
}

export function likeComment(postId, commentId, userId) {
  const inRegular = !!getAllPosts().find(p => p.id === postId);
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
      if (inRegular) {
        updatePost(postId, { comments: post.comments });
      } else {
        updateTaggedPost(postId, { comments: post.comments });
      }
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
  if (existingPosts.length === 0) {
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
    localStorage.setItem('piviPosts', JSON.stringify(defaultPosts));
    console.log('DEFAULT_POSTS_INITIALIZED', { count: defaultPosts.length });
  }
}

export function getTaggedPosts() {
  try {
    const posts = localStorage.getItem('piviTaggedPosts');
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error('ERROR_PARSING_TAGGED_POSTS', error);
    return [];
  }
}

export function getTaggedPostById(postId) {
  const allPosts = getTaggedPosts();
  return allPosts.find(post => post.id === postId) || null;
}

export function updateTaggedPost(postId, updates) {
  const allPosts = getTaggedPosts();
  const postIndex = allPosts.findIndex(post => post.id === postId);
  if (postIndex !== -1) {
    allPosts[postIndex] = { ...allPosts[postIndex], ...updates };
    localStorage.setItem('piviTaggedPosts', JSON.stringify(allPosts));
    console.log('TAGGED_POST_UPDATED', { postId });
    return allPosts[postIndex];
  }
  return null;
}

export function toggleTagLike(postId, userId) {
  const post = getTaggedPostById(postId);
  if (post) {
    if (!post.likedBy) {
      post.likedBy = [];
    }
    const idx = post.likedBy.indexOf(userId);
    if (idx === -1) {
      post.likedBy.push(userId);
      post.likes = (post.likes || 0) + 1;
    } else {
      post.likedBy.splice(idx, 1);
      post.likes = Math.max(0, (post.likes || 1) - 1);
    }
    updateTaggedPost(postId, { likes: post.likes, likedBy: post.likedBy });
    console.log('TAG_LIKE_TOGGLED_IN_DB', { postId, userId, totalLikes: post.likes, liked: idx === -1 });
    return post;
  }
  return null;
}

export function initializeDefaultTaggedPosts() {
  const existing = getTaggedPosts();
  if (existing.length === 0) {
    const defaultTagged = [
      {
        id: 'tag_1',
        type: 'picture',
        taggerUsername: '@alex_travels',
        taggerAvatar: 'AT',
        title: 'Group photo at the summit',
        description: 'Made it to the top! This view was worth every step.',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        likes: 24,
        comments: [],
        shares: 3,
        likedBy: [],
        taggedAt: '2 hours ago'
      },
      {
        id: 'tag_2',
        type: 'video',
        taggerUsername: '@mike_surf',
        taggerAvatar: 'MS',
        title: 'Surf session highlights',
        description: 'Check out these awesome waves we caught this morning!',
        thumbnail: 'https://images.unsplash.com/photo-1531722569936-825d4eebb6f1?w=600&h=400&fit=crop',
        duration: '1:45',
        likes: 18,
        comments: [],
        shares: 7,
        likedBy: [],
        taggedAt: '5 hours ago'
      },
      {
        id: 'tag_3',
        type: 'picture',
        taggerUsername: '@sarah_art',
        taggerAvatar: 'SA',
        title: 'Art show opening night',
        description: 'So glad you were there with us for this special evening!',
        thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop',
        likes: 31,
        comments: [],
        shares: 5,
        likedBy: [],
        taggedAt: '1 day ago'
      },
      {
        id: 'tag_4',
        type: 'video',
        taggerUsername: '@dave_music',
        taggerAvatar: 'DM',
        title: 'Live performance clip',
        description: 'That moment we were all on stage together!',
        thumbnail: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=400&fit=crop',
        duration: '3:12',
        likes: 42,
        comments: [],
        shares: 11,
        likedBy: [],
        taggedAt: '2 days ago'
      },
      {
        id: 'tag_5',
        type: 'picture',
        taggerUsername: '@jen_food',
        taggerAvatar: 'JF',
        title: 'Brunch squad goals',
        description: 'Best brunch in the city, glad we finally made it here!',
        thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
        likes: 15,
        comments: [],
        shares: 2,
        likedBy: [],
        taggedAt: '3 days ago'
      }
    ];
    localStorage.setItem('piviTaggedPosts', JSON.stringify(defaultTagged));
    console.log('DEFAULT_TAGGED_POSTS_INITIALIZED', { count: defaultTagged.length });
  }
}