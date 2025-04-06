import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Eye, EyeOff, Apple, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../hooks/use-toast';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register: registerUser, loginWithGoogle, loginWithApple } = useAuth();
  const { state } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const translations = {
    en: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      confirmPassword: 'Confirm Password',
      switchToLogin: 'Already have an account? Login',
      switchToRegister: 'Don\'t have an account? Register',
      processing: 'Processing...',
      loginSuccess: 'Welcome back!',
      registerSuccess: 'Registration successful!',
      emailRequired: 'Email is required',
      invalidEmail: 'Please enter a valid email',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordsDontMatch: 'Passwords don\'t match',
      nameRequired: 'Name is required',
      orContinueWith: 'Or continue with',
      signInWithApple: 'Sign in with Apple',
      signInWithGoogle: 'Sign in with Google',
      socialLoginNotImplemented: 'Social login is not fully implemented yet'
    },
    es: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      email: 'Correo electrónico',
      password: 'Contraseña',
      name: 'Nombre completo',
      confirmPassword: 'Confirmar contraseña',
      switchToLogin: '¿Ya tienes una cuenta? Inicia sesión',
      switchToRegister: '¿No tienes una cuenta? Regístrate',
      processing: 'Procesando...',
      loginSuccess: '¡Bienvenido de nuevo!',
      registerSuccess: '¡Registro exitoso!',
      emailRequired: 'El correo electrónico es obligatorio',
      invalidEmail: 'Por favor, introduce un correo electrónico válido',
      passwordRequired: 'La contraseña es obligatoria',
      passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
      passwordsDontMatch: 'Las contraseñas no coinciden',
      nameRequired: 'El nombre es obligatorio',
      orContinueWith: 'O continuar con',
      signInWithApple: 'Iniciar sesión con Apple',
      signInWithGoogle: 'Iniciar sesión con Google',
      socialLoginNotImplemented: 'El inicio de sesión social aún no está completamente implementado'
    }
  };
  
  const t = translations[state.language];
  
  const loginSchema = z.object({
    email: z.string().email(t.invalidEmail).min(1, t.emailRequired),
    password: z.string().min(1, t.passwordRequired),
  });
  
  const registerSchema = z.object({
    name: z.string().min(1, t.nameRequired),
    email: z.string().email(t.invalidEmail).min(1, t.emailRequired),
    password: z.string().min(6, t.passwordMinLength),
    confirmPassword: z.string().min(1, t.passwordRequired),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t.passwordsDontMatch,
    path: ["confirmPassword"],
  });
  
  const {
    register: registerLoginField,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const {
    register: registerRegisterField,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  
  const onLoginSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      toast({
        title: t.loginSuccess,
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };
  
  const onRegisterSubmit = async (data: any) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      toast({
        title: t.registerSuccess,
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed",
        variant: "destructive",
      });
    }
  };
  
  const handleSocialLogin = async (provider: 'apple' | 'google') => {
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithApple();
      }
      navigate('/home');
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg border p-8"
          >
            <h1 className="text-2xl font-bold mb-6 text-center">
              {mode === 'login' ? t.login : t.register}
            </h1>
            
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.email}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      {...registerLoginField('email')}
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-tango-primary focus:border-tango-primary"
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{loginErrors.email.message?.toString()}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.password}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      {...registerLoginField('password')}
                      className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:ring-tango-primary focus:border-tango-primary"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{loginErrors.password.message?.toString()}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isLoginSubmitting}
                  className="w-full py-2 px-4 bg-tango-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tango-primary disabled:opacity-50"
                >
                  {isLoginSubmitting ? t.processing : t.login}
                </button>
                
                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-600">{t.orContinueWith}</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Apple size={20} className="mr-2" />
                    Apple
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                      />
                    </svg>
                    Google
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-sm text-tango-primary hover:underline"
                  >
                    {t.switchToRegister}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.name}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="register-name"
                      type="text"
                      {...registerRegisterField('name')}
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-tango-primary focus:border-tango-primary"
                    />
                  </div>
                  {registerErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.name.message?.toString()}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.email}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="register-email"
                      type="email"
                      {...registerRegisterField('email')}
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-tango-primary focus:border-tango-primary"
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.email.message?.toString()}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.password}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      {...registerRegisterField('password')}
                      className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:ring-tango-primary focus:border-tango-primary"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  {registerErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.password.message?.toString()}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="register-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      {...registerRegisterField('confirmPassword')}
                      className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-tango-primary focus:border-tango-primary"
                    />
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.confirmPassword.message?.toString()}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isRegisterSubmitting}
                  className="w-full py-2 px-4 bg-tango-primary text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tango-primary disabled:opacity-50"
                >
                  {isRegisterSubmitting ? t.processing : t.register}
                </button>
                
                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-600">{t.orContinueWith}</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Apple size={20} className="mr-2" />
                    Apple
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                      />
                    </svg>
                    Google
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-tango-primary hover:underline"
                  >
                    {t.switchToLogin}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
