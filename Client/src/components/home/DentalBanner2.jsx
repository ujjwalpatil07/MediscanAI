
export default function DentalBanner2() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-6">
      <img
        src="https://images.unsplash.com/photo-1612277799613-b7e7011b7907"
        className="md:w-1/2 rounded-xl"
        alt="dental"
      />
      <div className="md:w-1/2 space-y-4">
        <h2 className="text-3xl font-bold">Why Choose Smile For All Your Dental Treatments?</h2>
        <ul className="list-disc pl-5 text-neutral-600 space-y-2">
          <li>Top quality dental service at affordable price.</li>
          <li>Use of latest and advanced solutions.</li>
          <li>Comfort-first dental treatment.</li>
        </ul>
        <button className="px-6 py-3 bg-primary text-white rounded-full">
          Book an Appointment
        </button>
      </div>
    </section>
  );
}
