
import React from 'react';
import { useForm } from 'react-hook-form';
import { CheckoutFormData } from '../types';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'First name is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tango-primary"
          />
          {errors.name && (
            <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="surname"
            type="text"
            {...register('surname', { required: 'Last name is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tango-primary"
          />
          {errors.surname && (
            <p className="mt-1 text-red-500 text-xs">{errors.surname.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tango-primary"
        />
        {errors.email && (
          <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone', { required: 'Phone number is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tango-primary"
        />
        {errors.phone && (
          <p className="mt-1 text-red-500 text-xs">{errors.phone.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          Gender (Optional)
        </label>
        <select
          id="gender"
          {...register('gender')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tango-primary"
        >
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="mt-6">
        <button 
          type="submit"
          className="tango-button w-full py-3 text-lg"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
