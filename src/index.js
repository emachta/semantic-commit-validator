import React from 'react';
import ReactDOM from 'react-dom/client';
import { Helmet } from 'react-helmet';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Helmet>
      <title>Semantic Commit Validator | Online Commit Message Linter</title>
      <meta name="description" content="Free online tool to validate and lint git commit messages. Check if your commits follow conventional commits specification. Perfect for semantic versioning and changelog generation." />
      <meta name="keywords" content="commit linter, commit lint, validate commit, semantic commit, conventional commits, git commit validator, commit message checker, commit format validator" />
      <meta property="og:title" content="Semantic Commit Validator | Online Commit Message Linter" />
      <meta property="og:description" content="Validate your git commit messages instantly. Free online commit linter following conventional commits specification." />
      <meta name="twitter:title" content="Semantic Commit Validator | Online Commit Message Linter" />
      <meta name="twitter:description" content="Free online tool to validate and lint your git commit messages." />
    </Helmet>
    <App />
  </React.StrictMode>
);
