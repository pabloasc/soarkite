const ContactForm = () => {
  return (
    <form action="mailto:team@soarkite.com" method="post" encType="text/plain" className="max-w-xl mx-auto">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea 
            id="message" 
            name="message" 
            rows={4} 
            required 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition-colors"
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;