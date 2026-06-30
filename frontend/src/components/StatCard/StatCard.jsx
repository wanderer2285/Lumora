function StatCard({ number, label }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition duration-300">

      <h2 className="text-4xl font-bold text-blue-600">
        {number}
      </h2>

      <p className="mt-2 text-slate-600 font-medium">
        {label}
      </p>

    </div>
  );
}

export default StatCard;