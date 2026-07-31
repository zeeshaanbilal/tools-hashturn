"use client";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Info() {
  return (
    <div
      className="p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-[#11131e] relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 blur-2xl"></div>
      
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Our Office</h2>
      
      <div className="space-y-6 flex-grow">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Address</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Office No 43/43A City Tower Chungi No 9<br/>Multan, Pakistan</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Email Us</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">contact@hashturn.com</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
            <Phone size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Call Us</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">+92 309 0483683</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm relative group">
        <div className="absolute inset-0 bg-primary/20 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14159985.110944064!2d58.3476778!3d29.9498843!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6f0ff3ce54e16109%3A0x3e13868b8e8f0316!2sHashTurn!5e0!3m2!1sen!2s!4v1757925790983!5m2!1sen!2s"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale group-hover:grayscale-0 transition-all duration-500"
        ></iframe>
      </div>
    </div>
  );
}
