"use client";
import ContactHeading from "../contact/Heading";
import ContactInfo from "../contact/Info";
import ContactForm from "../contact/Form";

export default function ContactPageContent() {
  return (
    <>
      <div
        className="max-w-4xl mx-auto text-center"
      >
        <ContactHeading />
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </>
  );
}
