import { useLanguage } from '../context/useLanguage';

export default function ContactInfo() {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">

            <div>
                <span className="text-[#C3FF51] text-xs font-bold uppercase tracking-wider block mb-2">{t("contact.badge")}</span>
                <h1 className="text-4xl font-bold text-white mb-4">{t("contact.title")}</h1>
                <p className="text-gray-400 text-sm">{t("contact.subtitle")}</p>
            </div>

            <div className="space-y-3">
                {/* Phone Card */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-gray-400 bg-zinc-800 p-3 rounded-lg">📞</div>
                        <div>
                            <p className="text-xs text-gray-500">{t("contact.phone.label")}</p>
                            <p className="text-white font-bold tracking-wide">02-821-5700</p>
                            <p className="text-[10px] text-gray-500">{t("contact.phone.hours")}</p>
                        </div>
                    </div>
                    <span className="bg-green-950 text-[#C3FF51] text-[10px] font-bold px-2 py-1 rounded-full border border-green-800">● Online</span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="text-gray-400 bg-zinc-800 p-3 rounded-lg">✉️</div>
                    <div>
                        <p className="text-xs text-gray-500">{t("contact.email.label")}</p>
                        <p className="text-white font-bold">hello@kinetix.run</p>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4">
                    <div className="text-gray-400 bg-zinc-800 p-3 rounded-lg">💬</div>
                    <div>
                        <p className="text-xs text-gray-500">{t("contact.line.label")}</p>
                        <p className="text-white font-bold">@kinetix</p>
                    </div>
                </div>
            </div>

            <div className="border border-dashed border-lime-900 bg-lime-950/20 p-4 rounded-xl text-xs text-gray-400">
                {t("contact.replyNote1")}<span className="text-[#C3FF51] font-bold">{t("contact.replyNote2")}</span>{t("contact.replyNote3")}
            </div>
        </div>
    );
}
