const blogs = [
  {
    title: "Care of your Teeth",
    img: "https://images.unsplash.com/photo-1530023367847-a683933f417b"
  },
  {
    title: "Stay Healthy",
    img: "https://images.unsplash.com/photo-1551601651-2a8555f1a136"
  },
  {
    title: "Dental Hygiene Tips",
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac34"
  }
];

export default function Blog() {
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">News & Articles</h2>
        <button className="text-primary">View All →</button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {blogs.map((b) => (
          <div key={b.title} className="p-4 bg-white rounded-xl shadow">
            <img
              className="w-full h-44 object-cover rounded-md"
              src={b.img}
              alt={b.title}
            />
            <h3 className="mt-3 font-medium">{b.title}</h3>
            <p className="text-sm text-neutral-500">Learn to take care of your teeth...</p>
          </div>
        ))}
      </div>
    </section>
  );
}
