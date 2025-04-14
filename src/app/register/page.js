"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(1); //step स्टेट 1 या 2 हो सकता है (1 = OTP भेजने का स्टेप, 2 = रजिस्ट्रेशन फॉर्म स्टेप)

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(''); // Store email separately for step 2

    const handleSendOTP = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const email = formData.get('email');

        if (!email) {
            toast.error("ईमेल आवश्यक है!");
            setLoading(false);
            return;
        }

        setEmail(email); // Store email for step 2

        axios.post("https://node-js-login-register-profile.onrender.com/api/frontend/users/sendotp", { email })
            .then((res) => {
                if (res.data.status === 0) {
                    toast.success("OTP भेजा गया है! अपना ईमेल चेक करें");
                    setStep(2);
                } else {
                    toast.error(res.data.msg || "OTP भेजने में समस्या आई");
                }
            })
            .catch((err) => {
                toast.error(err.response?.data?.msg || "OTP भेजने में त्रुटि!");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const otp = formData.get('otp')?.toString().trim() || '';

        // Validate OTP format (4 digits)
        if (!/^\d{4}$/.test(otp)) {
            toast.error("कृपया सही OTP दर्ज करें (4 अंक)");
            setLoading(false);
            return;
        }

        const registrationData = {
            name: formData.get('name'),
            email: email, // Use stored email
            mobileNumber: formData.get('mobileNumber'),
            password: formData.get('password'),
            otp: otp
        };

        axios.post("https://node-js-login-register-profile.onrender.com/api/frontend/users/register", registrationData)
            .then((result) => {
                if (result.data.status) {
                    toast.success(result.data.message || "रजिस्ट्रेशन सफल रहा!");
                    router.push("/login");
                } else {
                    toast.error(result.data.message || "रजिस्ट्रेशन असफल रहा!");
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "wrong otp");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {step === 1 ? 'OTP प्राप्त करें' : 'रजिस्टर करें'}
                </h2>

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                your Email                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                defaultValue={email}
                                placeholder="your@email.com"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'भेज रहे हैं...' : 'OTP भेजें'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                पूरा नाम
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="what is your name"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                ईमेल पता
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                मोबाइल नंबर
                            </label>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                placeholder="98XXXXXX10"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                पासवर्ड
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="मजबूत पासवर्ड"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                placeholder="आपका OTP (4 अंक)"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                maxLength={4}
                                pattern="\d{4}"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 transition"
                            >
                                पीछे जाएं
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'प्रोसेस हो रहा है...' : 'रजिस्टर करें'}
                            </button>
                        </div>
                        <div>
                            <h1>your otp valid in 10 </h1>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}