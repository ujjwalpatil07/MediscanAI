import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQ() {

    const [activeFaq, setActiveFaq] = useState(null);

    const allFaqs = [
        { question: "What services do you offer?", answer: "We offer a wide range of services including root canal treatment, dental implants, cosmetic dentistry, cardiology, ophthalmology, and more." },
        { question: "How can I book an appointment?", answer: "You can book an appointment online through our website, via our mobile app, or by calling our office directly." },
        { question: "Are your doctors qualified?", answer: "Yes, our doctors are highly qualified, certified professionals with years of experience in their respective fields." },
        { question: "Do you accept insurance?", answer: "Yes, we accept most major insurance plans. Contact us to verify your specific plan." },
        { question: "What payment methods do you accept?", answer: "We accept cash, credit cards, debit cards, UPI, PayPal, and most digital payment methods." },
        { question: "How long does it take to get an appointment?", answer: "It typically takes 30 minutes to 1 hour to get an appointment, depending on availability." },
        { question: "What happens if I need to reschedule my appointment?", answer: "Please call our office at least 24 hours in advance, and we'll help you reschedule." },
        { question: "Can I cancel my appointment?", answer: "Yes, you can cancel your appointment up to 24 hours in advance without any fee." },
        { question: "What should I do if I have a dental emergency?", answer: "If you have a dental emergency, please call our emergency hotline immediately." },
        { question: "Is there a cost for my initial consultation?", answer: "No, there is no cost for your initial consultation." }
    ];


    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/30">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about our services</p>
                </div>
                <div className="space-y-3">
                    {allFaqs.slice(0, 8).map((faq, idx) => (
                        <div key={idx} className="bg-green-500 dark:bg-gray-800/50 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                className={`w-full px-5 py-3 text-left flex justify-between items-center ${activeFaq === idx ? "bg-green-500 border-b border-white/50" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/30 dark:hover:bg-gray-700/50"} transition-colors`}
                            >
                                <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-white' : ''}`} />
                            </button>
                            {activeFaq === idx && (
                                <div className={`px-5 pb-3 text-white pt-2 text-sm ${activeFaq === idx && "bg-green-500"}`}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}