"use client";

export default function Info() {
  return (
    <div
      className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white/70 dark:bg-[#040821]/70 backdrop-blur-md"
    >
      <h2 className="text-2xl font-semibold mb-4">Our Office</h2>
      <p className="mb-2">Office No 43/43A City Tower Chungi No 9</p>
      <p className="mb-2">Multan, Pakistan</p>
      <p className="mb-2">Email: contact@hashturn.com</p>
      <p className="mb-6">Phone: +92 3090483683</p>

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14159985.110944064!2d58.3476778!3d29.9498843!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6f0ff3ce54e16109%3A0x3e13868b8e8f0316!2sHashTurn!5e0!3m2!1sen!2s!4v1757925790983!5m2!1sen!2s"
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
