const doctors = [
  {
    name: "John Carry",
    role: "Cardiologist",
    photo: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Maria Warner",
    role: "Oncologist",
    photo: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Jenny Wilson",
    role: "Pediatrician",
    photo: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Arnold James",
    role: "Dental Surgeon",
    photo: "https://randomuser.me/api/portraits/men/35.jpg"
  }
];

export default function Specialists() {
  return (
    <section className="bg-background-light px-8 py-10 ">
      <h2 className="text-3xl font-semibold mb-6 text-center">Meet Our Specialists</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {doctors.map((d) => (
          <div key={d.name} className="space-y-2 text-center">
            <img
              className="w-full h-48 object-cover rounded-lg"
              src={d.photo}
              alt={d.name}
            />
            <h4 className="font-medium">{d.name}</h4>
            <p className="text-sm text-neutral-500">{d.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

