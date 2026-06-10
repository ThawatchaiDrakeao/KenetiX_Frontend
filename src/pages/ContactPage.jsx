import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <main className="max-w-[1400px] w-full my-20 mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start flex-grow">

                <div className="lg:col-span-4">
                    <ContactInfo />
                </div>

                <div className="lg:col-span-8">
                    <ContactForm />
                </div>
            </main>

            <Footer />
        </div>
    );
}