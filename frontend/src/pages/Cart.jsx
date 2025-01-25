import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useContextauth } from '../hooks/useContextauth';
import { Link } from 'react-router-dom';
import { IoAdd } from 'react-icons/io5';

function Cart() {
  const { user } = useContextauth();
  const [info, setInfo] = useState({
    senderEmail: '',
    senderPassword: '',
    recipientEmail: '',
    name: '',
    description: '',
    category: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (info.category) {
      info.category = info.category.charAt(0).toUpperCase() + info.category.slice(1);
    }

    const emailData = {
      from: info.senderEmail, // Sender's email
      password: info.senderPassword, // Sender's email password
      to: info.recipientEmail, // Recipient's email
      subject: info.name, // Subject
      description: info.description, // Email body
    };

    try {
      const response = await fetch('http://localhost:8000/api/send-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        toast.success('Email sent successfully!');
        setInfo({
          senderEmail: '',
          senderPassword: '',
          recipientEmail: '',
          name: '',
          description: '',
          category: '',
        });
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto p-4 rounded-xl bg-gray-800 border border-gray-900 my-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-xl font-bold text-emerald-400 mb-3">Envoyer un message</div>
      <form onSubmit={handleSubmit}>
        <div className="w-full">
          <label className="block text-slate-300 mb-1" htmlFor="senderEmail">Votre Email</label>
          <input
            type="email"
            className="input input-bordered w-full bg-gray-700"
            placeholder="Votre Email"
            required
            value={info.senderEmail}
            onChange={(e) => setInfo({ ...info, senderEmail: e.target.value })}
          />
        </div>

        <div className="w-full mt-3">
          <label className="block text-slate-300 mb-1" htmlFor="senderPassword">Mot de passe</label>
          <input
            type="password"
            className="input input-bordered w-full bg-gray-700"
            placeholder="Mot de passe"
            required
            value={info.senderPassword}
            onChange={(e) => setInfo({ ...info, senderPassword: e.target.value })}
          />
        </div>

        <div className="w-full mt-3">
          <label className="block text-slate-300 mb-1" htmlFor="recipientEmail">Destinataire</label>
          <input
            type="email"
            className="input input-bordered w-full bg-gray-700"
            placeholder="Email du destinataire"
            required
            value={info.recipientEmail}
            onChange={(e) => setInfo({ ...info, recipientEmail: e.target.value })}
          />
        </div>

        <div className="w-full mt-3">
          <label className="block text-slate-300 mb-1" htmlFor="name">Objet</label>
          <input
            type="text"
            className="input input-bordered w-full bg-gray-700"
            placeholder="Objet"
            required
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
          />
        </div>

        <label className="block text-slate-300 mb-1 mt-3" htmlFor="description">Description</label>
        <textarea
          className="textarea w-full bg-gray-700"
          placeholder="Description"
          value={info.description}
          onChange={(e) => setInfo({ ...info, description: e.target.value })}
        ></textarea>

        <label className="block text-slate-300 mb-1 mt-3" htmlFor="category">Niveau de risque</label>
        <select
          name="category"
          className="select select-bordered bg-gray-700 w-full"
          required
          value={info.category}
          onChange={(e) => setInfo({ ...info, category: e.target.value })}
        >
          <option value="" defaultValue={"Select a category"}>Select a category</option>
          <option value="Haut risque">Haut risque</option>
          <option value="Risque moyen">Risque moyen</option>
          <option value="Faible risque">Faible risque</option>
        </select>

        <div className="p-1"></div>
        <button
          className="btn w-full bg-emerald-600 text-white hover:bg-emerald-800 transition-colors duration-200 ease-in-out"
        >
          <IoAdd className="text-2xl font-bold" />
          Envoyer
        </button>
      </form>
    </motion.div>
  );
}

export default Cart;
