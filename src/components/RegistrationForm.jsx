import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  CheckCircle,
  Lock,
  Send,
  Code,
  Zap,
  Star,
  Circle,
  Triangle,
  Square,
  ExternalLink,
  MoveRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NavbarTv from "./NavbarTv";

const SERVER_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://api.vjdataquesters.com";

const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const transitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pulseVariants = {
  animate: {
    opacity: [1, 0.8, 0.5, 0.8, 1],
    transition: {
      duration: 1.6,
      repeat: Infinity,
    },
  },
};

const FormComp = ({ setLoadingStatus, setSubmitStatus }) => {
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentFields, setShowPaymentFields] = useState(false); // Added this missing state
  const containerRef = useRef(null);

  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      college: "",
      collegeName: "",
      branch: "",
      section: "",
      collegeId: "",
      year: "",
      phno: "",
      email: "",
      paymentplatform: "",
      transactionid: "",
    },
  });

  const watchCollege = watch("college");


  const onSubmit = async (data) => {
    if (!file || !data.transactionid || !data.collegeId) {
      alert("Please fill all required fields and upload a payment proof.");
      return;
    }
    setIsSubmitting(true);
    try {
      const userId = `${data.transactionid.toLowerCase()}-${data.collegeId
        .toLowerCase()
        .replace(/\s+/g, "-")}-`;
      const fileName = userId + file.name.toLowerCase().replace(/\s+/g, "-");
      const fileType = file.type;
      const getUrl = await api.post("/register/get-signed-url", {
        fileName,
        fileType,
      });

      if (!getUrl.data.success) {
        alert("Failed to upload file. Please try again.");
        return;
      }

      const { signedUrl, fileName: fileNameStorage } = getUrl.data;
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": fileType,
        },
      });

      const finalData = {
        name: data.name,
        college: data.college === "Other" ? data.collegeName : data.college,
        branch: data.branch,
        section: data.section,
        collegeId: data.collegeId,
        year: data.year,
        phno: data.phno,
        email: data.email,
        paymentplatform: data.paymentplatform,
        transactionid: data.transactionid,
        image: fileNameStorage,
      };
      const response = await api.post("/register", finalData);
      console.log(finalData)
      if (!response.data.success) {
        alert("Registration failed. Please try again.");
        return;
      }

      setSubmitStatus(true);
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again." + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="text-[#f2ca46] relative rounded-xl">
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-3">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <img
              src="/events/Technovista2025/tv25-icons/tv-logo-ani.gif"
              alt="TechnoVista 2k25 Logo"
              className="w-12 h-12 m:w-114 md:h-114 lg:w-16 lg:h-16 object-contain bg-white rounded-xl"
            />
            <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#f2ca46] via-yellow-300 to-[#daa425] bg-clip-text text-transparent">
              TechnoVista 2k25
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto px-2 pb-4">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-4 md:p-6 border border-[#f2ca46]/30 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] my-2">
              <div className="grid gap-4 md:gap-6">
                {/* Full Name */}
                <div className="transform hover:opacity-90 transition-transform duration-300">
                  <div className="group relative">
                    <label className="text-sm font-medium text-yellow-300 block mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent placeholder-[#daa425]"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                        <Zap size={12} />
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* College Selection */}
                <div className="transform hover:opacity-90 transition-transform duration-300">
                  <div className="group relative">
                    <label className="text-sm font-medium text-yellow-300 block mb-2">
                      College <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-6">
                      {[
                        { value: "VNRVJIET", label: "VNRVJIET" },
                        { value: "Other", label: "Other" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            value={option.value}
                            {...register("college", {
                              required: "College selection is required",
                            })}
                            className="w-5 h-5 text-[#daa425] border-2 border-[#daa425] focus:ring-[#f2ca46] focus:ring-2"
                          />
                          <span className="text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.college && (
                      <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                        <Zap size={12} />
                        {errors.college.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Conditional College Name */}
                {watchCollege === "Other" && (
                  <motion.div
                    className="transform hover:opacity-90 transition-all duration-300"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="text-sm font-medium text-yellow-300 block mb-2">
                      College Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your college name"
                      className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent placeholder-[#daa425]"
                      {...register("collegeName", {
                        required: "College name is required",
                      })}
                    />
                    {errors.collegeName && (
                      <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                        <Zap size={12} />
                        {errors.collegeName.message}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Branch & Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="transform hover:opacity-90 transition-transform duration-300">
                    <label className="text-sm font-medium text-yellow-300 block mb-2">
                      Branch <span className="text-red-400">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent"
                      {...register("branch", {
                        required: "Branch is required",
                      })}
                    >
                      <option value="">Select Branch</option>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="CSBS">CSBS</option>
                      <option value="CSE-DS">CSE-DS</option>
                      <option value="CSE-CyS">CSE-CyS</option>
                      <option value="AI&DS">AI&DS</option>
                      <option value="AIML">AIML</option>
                      <option value="IOT">IOT</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="EIE">EIE</option>
                      <option value="MECHANICAL">MECHANICAL</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="AUTOMOBILE">AUTOMOBILE</option>
                    </select>
                    {errors.branch && (
                      <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                        <Zap size={12} />
                        {errors.branch.message}
                      </p>
                    )}
                  </div>
                  <div className="transform hover:opacity-90 transition-transform duration-300">
                    <label className="text-sm font-medium text-yellow-300 block mb-2">
                      Section <span className="text-red-400">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent"
                      {...register("section", {
                        required: "Section is required",
                      })}
                    >
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                    {errors.section && (
                      <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                        <Zap size={12} />
                        {errors.section.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Roll Number & Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="transform hover:opacity-90 transition-transform duration-300">
                    <label className="text-sm font-medium text-yellow-300 block mb-2">
                      College ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter college ID"
                      className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent placeholder-[#daa425]"
                      {...register("collegeId", {
                        required: "College ID is required",
                      })}
                    />
                    {errors.rollno && (
                      <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                        <Zap size={12} />
                        {errors.rollno.message}
                      </p>
                    )}
                  </div>
                  <div className="transform hover:opacity-90 transition-transform duration-300">
                    <label className="text-sm font-medium text-yellow-300 block mb-2">
                      Year <span className="text-red-400">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent"
                      {...register("year", { required: "Year is required" })}
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                    {errors.year && (
                      <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                        <Zap size={12} />
                        {errors.year.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="transform hover:opacity-90 transition-transform duration-300">
                    <label className="text-sm font-medium text-yellow-300 block mb-2">
                      Contact Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent placeholder-[#daa425]"
                      {...register("phno", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Enter a valid 10-digit phone number",
                        },
                      })}
                    />
                    {errors.phno && (
                      <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                        <Zap size={12} />
                        {errors.phno.message}
                      </p>
                    )}
                  </div>
                  <div className="transform hover:opacity-90 transition-transform duration-300">
                    <label className="text-sm font-medium text-yellow-300 block mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent placeholder-[#daa425]"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                        <Zap size={12} />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {showPaymentFields && (
                  <motion.div
                    className="grid gap-4 md:gap-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Payment QR Code Section */}
                    <div className="transform hover:opacity-90 transition-transform duration-300">
                      <div className="group relative">
                        <label className="text-sm font-medium text-yellow-300 block mb-2">
                          Payment QR Code{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <div className="w-full p-4 bg-black/30 border border-[#daa425] rounded-md">
                          <div className="flex flex-col items-center space-y-3">
                            <h3 className="text-lg font-semibold text-yellow-300">
                              Scan QR Code to Pay ₹
                              {watchCollege === "VNRVJIET" ? "170" : "250"}
                            </h3>
                            <div className="bg-white rounded-xl p-3 shadow-lg">
                              <img
                                src={`/${
                                  watchCollege === "VNRVJIET"
                                    ? "VNRVJIETQR170"
                                    : "VNRVJIETQR250"
                                }.jpg`}
                                alt="Payment QR Code"
                                className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-lg"
                              />
                            </div>
                            <p className="text-sm text-yellow-300/80 text-center">
                              After payment, upload screenshot below and enter
                              transaction details
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="transform hover:opacity-90 transition-transform duration-300">
                      <div className="group relative">
                        <label className="text-sm font-medium text-yellow-300 block mb-2">
                          Payment Screenshot{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent
                       file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 
                       file:text-sm file:font-medium file:bg-[#f2ca46] file:text-black
                       hover:file:bg-[#daa425] file:cursor-pointer cursor-pointer"
                          />
                          {file && (
                            <p className="text-yellow-300/80 text-sm mt-1 flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                              File selected: {file.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {watchCollege && !showPaymentFields && (
                  <motion.div
                    className="text-center py-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow:
                          "0 20px 40px rgba(242, 202, 70, 0.3), 0 0 60px rgba(242, 202, 70, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowPaymentFields(true)}
                      className="group relative inline-flex items-center justify-center gap-4 px-4 py-1
                                  bg-gradient-to-r from-[#f2ca46] via-[#daa425] to-yellow-600
                                  text-black font-bold text-xl rounded-2xl shadow-xl
                                  transition-all duration-500 ease-out
                                  hover:shadow-2xl hover:shadow-[#f2ca46]/50
                                  focus:outline-none focus:ring-4 focus:ring-[#f2ca46]/60
                                  border-2 border-[#f2ca46]/30
                                  before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-300/20 before:to-transparent before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-300
                                  hover:before:opacity-100
                                  overflow-hidden"
                    >
                      {/* Text with gradient */}
                      <span className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent font-bold font-sans">
                        Pay ₹ {watchCollege === "VNRVJIET" ? "170" : "250"} /-
                      </span>

                      {/* Arrow with slide animation */}
                      <MoveRight />

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Payment Platform & Transaction ID - Only show after clicking pay button */}
                {showPaymentFields && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="transform hover:opacity-90 transition-transform duration-300">
                      <label className="text-sm font-medium text-yellow-300 block mb-2">
                        Payment Platform <span className="text-red-400">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent"
                        {...register("paymentplatform", {
                          required: showPaymentFields
                            ? "Please select a payment platform"
                            : false,
                        })}
                      >
                        <option value="">Select Payment Platform</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="Amazon Pay">Amazon Pay</option>
                        <option value="BHIM UPI">BHIM UPI</option>
                        <option value="FamPay">FamPay</option>
                        <option value="Mobikwik">Mobikwik</option>
                        <option value="WhatsApp Pay">WhatsApp Pay</option>
                        <option value="FreeCharge">FreeCharge</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.paymentplatform && (
                        <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                          <Zap size={12} />
                          {errors.paymentplatform.message}
                        </p>
                      )}
                    </div>
                    <div className="transform hover:opacity-90 transition-transform duration-300">
                      <label className="text-sm font-medium text-yellow-300 block mb-2">
                        Transaction ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter transaction ID"
                        className="w-full px-4 py-2 bg-black text-yellow-300 border border-[#daa425] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f2ca46] focus:border-transparent placeholder-[#daa425]"
                        {...register("transactionid", {
                          required: showPaymentFields
                            ? "Transaction ID is required"
                            : false,
                        })}
                      />
                      {errors.transactionid && (
                        <p className="text-red-400 text-sm mt-1 animate-bounce flex items-center gap-1">
                          <Zap size={12} />
                          {errors.transactionid.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Submit Button - Only show after payment fields are visible */}
                {showPaymentFields && (
                  <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="group relative inline-flex items-center justify-center gap-3 px-6 py-2 mb-2
        bg-gradient-to-r from-[#f2ca46] via-[#daa425] to-yellow-600
        text-black font-bold text-lg rounded-2xl shadow-md
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-[#daa425]/40
        focus:outline-none focus:ring-4 focus:ring-[#f2ca46]/50
        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="tracking-wide">
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </span>
                      <Send
                        size={18}
                        className={`transition-transform duration-300 ${
                          isSubmitting
                            ? "animate-pulse"
                            : "group-hover:translate-x-1"
                        }`}
                      />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const SubmittedComp = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      key="submitted"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={transitionVariants}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center bg-black text-yellow-300 px-4"
    >
      {/* Check Icon Container */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 10, delay: 0.2 }}
        className="bg-[#f2ca46] text-black p-4 rounded-full shadow-lg"
      >
        <CheckCircle size={50} />
      </motion.div>

      {/* Title */}
      <h2 className="text-3xl font-bold mt-6 text-yellow-200 drop-shadow-sm">
        Submission Successful!
      </h2>

      {/* Subtitle */}
      <p className="text-yellow-100 mt-2 text-sm sm:text-base max-w-md">
        Thank you for registering. You'll receive your pass through email within
        the next 24 hours.
      </p>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/technovista/events")}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full shadow-md 
          bg-gradient-to-r from-[#f2ca46] via-[#daa425] to-yellow-600 
          text-black hover:shadow-[#daa425]/30 transition-all duration-300"
      >
        <ExternalLink size={18} />
        Explore Events
      </motion.button>
    </motion.div>
  );
};

const LoadingComp = () => {
  return (
    <div className="flex flex-col items-center justify-center text-yellow-300 h-full min-h-screen">
      <motion.div
        className="relative bg-white/5 backdrop-blur-xl border h-full border-[#daa425]/30 shadow-[0_0_40px_rgba(255,255,255,0.05)] rounded-2xl p-10 min-w-[80%]  lg:w-full text-center flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* App Title */}
        <div className="flex items-center justify-center">
          <img
            src="/events/Technovista2025/tv25-icons/tv-logo-ani.gif"
            alt="TechnoVista 2k25 Logo"
            className="w-14 h-14 md:w-24 md:h-24 lg:w-24 lg:h-24 object-contain bg-white rounded-xl"
          />
        </div>

        {/* Subtext */}
        <motion.p
          variants={pulseVariants}
          animate="animate"
          className="mt-2 text-yellow-100 text-sm uppercase tracking-wider"
        >
          Powered by VJDQ
        </motion.p>

        {/* Loading Text */}
        <motion.p
          variants={pulseVariants}
          animate="animate"
          className="mt-6 text-yellow-200 font-medium text-base"
        >
          Loading, please wait...
        </motion.p>
      </motion.div>
    </div>
  );
};

const FormClosedComp = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[80vh] bg-black text-yellow-300 px-6"
    >
      {/* Glassy box */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-10 w-full max-w-md text-center border border-[#f2ca46]/20 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
        {/* Optional noise texture */}

        <Lock size={48} className="text-[#f2ca46] mx-auto mb-4" />

        <h2 className="text-2xl font-bold text-yellow-200 mb-2">
          Registration Closed
        </h2>

        <p className="text-yellow-100 mb-1">
          Thank you for your interest in our event!
        </p>
        <p className="text-yellow-100">
          Registration is no longer being accepted.
        </p>
      </div>
    </motion.div>
  );
};

const RegistrationForm = () => {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [formStatus, setFormStatus] = useState({
    isFormOpen: true,
  });

  return (
    <>
      <NavbarTv />
      <motion.div
        className="bg-black rounded-2xl shadow-2xl lg:border-2 border-[#daa425]/30 relative lg:h-[90vh]"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Scrollable content container */}
        <div
          className="relative z-10 h-full small-scrollbar overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loadingStatus ? (
            <LoadingComp />
          ) : !formStatus.isFormOpen ? (
            <FormClosedComp />
          ) : submitStatus ? (
            <SubmittedComp />
          ) : (
            <FormComp
              setLoadingStatus={setLoadingStatus}
              setSubmitStatus={setSubmitStatus}
            />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default RegistrationForm;
