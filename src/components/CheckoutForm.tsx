
import React from 'react';
import { useForm } from 'react-hook-form';
import { CheckoutFormData } from '../types';
import { useApp } from '../context/AppContext';
import './CheckoutForm.scss';

interface CheckoutFormProps {
  onSubmit?: (data: CheckoutFormData) => void;
  onChange?: (data: Partial<CheckoutFormData>) => void;
  data?: Partial<CheckoutFormData>;
  disabled?: boolean;
  buttonText?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onSubmit, 
  onChange,
  data = {},
  disabled = false,
  buttonText = 'Continue to Payment' 
}) => {
  const { state } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: data
  });
  
  const handleFormSubmit = (formData: CheckoutFormData) => {
    if (onSubmit) onSubmit(formData);
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: any) => {
    if (onChange) {
      onChange({ [field]: value });
    }
  };
  
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="checkout-form space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">{t.personalDetails}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="checkout-form__group">
            <label htmlFor="name" className="checkout-form__label block text-sm font-medium text-gray-700 mb-1">
              {t.name} *
            </label>
            <input
              id="name"
              type="text"
              className={`checkout-form__input w-full px-4 py-2 border ${errors.name ? 'checkout-form__input--error border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary`}
              placeholder={t.namePlaceholder}
              disabled={disabled}
              {...register('name', { required: true })}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {errors.name && (
              <span className="checkout-form__error text-red-500 text-sm mt-1">{t.required}</span>
            )}
          </div>
          
          <div className="checkout-form__group">
            <label htmlFor="surname" className="checkout-form__label block text-sm font-medium text-gray-700 mb-1">
              {t.surname} *
            </label>
            <input
              id="surname"
              type="text"
              className={`checkout-form__input w-full px-4 py-2 border ${errors.surname ? 'checkout-form__input--error border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary`}
              placeholder={t.surnamePlaceholder}
              disabled={disabled}
              {...register('surname', { required: true })}
              onChange={(e) => handleInputChange('surname', e.target.value)}
            />
            {errors.surname && (
              <span className="checkout-form__error text-red-500 text-sm mt-1">{t.required}</span>
            )}
          </div>
        </div>
        
        <div className="checkout-form__group mb-4">
          <label htmlFor="email" className="checkout-form__label block text-sm font-medium text-gray-700 mb-1">
            {t.email} *
          </label>
          <input
            id="email"
            type="email"
            className={`checkout-form__input w-full px-4 py-2 border ${errors.email ? 'checkout-form__input--error border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary`}
            placeholder={t.emailPlaceholder}
            disabled={disabled}
            {...register('email', { 
              required: true, 
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
            })}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          {errors.email?.type === 'required' && (
            <span className="checkout-form__error text-red-500 text-sm mt-1">{t.required}</span>
          )}
          {errors.email?.type === 'pattern' && (
            <span className="checkout-form__error text-red-500 text-sm mt-1">{t.invalidEmail}</span>
          )}
        </div>
        
        <div className="checkout-form__group mb-4">
          <label htmlFor="phone" className="checkout-form__label block text-sm font-medium text-gray-700 mb-1">
            {t.phone} *
          </label>
          <input
            id="phone"
            type="tel"
            className={`checkout-form__input w-full px-4 py-2 border ${errors.phone ? 'checkout-form__input--error border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary`}
            placeholder={t.phonePlaceholder}
            disabled={disabled}
            {...register('phone', { 
              required: true,
              pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
            })}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
          {errors.phone?.type === 'required' && (
            <span className="checkout-form__error text-red-500 text-sm mt-1">{t.required}</span>
          )}
          {errors.phone?.type === 'pattern' && (
            <span className="checkout-form__error text-red-500 text-sm mt-1">{t.invalidPhone}</span>
          )}
        </div>
        
        <div className="checkout-form__group">
          <label htmlFor="gender" className="checkout-form__label block text-sm font-medium text-gray-700 mb-1">
            {t.gender}
          </label>
          <select
            id="gender"
            className="checkout-form__input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-tango-primary"
            disabled={disabled}
            {...register('gender')}
            onChange={(e) => handleInputChange('gender', e.target.value)}
          >
            <option value="">{t.preferNotSay}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
            <option value="other">{t.other}</option>
          </select>
        </div>
      </div>
      
      {onSubmit && (
        <button type="submit" disabled={disabled} className="checkout-form__button tango-button w-full py-3">
          {buttonText || t.continue}
        </button>
      )}
    </form>
  );
};

export default CheckoutForm;
