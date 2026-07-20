import { useState } from 'react';
import { Mail, Phone, Clock, MessageSquare, Send, CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await axiosClient.post('/enquiries', {
        fullName: name,
        email: email,
        companyName: subject || 'Contact Support Enquiry',
        phone: 'N/A',
        productInterest: 'General Enquiry',
        quantity: 1,
        message: message
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      alert('Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 py-6 text-left max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Contact Support</h1>
        <p className="text-sm text-zinc-500">Have questions about your order or our products? Drop us a line below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        
        {/* Info Grid */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 space-y-6">
            <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wider">Contact Information</h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-zinc-450 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-bold text-zinc-800">Our Offices</p>
                  <div>
                    <span className="font-bold text-zinc-900 block text-[11px]">Delhi Office:</span>
                    <p className="text-zinc-500 leading-snug">109, Kushal House, Bazar 32-33, Nehru Place, New Delhi 110019</p>
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 block text-[11px]">Gurugram Office:</span>
                    <p className="text-zinc-500 leading-snug">Second floor, Plot No - 129P, Sector 39, Gurugram, Haryana 122003</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-zinc-450 shrink-0" />
                <div>
                  <p className="font-bold text-zinc-800">Email Desk</p>
                  <a href="mailto:support@iincept.com" className="text-zinc-500 hover:text-black hover:underline font-semibold">support@iincept.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-zinc-450 shrink-0" />
                <div>
                  <p className="font-bold text-zinc-800">Telephone Support</p>
                  <a href="tel:+919999999999" className="text-zinc-500 hover:text-black hover:underline font-semibold">+91 99999 99999</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-zinc-450 shrink-0" />
                <div>
                  <p className="font-bold text-zinc-800">Operational Hours</p>
                  <p className="text-zinc-550">Mon – Sat: 9:00 AM to 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 text-center space-y-2.5">
            <h3 className="font-bold text-zinc-850 text-sm">Need immediate assistance?</h3>
            <p className="text-xs text-zinc-500">Reach our product coordinators directly over WhatsApp chat.</p>
            <a 
              href="https://wa.me/919999999999" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-3 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="h-12 w-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-zinc-900">Message Dispatched</h3>
                <p className="text-xs text-zinc-500">We have received your ticket request. Support desk details will email you shortly.</p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-zinc-50 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <h2 className="text-base font-bold text-zinc-900 border-b border-zinc-150 pb-2">Send Us a Message</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-zinc-50 border border-zinc-200 text-xs rounded-xl p-3.5 text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-50 border border-zinc-200 text-xs rounded-xl p-3.5 text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is this regarding?"
                  className="w-full bg-zinc-50 border border-zinc-200 text-xs rounded-xl p-3.5 text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Message *</label>
                <textarea
                  required
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your request here..."
                  className="w-full bg-zinc-50 border border-zinc-200 text-xs rounded-xl p-3.5 text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-black hover:bg-zinc-900 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                Submit Ticket
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Map Section - Dual Locations */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm overflow-hidden space-y-5 animate-in fade-in duration-300">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-zinc-900">
          <MapPin className="h-5 w-5 text-zinc-800" />
          <h2 className="text-base font-bold uppercase tracking-wider">Our Locations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location 1: Delhi Office */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  Delhi Office (Nehru Place)
                </span>
                <span className="text-[10px] bg-zinc-100 text-zinc-600 font-semibold px-2 py-0.5 rounded-full">New Delhi</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 pl-5">109, Kushal House, Bazar 32-33, Nehru Place, New Delhi, Delhi 110019</p>
            </div>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-zinc-150 shadow-inner">
              <iframe 
                title="Delhi Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d670.7611981972549!2d77.2506581862361!3d28.549188132598193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce35554210a31%3A0xdd6ef47c87c2cb91!2sIINCEPT!5e0!3m2!1sen!2sin!4v1784097809983!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Location 2: Gurugram Office */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  Gurugram Office
                </span>
                <span className="text-[10px] bg-zinc-100 text-zinc-600 font-semibold px-2 py-0.5 rounded-full">Gurugram</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 pl-5">Second floor, Plot No - 129P, Sector 39, Gurugram, Haryana 122003</p>
            </div>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-zinc-150 shadow-inner">
              <iframe 
                title="Gurugram Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.1175521535197!2d77.04439237570371!3d28.445872592532222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d196ec57e0ff7%3A0x328aaa29f17e8a9b!2sIINCEPT!5e0!3m2!1sen!2sin!4v1784534311784!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
