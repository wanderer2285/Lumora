import Button from "../../components/Button/Button";
import StatCard from "../../components/StatCard/StatCard";
import Card from "../../components/Card/Card";
import FeatureCard from "../../components/FeatureCard/FeatureCard";

function Home() {
  return (
    <>
      <section className="py-24 text-center">

        <h1 className="text-6xl font-bold text-slate-900">
          Learn Without Limits
        </h1>

        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
          Master programming, mathematics, and AI through interactive courses,
          hands-on projects, and expert instructors.
        </p>

        <div className="mt-10 flex justify-center gap-4">

        <Button>
         Explore Courses
        </Button>

        <Button variant="secondary">
          Become an Instructor
        </Button>

        </div>

      </section>

      <section className="py-16">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      <StatCard
      number="150+"
      label="Courses"
      />

      <StatCard
      number="5000+"
      label="Students"
      />

      <StatCard
      number="50+"
      label="Expert Instructors"
      />

      </div>

      </section>

      <section className="py-20">

  <h2 className="text-4xl font-bold text-center text-slate-900">
    Featured Courses
  </h2>

  <p className="text-center text-slate-600 mt-3 mb-12">
    Start learning from our most popular courses.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

    <Card
      title="Machine Learning Fundamentals"
      level="Beginner"
      description="Learn the foundations of machine learning with hands-on examples."
    />

    <Card
      title="React Bootcamp"
      level="Intermediate"
      description="Build modern web applications using React and reusable components."
    />

    <Card
      title="SQL Essentials"
      level="Beginner"
      description="Master SQL queries, joins, and database design."
    />

  </div>

</section>

<section className="py-20">

  <h2 className="text-4xl font-bold text-center text-slate-900">
    Why Choose Lumora?
  </h2>

  <p className="text-center text-slate-600 mt-3 mb-12">
    Everything you need for an engaging learning experience.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

    <FeatureCard
      icon="📚"
      title="Interactive Learning"
      description="Hands-on lessons designed for practical understanding."
    />

    <FeatureCard
      icon="📈"
      title="Track Progress"
      description="Monitor your learning journey and stay motivated."
    />

    <FeatureCard
      icon="👨‍🏫"
      title="Expert Instructors"
      description="Learn from experienced educators and professionals."
    />

    <FeatureCard
      icon="🌍"
      title="Learn Anywhere"
      description="Access courses anytime from any device."
    />

  </div>

</section>
    </>
  );
}

export default Home;