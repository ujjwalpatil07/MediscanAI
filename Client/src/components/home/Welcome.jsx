
export default function Welcome() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8">
      <div className="md:w-1/2 space-y-4">
        <h2 className="text-3xl font-bold">
          We’re Welcoming New Patients And Can’t Wait To Meet You.
        </h2>
        <p className="text-neutral-600">
          We work to make the overall patient experience the most relaxing and
          positive you’ve ever had.
        </p>
        <button className="px-6 py-3 bg-primary text-white rounded-full">
          Make An Appointment
        </button>
      </div>
      <img
        src="https://images.unsplash.com/photo-1631217861170-402029cb1fd7"
        className="md:w-1/2 rounded-xl"
        alt="clinic"
      />
    </section>
  );
}
