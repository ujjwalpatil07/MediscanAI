
export default function DentalBanner1() {
  return (
    <section className="bg-[#F2FFF9] p-8 rounded-xl flex flex-col md:flex-row items-center gap-10">
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-3">
          Leave Your Worries & Enjoy A Healthier, More Precise Smile
        </h2>
        <p className="text-neutral-600 mb-4">
          We use only the best quality materials for our patients. So don’t worry
          and book yourself.
        </p>
        <button className="px-6 py-3 bg-primary text-white rounded-full">
          Book a Dental Appointment
        </button>
      </div>
      <img
        src="https://images.unsplash.com/photo-1606813909026-2fe3d3815353"
        className="md:w-1/2 rounded-xl"
        alt="dental"
      />
    </section>
  );
}
