import Login from "./Login";
import { Link } from "react-router-dom";
const Header = ({ isLoggedIn, onLogout, onLogin }) => {
  return (
    <div
      className="row justify-content-between align-items-center bg-dark p-2 mb-3"
      style={{ color: "white" }}
    >
      <h1 className="col-md-3">Event Planner</h1>
      <div className="col-md-9">
        {isLoggedIn ? (
          <button
            className="btn btn-secondary"
            style={{ float: "right" }}
            onClick={onLogout}
          >
            Log Out
          </button>
        ) : (
          <div className="row">
            <div className="col-sm-10">
              <Login onLogin={onLogin} />
            </div>
            <div className="col-sm-2 mt-4">
              <Link to="/signup">
                <button className="btn btn-info" style={{ minWidth: "82px" }}>
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;