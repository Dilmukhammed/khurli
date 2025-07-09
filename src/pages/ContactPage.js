import React from 'react';

// Placeholder for language context - using localStorage for now
// import { useLanguage } from '../contexts/LanguageContext';

const ContactPage = () => {
  // Local state for language. Later, this will come from a global context.
  const language = localStorage.getItem('logiclingua-lang') || 'en';

  // In a real app, this would be in a dedicated i18n file.
  const translations = {
    ru: {
      title: "Свяжитесь с нами",
      intro: "Если у вас есть какие-либо вопросы, предложения или вы просто хотите поздороваться, пожалуйста, свяжитесь с нами.",
      emailPrompt: "Вы можете написать нам по адресу:",
      email: "support@logiclingua.com",
      formTitle: "Или отправьте нам сообщение прямо сейчас:",
      namePlaceholder: "Ваше имя",
      emailPlaceholder: "Ваш email",
      messagePlaceholder: "Ваше сообщение",
      sendMessageButton: "Отправить сообщение",
    },
    en: {
      title: "Contact Us",
      intro: "If you have any questions, suggestions, or just want to say hello, please feel free to reach out.",
      emailPrompt: "You can email us at:",
      email: "support@logiclingua.com",
      formTitle: "Or send us a message right now:",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Your Email",
      messagePlaceholder: "Your Message",
      sendMessageButton: "Send Message",
    }
  };

  const t = translations[language];

  // Basic form submission handler (does not actually send data)
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent (not really, this is a placeholder)!");
    // Here you would typically handle form submission, e.g., send data to a backend
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section id="contact-header" className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.intro}</p>
      </section>

      <section id="contact-info" className="mb-12 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.emailPrompt}</h2>
        <p className="text-indigo-600 hover:text-indigo-800 text-lg">
          <a href={`mailto:${t.email}`}>{t.email}</a>
        </p>
        {/* Add other contact info like phone or address here if needed */}
      </section>

      <section id="contact-form-section" className="bg-gray-50 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">{t.formTitle}</h2>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">{t.namePlaceholder}</label>
            <input
              type="text"
              id="name"
              name="name"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
              placeholder={t.namePlaceholder}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">{t.emailPlaceholder}</label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
              placeholder={t.emailPlaceholder}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">{t.messagePlaceholder}</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
              placeholder={t.messagePlaceholder}
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              {t.sendMessageButton}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ContactPage;
