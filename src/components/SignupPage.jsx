import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/useLanguage";
import API, { setAuthToken } from "../api/axios";

const initialFormData = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", shoeSize: "", bankName: "", accountNumber: "",
  accountName: "", password: "", confirmPassword: "",
  agreeTerms: false, ageConfirm: false,
};

function ErrorMsg({ field, errors }) {
  return errors[field] ? (
    <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
  ) : null;
}

export default function SignupPage() {
  const [formData,    setFormData]    = useState(initialFormData);
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [apiError,    setApiError]    = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim())     errs.firstName     = t("signup.errRequired");
    if (!formData.lastName.trim())      errs.lastName      = t("signup.errRequired");
    if (!formData.email.trim())         errs.email         = t("signup.errRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = t("signup.errEmail");
    if (!formData.phone.trim())         errs.phone         = t("signup.errRequired");
    if (!formData.address.trim())       errs.address       = t("signup.errRequired");
    if (!formData.shoeSize)             errs.shoeSize      = t("signup.errRequired");
    if (!formData.bankName.trim())      errs.bankName      = t("signup.errRequired");
    if (!formData.accountNumber.trim()) errs.accountNumber = t("signup.errRequired");
    if (!formData.accountName.trim())   errs.accountName   = t("signup.errRequired");
    if (!formData.password)             errs.password      = t("signup.errRequired");
    else if (formData.password.length < 8) errs.password   = t("signup.errMinPassword");
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = t("signup.errPasswordMatch");
    if (!formData.agreeTerms)           errs.agreeTerms    = t("signup.errRequired");
    if (!formData.ageConfirm)           errs.ageConfirm    = t("signup.errRequired");
    return errs;
  };

  const buildPayload = () => ({
    name: formData.firstName.trim(),
    surname: formData.lastName.trim(),
    email: formData.email, password: formData.password,
    phone: formData.phone, address: formData.address,
    shoe_size: Number(formData.shoeSize),
    bank_name: formData.bankName,
    bank_account_number: formData.accountNumber,
    bank_account_name: formData.accountName,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      document.querySelector(".error-field")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const payload = buildPayload();
    setLoading(true);
    try {
      const registerResponse = await API.post("/api/users/register", payload);
      try {
        const loginResponse = await API.post("/api/users/login", { email: payload.email, password: payload.password });
        setAuthToken(loginResponse.data.accessToken);
        login(loginResponse.data.user);
        setPreviewData({ ...payload, userId: registerResponse.data?.data?._id || loginResponse.data?.user?._id });
        setSubmitted(true);
        setTimeout(() => navigate("/userdashboard"), 1500);
      } catch {
        setApiError(t("signup.loginAfterRegister"));
        setSubmitted(true);
      }
    } catch (registerError) {
      const rawMessage =
        registerError.response?.data?.message ||
        registerError.response?.data?.error?.message ||
        registerError.message || t("signup.errRegistration");
      let message = rawMessage;
      if (typeof message === "string" && message.trim().toLowerCase() === "error!") {
        const fieldErrors = registerError.response?.data?.errors;
        message = fieldErrors
          ? Object.values(fieldErrors).flat().map((v) => typeof v === "string" ? v : JSON.stringify(v)).join(" ") || t("signup.errRegistration")
          : t("signup.errRegistration");
      }
      setApiError(message);
      if (registerError.response?.data?.errors) setErrors(registerError.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData); setErrors({}); setSubmitted(false);
    setPreviewData(null); setApiError("");
  };

  // ── Shared input styles ────────────────────────────────────────────────────
  const inp = (field) =>
    `w-full text-sm rounded-xl px-3 py-2.5 focus:outline-none transition-colors ${
      errors[field] ? "border border-red-400 error-field" : "border border-[#E2E8F0]"
    }`;
  const ist = { background: "#F8FAFC", color: "#0F172A" };
  const onF = (e) => { e.target.style.borderColor = "#C3FF51"; };
  const onB = (field) => (e) => { e.target.style.borderColor = errors[field] ? "#f87171" : "#E2E8F0"; };

  return (
    <div className="min-h-screen font-sora flex flex-col" style={{ background: "#F8FAFC" }}>

      {/* Back to Home */}
      <div className="max-w-5xl w-full mx-auto px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#94A3B8" }}
          onMouseEnter={(e) => { e.target.style.color = "#0F172A"; }}
          onMouseLeave={(e) => { e.target.style.color = "#94A3B8"; }}>
          {t("signup.backToHome")}
        </Link>
      </div>

      <div className="max-w-5xl w-full mx-auto px-6 pt-4 pb-8 flex flex-col gap-5 flex-grow">

        {/* Heading */}
        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "#94A3B8" }}>
            {t("signup.runningShoeRental")}
          </p>
          <Link to="/">
            <span className="text-[28px] font-extrabold tracking-widest text-black">
              KINETI<span style={{ color: "#C3FF51" }}>X</span>
            </span>
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mt-3" style={{ color: "#000000" }}>
            {t("signup.label")}
          </p>
        </div>

        {/* Form Card */}
        {!submitted ? (
          <div className="rounded-2xl p-6"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-xl font-bold" style={{ color: "#0F172A" }}>{t("signup.title")}</h2>
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                {t("signup.alreadyHave")}{" "}
                <Link to="/login" className="font-bold transition-colors" style={{ color: "#000000" }}
                  onMouseEnter={(e) => { e.target.style.color = "#C3FF51"; }}
                  onMouseLeave={(e) => { e.target.style.color = "#000000"; }}>
                  {t("signup.signIn")}
                </Link>
              </p>
            </div>

            {apiError && (
              <div className="mb-4 rounded-xl px-4 py-3 text-sm"
                style={{ background: "#FEE2E2", border: "1px solid #FECACA", color: "#DC2626" }}>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* ── Two-column fields ── */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">

                {/* LEFT — Personal Information */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>
                    {t("signup.personalInfo")}
                  </p>

                  {/* First + Last name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input type="text" name="firstName" placeholder={t("signup.firstNamePlaceholder")}
                        value={formData.firstName} onChange={handleChange}
                        className={inp("firstName")} style={ist} onFocus={onF} onBlur={onB("firstName")} />
                      <ErrorMsg field="firstName" errors={errors} />
                    </div>
                    <div>
                      <input type="text" name="lastName" placeholder={t("signup.lastNamePlaceholder")}
                        value={formData.lastName} onChange={handleChange}
                        className={inp("lastName")} style={ist} onFocus={onF} onBlur={onB("lastName")} />
                      <ErrorMsg field="lastName" errors={errors} />
                    </div>
                  </div>

                  <div>
                    <input type="email" name="email" placeholder={t("signup.emailPlaceholder")}
                      value={formData.email} onChange={handleChange}
                      className={inp("email")} style={ist} onFocus={onF} onBlur={onB("email")} />
                    <ErrorMsg field="email" errors={errors} />
                  </div>

                  <div>
                    <input type="text" name="phone" placeholder={t("signup.phonePlaceholder")}
                      value={formData.phone} onChange={handleChange}
                      className={inp("phone")} style={ist} onFocus={onF} onBlur={onB("phone")} />
                    <ErrorMsg field="phone" errors={errors} />
                  </div>

                  <div>
                    <input type="number" name="shoeSize" placeholder={t("signup.shoeSizePlaceholder")}
                      value={formData.shoeSize} onChange={handleChange}
                      className={inp("shoeSize")} style={ist} onFocus={onF} onBlur={onB("shoeSize")} />
                    <ErrorMsg field="shoeSize" errors={errors} />
                  </div>

                  <div>
                    <textarea name="address" placeholder={t("signup.addressPlaceholder")} rows={3}
                      value={formData.address} onChange={handleChange}
                      className={`${inp("address")} resize-none`} style={ist} onFocus={onF} onBlur={onB("address")} />
                    <ErrorMsg field="address" errors={errors} />
                  </div>
                </div>

                {/* RIGHT — Bank + Security */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>
                    {t("signup.bankInfo")}
                  </p>

                  <div>
                    <input type="text" name="bankName" placeholder={t("signup.bankNamePlaceholder")}
                      value={formData.bankName} onChange={handleChange}
                      className={inp("bankName")} style={ist} onFocus={onF} onBlur={onB("bankName")} />
                    <ErrorMsg field="bankName" errors={errors} />
                  </div>

                  <div>
                    <input type="text" name="accountNumber" placeholder={t("signup.accountNumberPlaceholder")}
                      value={formData.accountNumber} onChange={handleChange}
                      className={inp("accountNumber")} style={ist} onFocus={onF} onBlur={onB("accountNumber")} />
                    <ErrorMsg field="accountNumber" errors={errors} />
                  </div>

                  <div>
                    <input type="text" name="accountName" placeholder={t("signup.accountNamePlaceholder")}
                      value={formData.accountName} onChange={handleChange}
                      className={inp("accountName")} style={ist} onFocus={onF} onBlur={onB("accountName")} />
                    <ErrorMsg field="accountName" errors={errors} />
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-wider pt-1" style={{ color: "#64748B" }}>
                    {t("signup.security")}
                  </p>

                  <div>
                    <input type="password" name="password" placeholder={t("signup.passwordPlaceholder")}
                      value={formData.password} onChange={handleChange}
                      className={inp("password")} style={ist} onFocus={onF} onBlur={onB("password")} />
                    <ErrorMsg field="password" errors={errors} />
                  </div>

                  <div>
                    <input type="password" name="confirmPassword" placeholder={t("signup.confirmPasswordPlaceholder")}
                      value={formData.confirmPassword} onChange={handleChange}
                      className={inp("confirmPassword")} style={ist} onFocus={onF} onBlur={onB("confirmPassword")} />
                    <ErrorMsg field="confirmPassword" errors={errors} />
                  </div>
                </div>
              </div>

              {/* ── Bottom: checkboxes + submit ── */}
              <div className="mt-5 pt-4 border-t border-[#F1F5F9] grid grid-cols-2 gap-x-8 gap-y-3 items-end">
                <div className="space-y-2 text-sm" style={{ color: "#64748B" }}>
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms}
                        onChange={handleChange} className="mt-0.5 accent-[#C3FF51]" />
                      <span>{t("signup.agreeTerms")}</span>
                    </label>
                    <ErrorMsg field="agreeTerms" errors={errors} />
                  </div>
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" name="ageConfirm" checked={formData.ageConfirm}
                        onChange={handleChange} className="mt-0.5 accent-[#C3FF51]" />
                      <span>{t("signup.ageConfirm")}</span>
                    </label>
                    <ErrorMsg field="ageConfirm" errors={errors} />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
                  style={loading
                    ? { background: "#E2E8F0", color: "#94A3B8", cursor: "not-allowed" }
                    : { background: "#C3FF51", color: "#0F172A" }}>
                  {loading ? t("signup.creating") : t("signup.submit")}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Success State */
          <div className="flex-grow flex items-center justify-center">
            <div className="rounded-2xl p-10 text-center max-w-sm w-full"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(195,255,81,0.1)", border: "1px solid rgba(195,255,81,0.3)" }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#C3FF51">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "#0F172A" }}>{t("signup.accountCreated")}</h2>
              {apiError ? (
                <p className="text-sm mb-1" style={{ color: "#F59E0B" }}>{apiError}</p>
              ) : (
                <p className="text-sm mb-1" style={{ color: "#94A3B8" }}>{t("signup.redirecting")}</p>
              )}
              <p className="font-semibold mb-6" style={{ color: "#4D7C0F" }}>{previewData?.name}</p>
              <button onClick={() => navigate("/userdashboard")}
                className="w-full py-2.5 rounded-xl font-semibold text-sm mb-3 active:scale-[0.98]"
                style={{ background: "#C3FF51", color: "#0F172A" }}>
                {t("signup.goToDashboard")}
              </button>
              <button onClick={handleReset}
                className="w-full py-2.5 rounded-xl font-semibold text-sm transition-colors"
                style={{ border: "1px solid #E2E8F0", color: "#64748B" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C3FF51"; e.currentTarget.style.color = "#4D7C0F"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B"; }}>
                {t("signup.registerAnother")}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
