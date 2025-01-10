const express = require('express');
const axios = require('axios');

const app = express();

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
        const response = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/releases`);
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
        const response = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/commits`, {
            params: {
                branch,
                per_page
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch commits' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
