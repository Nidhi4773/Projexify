const express = require('express');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());

app.post('/projects', async (req, res) => {

  try {

    const { skills } = req.body;

    const formattedSkills =
      skills
      .split(',')
      .map(skill => skill.trim())
      .join('+');

    // GitHub API

    const githubResponse = await axios.get(

      `https://api.github.com/search/repositories?q=${formattedSkills}&sort=updated&per_page=50`
    );

    // Shuffle projects randomly

    const shuffledRepos =
      githubResponse.data.items.sort(
        () => 0.5 - Math.random()
      );

    // Take random 10 projects

    const repos =
      shuffledRepos.slice(0, 10);

    let repoText = '';

    repos.forEach((repo, index) => {

      repoText += `

Project ${index + 1}

Title: ${repo.name}

Description: ${repo.description}

Language: ${repo.language}

GitHub URL: ${repo.html_url}

Stars: ${repo.stargazers_count}

`;
    });

    // Groq API

    const groqResponse = await axios.post(

      'https://api.groq.com/openai/v1/chat/completions',

      {
        model: 'llama-3.3-70b-versatile',

        messages: [
          {
            role: 'user',

            content: `

Based on these REAL GitHub projects:

${repoText}

Return ONLY valid JSON array.

Example format:

[
  {
    "title":"AI Chatbot",
    "description":"A chatbot using OpenAI",
    "technologies":"React, Node.js",
    "model":"GPT",
    "github":"https://github.com/project"
  }
]

Rules:
- Return ONLY JSON
- No markdown
- No explanation
- Give exactly 5 projects
- Use REAL GitHub projects only
- Every project should be different

`
          }
        ]
      },

      {
        headers: {

          Authorization:
            `Bearer ${process.env.GROQ_API_KEY}`,

          'Content-Type': 'application/json'
        }
      }
    );

    const aiResult =
      groqResponse.data.choices[0].message.content;

    res.json({
      result: aiResult
    });

  }

  catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: 'Error fetching projects'
    });
  }
});

app.listen(5000, () => {

  console.log(
    'Server running on port 5000'
  );
});