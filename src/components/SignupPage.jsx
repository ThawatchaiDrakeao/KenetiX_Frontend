import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API, { setAuthToken } from "../api/axios";
import Navbar from "../components/Navbar";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  shoeSize: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
  ageConfirm: false,
};

function ErrorMsg({ field, errors }) {
  return errors[field] ? (
    <p className="text-red-400 text-xs mt-1 ml-1">{errors[field]}</p>
  ) : null;
}

export default function SignupPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
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
    if (!formData.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!formData.agreeTerms) errs.agreeTerms = "You must agree to the terms";
    if (!formData.ageConfirm) errs.ageConfirm = "You must confirm your age";
    return errs;
  };

  const buildPayload = () => ({
    name: formData.firstName.trim(),
    surname: formData.lastName.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    address: formData.address.trim(),
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
      await API.post("/api/users/register", payload);
      try {
        const loginResponse = await API.post("/api/users/login", {
          email: payload.email,
          password: payload.password,
        });

        // 🔥 Save token before setting user
        setAuthToken(loginResponse.data.accessToken);
        login(loginResponse.data.user);

        setPreviewData({
          ...payload,
          userId: loginResponse.data.user?._id,
        });
        setSubmitted(true);
        setTimeout(() => navigate("/userdashboard"), 1500);
      } catch (loginError) {
        setApiError(
          "Account created! However, auto-login failed. Please log in manually."
        );
        setSubmitted(true);
      }
    } catch (registerError) {
      const rawMessage =
        registerError.response?.data?.message ||
        registerError.response?.data?.error?.message ||
        registerError.message ||
        "Registration failed. Please try again.";
      let message = rawMessage;
      if (
        typeof message === "string" &&
        message.trim().toLowerCase() === "error!"
      ) {
        const fieldErrors = registerError.response?.data?.errors;
        message = fieldErrors
          ? Object.values(fieldErrors).flat().join(" ")
          : "Registration failed. Please try again.";
      }
      setApiError(message);
      if (registerError.response?.data?.errors) {
        setErrors(registerError.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitted(false);
    setPreviewData(null);
    setApiError("");
    setLoading(false);
  };

  const inputClass = (field) =>
    `w-full bg-black border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors[field]
      ? "border-red-500 focus:border-red-400 error-field"
      : "border-zinc-700 focus:border-lime-400"
    }`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white font-sans">
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="text-lime-400 uppercase tracking-[0.2em] text-sm mb-4">
                Customer Registration
              </p>
              <h1 className="text-5xl font-bold leading-tight">
                Join the <span className="text-lime-400">KINETIX</span>
                <br />
                Running Shoe Rental Platform
              </h1>
              <p className="text-zinc-400 mt-6 max-w-lg leading-relaxed">
                Register your account to start renting premium running shoes,
                manage your profile, and track your rental history.
              </p>
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
            {submitted && previewData && (
              <div className="bg-zinc-950 border border-lime-400/30 rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                  <h3 className="text-lime-400 font-semibold text-sm uppercase tracking-wider">
                    Registration Successful
                  </h3>
                </div>
                <p className="text-zinc-500 text-xs">
                  {apiError
                    ? "Account created! Please login manually."
                    : "Redirecting to your dashboard..."}
                </p>
                {previewData.userId && (
                  <p className="text-zinc-500 text-xs">
                    User ID: {previewData.userId}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Register Form */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-/[32px/] p-8 shadow-2xl shadow-lime-500/10">
            {!submitted ? (
              <>
                <div className="mb-8 text-center">
                  <h2 className="text-4xl font-bold">Create Account</h2>
                  <p className="text-zinc-400 mt-3">
                    Join the Kinetix ecosystem today
                  </p>
                </div>
                {apiError && (
                  <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                    {apiError}
                  </div>
                )}
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lime-400 font-semibold mb-4 text-sm uppercase tracking-wider">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={inputClass("firstName")}
                        />
                        <ErrorMsg field="firstName" errors={errors} />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={inputClass("lastName")}
                        />
                        <ErrorMsg field="lastName" errors={errors} />
                      </div>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClass("email")}
                        />
                        <ErrorMsg field="email" errors={errors} />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClass("phone")}
                        />
                        <ErrorMsg field="phone" errors={errors} />
                      </div>
                      <div>
                        <textarea
                          name="address"
                          placeholder="Address"
                          rows={3}
                          value={formData.address}
                          onChange={handleChange}
                          className={`${inputClass("address")} resize-none`}
                        />
                        <ErrorMsg field="address" errors={errors} />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="shoeSize"
                          placeholder="Shoe Size"
                          value={formData.shoeSize}
                          onChange={handleChange}
                          className={inputClass("shoeSize")}
                        />
                        <ErrorMsg field="shoeSize" errors={errors} />
                      </div>
                    </div>
                  </div>

                  {/* Bank Information */}
                  <div>
                    <h3 className="text-lime-400 font-semibold mb-4 text-sm uppercase tracking-wider">
                      Bank Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          name="bankName"
                          placeholder="Bank Name"
                          value={formData.bankName}
                          onChange={handleChange}
                          className={inputClass("bankName")}
                        />
                        <ErrorMsg field="bankName" errors={errors} />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="accountNumber"
                          placeholder="Account Number"
                          value={formData.accountNumber}
                          onChange={handleChange}
                          className={inputClass("accountNumber")}
                        />
                        <ErrorMsg field="accountNumber" errors={errors} />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="accountName"
                          placeholder="Account Name"
                          value={formData.accountName}
                          onChange={handleChange}
                          className={inputClass("accountName")}
                        />
                        <ErrorMsg field="accountName" errors={errors} />
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div>
                    <h3 className="text-lime-400 font-semibold mb-4 text-sm uppercase tracking-wider">
                      Security
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <input
                          type="password"
                          name="password"
                          placeholder="Password (min 8 characters)"
                          value={formData.password}
                          onChange={handleChange}
                          className={inputClass("password")}
                        />
                        <ErrorMsg field="password" errors={errors} />
                      </div>
                      <div>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={inputClass("confirmPassword")}
                        />
                        <ErrorMsg field="confirmPassword" errors={errors} />
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-3 text-sm text-zinc-400 pt-2">
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
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="ageConfirm"
                          checked={formData.ageConfirm}
                          onChange={handleChange}
                          className="mt-1 accent-lime-400"
                        />
                        <span>I confirm that I am over 20 years old.</span>
                      </label>
                      <ErrorMsg field="ageConfirm" errors={errors} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold transition-all mt-4 ${loading
                      ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                      : "bg-lime-400 text-black hover:scale-[1.01]"
                      }`}
                  >
                    {loading ? "CREATING ACCOUNT..." : "+ CREATE ACCOUNT"}
                  </button>
                  <p className="text-center text-zinc-500 text-sm pt-2">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-white hover:text-lime-400 cursor-pointer"
                    >
                      Sign In
                    </Link>
                  </p>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-lime-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Account Created!</h2>
                  {apiError ? (
                    <p className="text-amber-400 mt-2 text-sm">{apiError}</p>
                  ) : (
                    <p className="text-zinc-400 mt-2">
                      Redirecting to your dashboard...
                    </p>
                  )}
                </div>
                <button
                  onClick={() => navigate("/userdashboard")}
                  className="w-full bg-lime-400 text-black py-3 rounded-2xl font-semibold hover:scale-[1.01] transition-transform"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleReset}
                  className="w-full border border-zinc-700 text-zinc-300 py-3 rounded-2xl font-semibold hover:border-lime-400 hover:text-lime-400 transition-colors"
                >
                  Register Another Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}