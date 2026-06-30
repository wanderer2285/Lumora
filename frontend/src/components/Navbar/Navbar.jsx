import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          Lumora
        </Link>

        <div className="flex gap-6">

          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/courses"
            className="hover:text-blue-600"
          >
            Courses
          </Link>

          <Link
            to="/login"
            className="hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="hover:text-blue-600"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;