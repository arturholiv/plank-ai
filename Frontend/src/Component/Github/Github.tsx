import React from 'react';
import { FaGithub } from 'react-icons/fa';
import './Github.css';

const GitHub = () => {
  return (
    <a
      href="https://github.com/arturholiv"
      target="_blank"
      rel="noopener noreferrer"
      className="github-ball"
    >
      <FaGithub size={40} color="#fff" />
    </a>
  );
};

export default GitHub;
