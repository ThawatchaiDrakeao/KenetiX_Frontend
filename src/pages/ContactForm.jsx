import { useLanguage } from '../context/useLanguage';

export default function ContactForm() {
    const { t } = useLanguage();
    const inputStyle = "w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm outline-none focus:border-[#C3FF51] transition";

    return (
        <form className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-3">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">{t("contact.form.title")}</h2>
                <p className="text-xs text-gray-500">{t("contact.form.subtitle")}</p>
            </div>

            <div>
                <label className="text-xs text-gray-400 block mb-1">{t("contact.form.fullName")} <span className="text-red-500">*</span></label>
                <input type="text" placeholder={t("contact.form.fullNamePlaceholder")} className={inputStyle} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400 block mb-1">{t("contact.form.email")} <span className="text-red-500">*</span></label>
                    <input type="email" placeholder={t("contact.form.emailPlaceholder")} className={inputStyle} required />
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">{t("contact.form.phone")}</label>
                    <input type="text" placeholder={t("contact.form.phonePlaceholder")} className={inputStyle} />
                </div>
            </div>

            <div>
                <label className="text-xs text-gray-400 block mb-1">{t("contact.form.orderId")}</label>
                <input type="text" placeholder={t("contact.form.orderIdPlaceholder")} className={inputStyle} />
            </div>

            <div>
                <label className="text-xs text-gray-400 block mb-1">{t("contact.form.issueDetails")} <span className="text-red-500">*</span></label>
                <textarea rows="3" placeholder={t("contact.form.issueDetailsPlaceholder")} className={inputStyle} required></textarea>
            </div>

            <div>
                <label className="text-xs text-gray-400 block mb-1">
                    {t("contact.form.attachImages")} <span className="text-gray-600">{t("contact.form.attachNote")}</span>
                </label>
                <div className="border border-dashed border-zinc-800 bg-zinc-900/50 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700 transition">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">📁</span>
                        <div>
                            <p className="text-xs text-gray-300">{t("contact.form.uploadText")}</p>
                            <p className="text-[10px] text-gray-600">{t("contact.form.uploadSubtext")}</p>
                        </div>
                    </div>
                    <span className="text-[10px] bg-zinc-800 text-gray-400 px-2 py-1 rounded">{t("contact.form.important")}</span>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button type="submit" className="bg-[#C3FF51] hover:bg-[#a2e632] text-black font-bold py-3 px-6 rounded-full text-sm flex items-center gap-2 transition transform active:scale-95">
                    {t("contact.form.sendMessage")} ➔
                </button>
            </div>
        </form>
    );
}
