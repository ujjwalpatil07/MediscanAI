const services = [
  {
    title: "Root Canal Treatment",
    desc: "Root canal treatment is a dental procedure used to treat infection at the centre of a tooth."
  },
  {
    title: "Cataract Surgery",
    desc: "A procedure to remove the cloudy lens of the eye and restore clear vision."
  },
  {
    title: "ECG (Electrocardiogram)",
    desc: "A test that records the electrical activity of the heart to detect any issues."
  }
];

export default function Services() {
  return (
    <section>
      <div className="grid gap-6 md:grid-cols-3">
        {services.map(s => (
          <div
            key={s.title}
            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-neutral-500">{s.desc}</p>
            <button className="mt-3 text-primary">Learn More →</button>
          </div>
        ))}
      </div>
    </section>
  );
}

