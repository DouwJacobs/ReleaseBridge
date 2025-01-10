const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Load environment variables
require('dotenv').config();

// Get allowed origins from the environment variable (default to an empty array if not set)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow the request
      callback(null, true);
    } else {
      // Reject the request
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

// Endpoint to fetch releases
app.get('/releases', async (req, res) => {
  try {
    const response = await githubApi.get(
      `/repos/${REPO_OWNER}/${REPO_NAME}/releases`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch release notes' });
  }
});

// Endpoint to fetch commits
app.get('/commits', async (req, res) => {
  const { branch, per_page } = req.query;

  try {
    const response = await githubApi.get(
      `/repos/${REPO_OWNER}/${REPO_NAME}/commits`,
      {
        params: {
          branch,
          per_page,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
