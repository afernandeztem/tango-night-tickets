
import React from 'react';
import { useForm } from 'react-hook-form';
import { CheckoutFormData } from '../types';
import { useApp } from '../context/AppContext';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
  const { state } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();
  
  const translations = {
    en: {
      personalDetails: 'Personal Details',
      name: 'Name',
      namePlaceholder: 'Enter your name',
      surname: 'Surname',
      surnamePlaceholder: 'Enter your surname',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      phone: 'Phone number',
      phonePlaceholder: 'Enter your phone number',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      preferNotSay: 'Prefer not to say',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      continue: 'Continue to Payment'
    },
    es: {
      personalDetails: 'Datos Personales',
      name: 'Nombre',
      namePlaceholder: 'Ingresa tu nombre',
      surname: 'Apellido',
      surnamePlaceholder: 'Ingresa tu apellido',
      email: 'Correo electrónico',
      emailPlaceholder: 'Ingresa tu correo electrónico',
      phone: 'Número de teléfono',
      phonePlaceholder: 'Ingresa tu número de teléfono',
      gender: 'Género',
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
      preferNotSay: 'Prefiero no decir',
      required: 'Este campo es obligatorio',
      invalidEmail: 'Por favor ingresa un correo electrónico válido',
      invalidPhone: 'Por favor ingresa un número de teléfono válido',
      continue: 'Continuar al Pago'
    }
  };
  
  const t = translations[state.language];
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">{t.personalDetails}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t.name} *
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary`}
              placeholder={t.namePlaceholder}
              {...register('name', { required: true })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-1">{t.required}</span>
            )}
          </div>
          
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
              {t.surname} *
            </label>
            <input
              id="surname"
              type="text"
              className={`w-full px-4 py-2 border ${errors.surname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary`}
              placeholder={t.surnamePlaceholder}
              {...register('surname', { required: true })}
            />
            {errors.surname && (
              <span className="text-red-500 text-sm mt-1">{t.required}</span>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t.email} *
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary`}
            placeholder={t.emailPlaceholder}
            {...register('email', { 
              required: true, 
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
            })}
          />
          {errors.email?.type === 'required' && (
            <span className="text-red-500 text-sm mt-1">{t.required}</span>
          )}
          {errors.email?.type === 'pattern' && (
            <span className="text-red-500 text-sm mt-1">{t.invalidEmail}</span>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t.phone} *
          </label>
          <input
            id="phone"
            type="tel"
            className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary`}
            placeholder={t.phonePlaceholder}
            {...register('phone', { 
              required: true,
              pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
            })}
          />
          {errors.phone?.type === 'required' && (
            <span className="text-red-500 text-sm mt-1">{t.required}</span>
          )}
          {errors.phone?.type === 'pattern' && (
            <span className="text-red-500 text-sm mt-1">{t.invalidPhone}</span>
          )}
        </div>
        
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            {t.gender}
          </label>
          <select
            id="gender"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary"
            {...register('gender')}
          >
            <option value="">{t.preferNotSay}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
            <option value="other">{t.other}</option>
          </select>
        </div>
      </div>
      
      <button type="submit" className="tango-button w-full py-3">
        {t.continue}
      </button>
    </form>
  );
};

export default CheckoutForm;
