export default function ContactForm() {

    const inputStyle = "w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-[#C3FF51] transition";

    return (
        <form className="bg-zinc-950 border border-zinc-900 p-8 rounded-2xl space-y-5">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Report an Issue / Send a Message</h2>
                <p className="text-xs text-gray-500">Fill out the form below, and our team will assist you as soon as possible.</p>
            </div>


            <div>
                <label className="text-xs text-gray-400 block mb-2">Full Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g., Somchai Jaidee" className={inputStyle} required />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400 block mb-2">Email <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="your@email.com" className={inputStyle} required />
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-2">Phone Number</label>
                    <input type="text" placeholder="08x-xxx-xxxx" className={inputStyle} />
                </div>
            </div>


            <div>
                <label className="text-xs text-gray-400 block mb-2">Order ID</label>
                <input type="text" placeholder="e.g., KNX-2026-00123" className={inputStyle} />
            </div>


            <div>
                <label className="text-xs text-gray-400 block mb-2">Issue Details <span className="text-red-500">*</span></label>
                <textarea rows="4" placeholder="Please describe your issue in detail..." className={inputStyle} required></textarea>
            </div>


            <div>
                <label className="text-xs text-gray-400 block mb-1">Attach Images  <span className="text-gray-600">(แนะนำสำหรับกรณีรองเท้าเสียหาย)</span></label>
                <div className="border border-dashed border-zinc-800 bg-zinc-900/50 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700 transition">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">📁</span>
                        <div>
                            <p className="text-xs text-gray-300">Click to upload images</p>
                            <p className="text-[10px] text-gray-600">PNG, JPG, HEIC — Max 10MB per file (up to 5 images)</p>
                        </div>
                    </div>
                    <span className="text-[10px] bg-zinc-800 text-gray-400 px-2 py-1 rounded">Important</span>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button type="submit" className="bg-[#C3FF51] hover:bg-[#a2e632] text-black font-bold py-3 px-6 rounded-full text-sm flex items-center gap-2 transition transform active:scale-95">
                    Send Message ➔
                </button>
            </div>
        </form>
    );
}