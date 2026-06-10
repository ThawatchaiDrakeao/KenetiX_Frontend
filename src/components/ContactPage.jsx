import ContactInfo from "../pages/ContactInfo";
import ContactForm from "../pages/ContactForm";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col justify-between">



            <main className="max-w-7xl w-full mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start flex-grow">

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