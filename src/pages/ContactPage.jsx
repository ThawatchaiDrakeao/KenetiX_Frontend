import { Link } from "react-router-dom";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col justify-between">

            <main className="max-w-7xl w-full my-20 mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start flex-grow">
                <div className="lg:col-span-12 mb-2">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#C3FF51] transition-colors font-sora">
                        ← Back to Home
                    </Link>
                </div>

                <div className="lg:col-span-4">
                    <ContactInfo />
                </div>

                <div className="lg:col-span-8">
                    <ContactForm />
                </div>
            </main>
        </div>
    );
}