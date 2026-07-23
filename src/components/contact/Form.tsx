"use client";

// import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import Button from "../ui/Button";
// import { handleContactForm } from "@/lib/send-mail";
// import { toast } from 'react-toastify';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);

  const emailIsValid = useMemo(() => {
    if (!formData.email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  }, [formData.email]);

  const canSubmit = useMemo(() => {
    return (
      formData.name.trim().length > 1 &&
      emailIsValid &&
      formData.message.trim().length > 5 &&
      !isLoading
    );
  }, [formData.name, emailIsValid, formData.message, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) {
      // if (!formData.name.trim()) toast.error("Please enter your name");
      // else if (!emailIsValid) toast.error("Please enter a valid email");
      // else if (formData.message.trim().length <= 5) toast.error("Message must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try{
      // await handleContactForm({
      //   name: formData.name,
      //   email: formData.email,
      //   message: formData.message,
      // });
      // toast.success("Mail sent successfully");
    }catch(error:any){
      console.error("Error submitting form:", error);
      const message = error?.message || "Failed to send message. Please try again.";
      // toast.error(message);
    }finally{
      setIsLoading(false);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }
  };

  return (
    <form
      className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white/70 dark:bg-[#040821]/70 backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          rows={4}
          placeholder="Your Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <Button
          variant="primary"
          size="lg"
          type="submit"
          className={`w-full bg-gradient-to-r from-[#CD1C18] to-[#66023C] py-3 px-6 rounded-lg font-semibold text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 ${canSubmit ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
          disabled={!canSubmit}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
