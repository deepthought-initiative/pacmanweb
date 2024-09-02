import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/">Go back to the home page</Link>
    </div>
  );
};

export default PageNotFound;
