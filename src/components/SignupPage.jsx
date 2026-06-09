import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/useLanguage";
import API from "../api/axios";

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
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Invalid email format";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.shoeSize) errs.shoeSize = "Shoe size is required";
    if (!formData.bankName.trim()) errs.bankName = "Bank name is required";
    if (!formData.accountNumber.trim())
      errs.accountNumber = "Account number is required";
    if (!formData.accountName.trim())
      errs.accountName = "Account name is required";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!formData.agreeTerms) errs.agreeTerms = "You must agree to the terms";
    if (!formData.ageConfirm) errs.ageConfirm = "You must confirm your age";
    return errs;
  };

  const buildPayload = () => ({
    name: `${formData.firstName}`,
    surname: `${formData.lastName}`.trim(),
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    address: formData.address,
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
      const firstErrorField = document.querySelector(".error-field");
      if (firstErrorField)
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const payload = buildPayload();
    setLoading(true);
    try {
      const registerResponse = await API.post("/api/users/register", payload);
      try {
        const loginResponse = await API.post("/api/users/login", { email: payload.email, password: payload.password });
        login(loginResponse.data.user);

        // Step 3: Set success state and redirect to dashboard
        setPreviewData({
          ...payload,
          userId:
            registerResponse.data?.data?._id || loginResponse.data?.user?._id,
        });
        setSubmitted(true);

        setTimeout(() => {
          navigate("/userdashboard");
        }, 1500);
      } catch (loginError) {
        console.error(
          "⚠️ Registration succeeded but auto-login failed:",
          loginError,
        );
        console.log("Login error response:", loginError.response?.data);

        // Registration worked, but login failed
        setApiError(
          "Account created successfully! However, auto-login failed. Please go to the login page.",
        );
        setSubmitted(true);
      }
    } catch (registerError) {
      const rawMessage =
        registerError.response?.data?.message ||
        registerError.response?.data?.error?.message ||
        registerError.message || t("signup.errRegistration");
      let message = rawMessage;

      if (
        typeof message === "string" &&
        message.trim().toLowerCase() === "error!"
      ) {
        if (registerError.response?.data?.errors) {
          const fieldErrors = registerError.response.data.errors;
          const joined = Object.values(fieldErrors)
            .flat()
            .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
            .join(" ");
          message = joined || "Registration failed. Please try again.";
        } else {
          message = "Registration failed. Please try again.";
        }
      }
      setApiError(message);
      if (registerError.response?.data?.errors) setErrors(registerError.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData); setErrors({}); setSubmitted(false);
    setPreviewData(null); setApiError(""); setLoading(false);
  };

  const inputClass = (field) =>
    `w-full bg-black border rounded-xl px-4 py-3 focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-500 focus:border-red-400 error-field"
        : "border-zinc-700 focus:border-lime-400"
    }`;
  const ist = { background: "#F8FAFC", color: "#0F172A" };
  const onF = (e) => { e.target.style.borderColor = "#C3FF51"; };
  const onB = (field) => (e) => { e.target.style.borderColor = errors[field] ? "#f87171" : "#E2E8F0"; };

  return (
    <div className="min-h-screen font-sora flex flex-col" style={{ background: "#F8FAFC" }}>

      {/* Back to Home */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-lime-400 transition-colors font-sora"
        >
          ← Back to Home
        </Link>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Profile Data",
                desc: "Store customer information including full name, email, phone number, address, and shoe size.",
              },
              {
                title: "Bank Information",
                desc: "Securely save bank name, account number, and account owner details for refund processing.",
              },
              {
                title: "Account Status",
                desc: "System tracks reject count, account status, suspended date, and account activity.",
              },
              {
                title: "Secure Access",
                desc: "Your account is protected with authentication and encrypted password management.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
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

        {/* Register Form */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-[32px] p-8 shadow-2xl shadow-lime-500/10">
          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold">Create Account</h2>
                <p className="text-zinc-400 mt-3">
                  Join the Kinetix ecosystem today
                </p>
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
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-1 accent-lime-400"
                      />
                      <span>
                        I agree to the Terms of Service and Privacy Policy.
                      </span>
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

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold transition-all mt-4 ${
                    loading
                      ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                      : "bg-lime-400 text-black hover:scale-[1.01]"
                  }`}
                >
                  {loading ? "CREATING ACCOUNT..." : "+ CREATE ACCOUNT"}
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
  // ... (rest of the component stays the same)
}
