"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Register() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const router = useRouter(); // ✅ useRouter() को Client Component में उपयोग करें

    const [formSubmit, setformSubmit] = useState(false)

    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://node-js-login-register-profile.onrender.com/api/frontend/users/sendotp", {
                name,
                email,
                mobile_number: mobileNumber,
                password,
            });

            if (res.data.status === 0) {
                toast.success("OTP भेजा गया है!");
                setStep(2);
            } else {
                toast.error(res.data.msg);
            }
        } catch (err) {
            toast.error("OTP भेजने में त्रुटि!");
        }
    };
    const handleRegister = (e) => {
        e.preventDefault();
        var data = {
            name: e.target.name.value, // ✔️ सही 
            email: e.target.email.value, // ✔️ सही
            mobile_number: e.target.mobile_number.value,// ✔️ सही
            password: e.target.password.value, // ✔️ सही
        };
        axios.post("https://node-js-login-register-profile.onrender.com/api/frontend/users/register", data).then((result) => {
            console.log(result.data)
            if (result.data.status == true) {
                setformSubmit(true)
                toast.success(result.data.message)
                router.push("/login"); // ✅ अगर टोकन है तो Redirect करें

            }
            else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || "Registration failed!");
        })

    };
    useEffect(() => {

    }, [formSubmit])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6">रजिस्टर करें</h2>

                {step === 1 ? (
                    <form onSubmit={handleSendOTP}>
                        <input
                            type="text"
                            name="name"
                            placeholder="नाम"
                            className="w-full p-2 border rounded mb-4"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="ईमेल"
                            className="w-full p-2 border rounded mb-4"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            name="mobile_number"
                            placeholder="मोबाइल नंबर"
                            className="w-full p-2 border rounded mb-4"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="पासवर्ड"
                            className="w-full p-2 border rounded mb-4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            OTP भेजें
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            name="otp"
                            placeholder="OTP दर्ज करें"
                            className="w-full p-2 border rounded mb-4"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                            रजिस्टर करें
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
