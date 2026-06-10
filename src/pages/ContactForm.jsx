import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../context/useLanguage';

const MAX_FILES = 5;
const MAX_MB    = 10;

export default function ContactForm() {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({ fullName: '', email: '', phone: '', orderId: '', issueDetails: '' });
    const [files,   setFiles]   = useState([]);
    const [errors,  setErrors]  = useState({});
    const [dragging, setDragging] = useState(false);
    const [status,  setStatus]  = useState('idle'); // idle | sending | success

    const inputBase = "w-full p-2.5 bg-zinc-900 border rounded-xl text-white text-sm outline-none transition";
    const inputStyle = (field) =>
        `${inputBase} ${errors[field] ? 'border-red-500/70 focus:border-red-400' : 'border-zinc-800 focus:border-[#C3FF51]'}`;

    // ── Validation ────────────────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!form.fullName.trim())      e.fullName     = 'Required';
        if (!form.email.trim())         e.email        = 'Required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (!form.issueDetails.trim())  e.issueDetails = 'Required';
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    // ── File upload ───────────────────────────────────────────────────────────
    const addFiles = useCallback((incoming) => {
        const valid = [...incoming]
            .filter(f => f.type.startsWith('image/') && f.size <= MAX_MB * 1024 * 1024)
            .slice(0, MAX_FILES);
        setFiles(prev => {
            const combined = [...prev, ...valid];
            return combined.slice(0, MAX_FILES);
        });
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setStatus('sending');

        try {
            // Convert images to base64 for API
            const images = await Promise.all(files.map(f => new Promise((res) => {
                const reader = new FileReader();
                reader.onload = (ev) => res({ name: f.name, data: ev.target.result });
                reader.readAsDataURL(f);
            })));

            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, images }),
            });
            if (!res.ok) throw new Error('api_error');
            setStatus('success');
        } catch {
            // Fallback: open mail client with form data
            const body = [
                `Full Name: ${form.fullName}`,
                `Email: ${form.email}`,
                `Phone: ${form.phone || '-'}`,
                `Order ID: ${form.orderId || '-'}`,
                '',
                `Issue Details:\n${form.issueDetails}`,
                files.length ? `\n(${files.length} image(s) attached — please forward separately)` : '',
            ].join('\n');
            setStatus('success');
            window.location.href = `mailto:hello@kinetix.run?subject=Contact from ${encodeURIComponent(form.fullName)}&body=${encodeURIComponent(body)}`;
        }
    };

    // ── Success state ─────────────────────────────────────────────────────────
    if (status === 'success') {
        return (
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#C3FF51]/10 border border-[#C3FF51]/30 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#C3FF51]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Message Sent!</h3>
                    <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                </div>
                <button
                    onClick={() => { setStatus('idle'); setForm({ fullName: '', email: '', phone: '', orderId: '', issueDetails: '' }); setFiles([]); setErrors({}); }}
                    className="text-sm text-[#C3FF51] hover:underline mt-2"
                >
                    Send another message
                </button>
            </div>
        );
    }

    // ── Form ──────────────────────────────────────────────────────────────────
    return (
        <form onSubmit={handleSubmit} noValidate className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">{t("contact.form.title")}</h2>
                <p className="text-xs text-gray-500">{t("contact.form.subtitle")}</p>
            </div>

            {/* Full Name */}
            <div>
                <label className="text-xs text-gray-400 block mb-1">
                    {t("contact.form.fullName")} <span className="text-red-500">*</span>
                </label>
                <input
                    type="text" name="fullName" value={form.fullName}
                    onChange={handleChange}
                    placeholder={t("contact.form.fullNamePlaceholder")}
                    className={inputStyle('fullName')}
                />
                {errors.fullName && <p className="text-red-400 text-[11px] mt-1">{errors.fullName}</p>}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400 block mb-1">
                        {t("contact.form.email")} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email" name="email" value={form.email}
                        onChange={handleChange}
                        placeholder={t("contact.form.emailPlaceholder")}
                        className={inputStyle('email')}
                    />
                    {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">{t("contact.form.phone")}</label>
                    <input
                        type="text" name="phone" value={form.phone}
                        onChange={handleChange}
                        placeholder={t("contact.form.phonePlaceholder")}
                        className={inputStyle('phone')}
                    />
                </div>
            </div>

            {/* Order ID */}
            <div>
                <label className="text-xs text-gray-400 block mb-1">{t("contact.form.orderId")}</label>
                <input
                    type="text" name="orderId" value={form.orderId}
                    onChange={handleChange}
                    placeholder={t("contact.form.orderIdPlaceholder")}
                    className={inputStyle('orderId')}
                />
            </div>

            {/* Issue Details */}
            <div>
                <label className="text-xs text-gray-400 block mb-1">
                    {t("contact.form.issueDetails")} <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={4} name="issueDetails" value={form.issueDetails}
                    onChange={handleChange}
                    placeholder={t("contact.form.issueDetailsPlaceholder")}
                    className={`${inputStyle('issueDetails')} resize-none`}
                />
                {errors.issueDetails && <p className="text-red-400 text-[11px] mt-1">{errors.issueDetails}</p>}
            </div>

            {/* File upload */}
            <div>
                <label className="text-xs text-gray-400 block mb-1">
                    {t("contact.form.attachImages")}{' '}
                    <span className="text-gray-600">{t("contact.form.attachNote")}</span>
                </label>

                {/* Drop zone */}
                <div
                    onClick={() => files.length < MAX_FILES && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className="border border-dashed rounded-xl p-4 flex items-center justify-between transition cursor-pointer"
                    style={{
                        borderColor: dragging ? '#C3FF51' : '#3f3f46',
                        background: dragging ? 'rgba(195,255,81,0.04)' : 'rgba(39,39,42,0.5)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">📁</span>
                        <div>
                            <p className="text-xs text-gray-300">{t("contact.form.uploadText")}</p>
                            <p className="text-[10px] text-gray-600">{t("contact.form.uploadSubtext")}</p>
                        </div>
                    </div>
                    <span className="text-[10px] bg-zinc-800 text-gray-400 px-2 py-1 rounded">
                        {files.length}/{MAX_FILES}
                    </span>
                </div>

                <input
                    ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                />

                {/* Previews */}
                {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {files.map((f, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-700 group">
                                <img
                                    src={URL.createObjectURL(f)}
                                    alt={f.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button" onClick={() => removeFile(i)}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="bg-[#C3FF51] hover:bg-[#a2e632] text-black font-bold py-3 px-6 rounded-full text-sm flex items-center gap-2 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {status === 'sending' ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Sending…
                        </>
                    ) : (
                        <>{t("contact.form.sendMessage")} ➔</>
                    )}
                </button>
            </div>
        </form>
    );
}
