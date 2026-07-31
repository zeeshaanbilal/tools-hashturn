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
      return;
    }
    setIsLoading(true);
    try{
      // ... API call
    }catch(error:any){
      console.error("Error submitting form:", error);
    }finally{
      setIsLoading(false);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <form
      className="p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-[#11131e] relative overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 blur-2xl"></div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Send us a Message</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Message</label>
          <textarea
            rows={5}
            placeholder="How can we help you today?"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white resize-none"
          ></textarea>
        </div>
        <Button
          variant="primary"
          size="lg"
          type="submit"
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${canSubmit ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
          disabled={!canSubmit}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
