import './App.css';

import axios from 'axios';

import { useState } from 'react';

import {
  FaHeart,
  FaRedo,
  FaRocket,
  FaGithub,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

function App() {

  const [skills, setSkills] =
    useState('');

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [activeIndex, setActiveIndex] =
    useState(null);

  async function recommendProjects() {

    if (!skills) {

      alert(
        'Please enter skills'
      );

      return;
    }

    setLoading(true);

    setMessage('');

    try {

      const response =
        await axios.post(

          'http://localhost:5000/projects',

          {
            skills
          }
        );

      const cleaned =
        response.data.result
        .replace(/```json/g, '')
        .replace(/```/g, '');

      const parsed =
        JSON.parse(cleaned);

      setProjects(parsed);

      setActiveIndex(null);

    }

    catch (error) {

      console.log(error);

      alert(
        'Failed to fetch projects'
      );
    }

    setLoading(false);
  }

  function likeProject() {

    setMessage(
      '🔥 Awesome! Best of luck with your project 🚀'
    );
  }

  function toggleProject(index) {

    if (activeIndex === index) {

      setActiveIndex(null);

    } else {

      setActiveIndex(index);
    }
  }

  return (

    <div className="main-container">

      <div className="hero-section">

        <h1>
          Projexify
        </h1>

        <p>
          AI Powered GitHub Project Discovery
        </p>

      </div>

      <div className="input-container">

        <input
          type="text"

          placeholder="
Enter skills like AI, React, ML, Python
"

          value={skills}

          onChange={(e) =>
            setSkills(
              e.target.value
            )
          }
        />

        <button
          className="recommend-btn"

          onClick={
            recommendProjects
          }
        >

          <FaRocket />

          Explore

        </button>

      </div>

      {loading && (

        <div className="loader-container">

          <div className="loader"></div>

          <p>
            Finding projects...
          </p>

        </div>
      )}

      {message && (

        <div className="success-message">

          {message}

        </div>
      )}

      <div className="accordion-container">

        {projects.map(
          (project, index) => (

            <div
              className="accordion-card"

              key={index}
            >

              <div
                className="accordion-header"

                onClick={() =>
                  toggleProject(index)
                }
              >

                <h2>
                  {project.title}
                </h2>

                <span>

                  {activeIndex === index
                    ? <FaChevronUp />
                    : <FaChevronDown />
                  }

                </span>

              </div>

              {activeIndex === index && (

                <div
                  className="accordion-content"
                >

                  <p className="description">

                    {project.description}

                  </p>

                  <a
                    href={project.github}

                    target="_blank"

                    rel="noreferrer"

                    className="github-btn"
                  >

                    <FaGithub />

                    Open GitHub Project

                  </a>

                </div>
              )}

            </div>
          )
        )}

      </div>

      {projects.length > 0 && (

        <div className="bottom-buttons">

          <button
            className="like-btn"

            onClick={likeProject}
          >

            <FaHeart />

            Like

          </button>

          <button
            className="regen-btn"

            onClick={recommendProjects}
          >

            <FaRedo />

            New Projects

          </button>

        </div>
      )}

    </div>
  );
}

export default App;