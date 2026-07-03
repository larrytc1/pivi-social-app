const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Configure S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configure multer for in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// Upload post with media
router.post('/upload', verifyToken, upload.array('media', 5), async (req, res) => {
  try {
    const { caption } = req.body;
    const pool = req.app.locals.pool;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create post
      const postResult = await client.query(
        'INSERT INTO posts (user_id, caption) VALUES ($1, $2) RETURNING id',
        [req.user.id, caption || '']
      );
      const postId = postResult.rows[0].id;

      const mediaUrls = [];

      // Upload files to S3 and save media records
      for (const file of files) {
        const fileExtension = file.originalname.split('.').pop();
        const s3Key = `posts/${req.user.id}/${postId}/${uuidv4()}.${fileExtension}`;
        const mediaType = file.mimetype.startsWith('image') ? 'image' : 'video';

        // Upload to S3
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read'
        };

        const uploadResult = await s3.upload(params).promise();
        const mediaUrl = uploadResult.Location;

        // Save media record
        await client.query(
          'INSERT INTO media (post_id, media_type, media_url, s3_key) VALUES ($1, $2, $3, $4)',
          [postId, mediaType, mediaUrl, s3Key]
        );

        mediaUrls.push({ type: mediaType, url: mediaUrl });
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Post created successfully',
        post: { id: postId, caption, media: mediaUrls, user_id: req.user.id, created_at: new Date() }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload post' });
  }
});

// Get feed (all posts from user and friends)
router.get('/feed', verifyToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const pool = req.app.locals.pool;

    const query = `
      SELECT 
        p.id, 
        p.caption, 
        p.created_at, 
        p.user_id,
        u.username,
        u.profile_picture_url,
        COUNT(l.id) as likes_count,
        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) as liked_by_user,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
        json_agg(json_build_object('id', m.id, 'type', m.media_type, 'url', m.media_url)) FILTER (WHERE m.id IS NOT NULL) as media
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN media m ON p.id = m.post_id
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [req.user.id, limit, offset]);
    res.json(result.rows);
  } catch (err) {
    console.error('Feed fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Get posts by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    const pool = req.app.locals.pool;

    const query = `
      SELECT 
        p.id, 
        p.caption, 
        p.created_at, 
        p.user_id,
        u.username,
        u.profile_picture_url,
        COUNT(l.id) as likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
        json_agg(json_build_object('id', m.id, 'type', m.media_type, 'url', m.media_url)) FILTER (WHERE m.id IS NOT NULL) as media
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN media m ON p.id = m.post_id
      WHERE p.user_id = $1
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);
    res.json(result.rows);
  } catch (err) {
    console.error('User posts fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

// Like a post
router.post('/:postId/like', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const pool = req.app.locals.pool;

    await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [postId, req.user.id]
    );

    res.json({ message: 'Post liked' });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Unlike a post
router.delete('/:postId/like', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const pool = req.app.locals.pool;

    await pool.query(
      'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, req.user.id]
    );

    res.json({ message: 'Post unliked' });
  } catch (err) {
    console.error('Unlike error:', err);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

// Add comment
router.post('/:postId/comments', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const pool = req.app.locals.pool;

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, content, created_at',
      [postId, req.user.id, content]
    );

    res.status(201).json({ message: 'Comment added', comment: result.rows[0] });
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments for post
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const pool = req.app.locals.pool;

    const result = await pool.query(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.username 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.post_id = $1 
       ORDER BY c.created_at DESC`,
      [postId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Comments fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

module.exports = router;
