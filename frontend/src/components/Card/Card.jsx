import Button from "../Button/Button";

function Card({ title, level, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">

      <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

      <div className="p-6">

        <h3 className="text-xl font-bold text-slate-900">
          {title}
        </h3>

        <p className="text-blue-600 font-medium mt-1">
          {level}
        </p>

        <p className="text-slate-600 mt-4">
          {description}
        </p>

        <div className="mt-6">
          <Button>
            View Course
          </Button>
        </div>

      </div>

    </div>
  );
}

export default Card;