
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page-not-found">
    <div className="not-found-code">404</div>
    <h1 className="not-found-title">Page Not Found</h1>
    <p className="not-found-sub">The route you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </div>
);

export default NotFound;
