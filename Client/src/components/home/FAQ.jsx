import { useState } from "react";

const faqs = [
  {
    q: "Can I book appointments online?",
    a: "Yes! You can book appointments for both online and offline consultations directly from our platform."
  },
  {
    q: "Do you offer emergency medical support?",
    a: "Yes, we provide emergency support 24/7. Please use the hotline or AI Help option on the platform."
  },
  {
    q: "Can I view my medical records?",
    a: "Your entire medical history including prescriptions and reports are stored securely in your account."
  }
];

export default function FAQ() {
  const [active, setActive] = useState(null);

  return (
    <section>
      <h2 className="text-3xl font-semibold mb-6 text-center">Frequently Ask Questions</h2>
      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <button
            key={f.q}
            type="button"
            className="w-full text-left border rounded-lg p-4 cursor-pointer focus:outline-none"
            onClick={() => setActive(active === idx ? null : idx)}
          >
            <h4 className="font-medium flex justify-between">
              <span>{f.q}</span>{" "}
              <span>{active === idx ? "-" : "+"}</span>
            </h4>
            {active === idx && (
              <p className="mt-3 text-sm text-neutral-500">{f.a}</p>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
