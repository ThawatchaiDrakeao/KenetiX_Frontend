import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import Navbar from "../components/Navbar";

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black flex flex-col justify-between">

                <main className="max-w-7xl w-full my-20 mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start flex-grow">

                    <div className="lg:col-span-4">
                        <ContactInfo />
                    </div>

                    <div className="lg:col-span-8">
                        <ContactForm />
                    </div>
                </main>
            </div>
        </>
    );
}