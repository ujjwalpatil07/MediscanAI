const clients = [
  {
    name: "Mona Daniel",
    text:
      "Professional and caring service! My tooth extraction was painless. Highly recommend the team!"
  },
  {
    name: "Alena Alex",
    text:
      "Always a wonderful experience. Friendly staff and excellent medical care."
  },
  {
    name: "Thomas Edison",
    text:
      "Clean clinic, experienced doctors and helpful support. Definitely coming back."
  }
];

export default function Testimonials() {
  return (
    <section>
      <h2 className="text-3xl font-semibold mb-6 text-center">Our Happy Clients</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {clients.map((c) => (
          <div key={c.name} className="p-6 bg-white shadow rounded-xl">
            <p>"{c.text}"</p>
            <h4 className="mt-4 font-medium">{c.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
