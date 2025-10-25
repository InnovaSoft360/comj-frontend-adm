// src/components/modals/CreateUserModal.tsx
import { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaIdCard, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { useCreateUser } from '@/hooks/useCreateUser';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

export default function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const { isLoading, createUser } = useCreateUser();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bi: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Função para formatar nome (PRIMEIRA maiúscula, resto minúscula)
  const formatName = (name: string): string => {
    if (!name) return '';
    const cleaned = name.trim().replace(/\s+/g, '');
    if (cleaned.length > 0) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    }
    return cleaned;
  };

  // Handler para nome
  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    const withoutSpaces = value.replace(/\s+/g, '');
    const formatted = formatName(withoutSpaces);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  // Handler para email (sempre minúsculo)
  const handleEmailChange = (value: string) => {
    const cleaned = value.toLowerCase().trim();
    setFormData(prev => ({ ...prev, email: cleaned }));
  };

  // Validação do BI
  const validateBI = (bi: string): boolean => {
    const biRegex = /^[0-9]{9}[A-Z]{2}[0-9]{3}$/;
    return biRegex.test(bi);
  };

  // Handler inteligente para BI
  const handleBIInput = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const currentLength = cleaned.length;
    
    let formatted = '';
    
    if (currentLength <= 9) {
      formatted = cleaned.replace(/[^0-9]/g, '');
    } else if (currentLength <= 11) {
      const numbersPart = cleaned.slice(0, 9).replace(/[^0-9]/g, '');
      const lettersPart = cleaned.slice(9).replace(/[^A-Z]/g, '');
      formatted = numbersPart + lettersPart;
    } else {
      const numbersPart = cleaned.slice(0, 9).replace(/[^0-9]/g, '');
      const lettersPart = cleaned.slice(9, 11).replace(/[^A-Z]/g, '');
      const finalNumbers = cleaned.slice(11).replace(/[^0-9]/g, '');
      formatted = numbersPart + lettersPart + finalNumbers;
    }
    
    formatted = formatted.slice(0, 14);
    setFormData(prev => ({ ...prev, bi: formatted }));
  };

  // Placeholder dinâmico do BI
  const getBIPlaceholder = (bi: string): string => {
    const length = bi.length;
    
    if (length <= 9) {
      const filled = bi;
      const remaining = '0'.repeat(9 - length);
      const rest = 'XX000';
      return filled + remaining + rest;
    } else if (length <= 11) {
      const numbers = bi.slice(0, 9);
      const letters = bi.slice(9);
      const remainingLetters = 'X'.repeat(2 - letters.length);
      const finalNumbers = '000';
      return numbers + letters + remainingLetters + finalNumbers;
    } else {
      const numbers = bi.slice(0, 9);
      const letters = bi.slice(9, 11);
      const finalNumbers = bi.slice(11);
      const remainingNumbers = '0'.repeat(3 - finalNumbers.length);
      return numbers + letters + finalNumbers + remainingNumbers;
    }
  };

  // Validação de senha
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push("A senha deve ter pelo menos 6 caracteres");
    }
    if (password.length > 20) {
      errors.push("A senha não pode exceder 20 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("A senha deve conter pelo menos um número");
    }
    
    return { isValid: errors.length === 0, errors };
  };

  // Validação de nome
  const validateName = (name: string): boolean => {
    return name.length >= 2 && name.length <= 20;
  };

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Reset do formulário
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      bi: '',
      password: '',
      confirmPassword: ''
    });
  };

  // Handler de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!validateName(formData.firstName)) {
      alert('Nome deve ter entre 2 e 20 caracteres.');
      return;
    }

    if (!validateName(formData.lastName)) {
      alert('Sobrenome deve ter entre 2 e 20 caracteres.');
      return;
    }

    if (!validateEmail(formData.email)) {
      alert('Por favor, insira um email válido');
      return;
    }

    if (!validateBI(formData.bi)) {
      alert('BI deve seguir o formato: 9 números + 2 letras + 3 números (ex: 123456789LA098)');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      alert(passwordValidation.errors[0]);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Criar usuário
    const success = await createUser(formData);
    
    if (success) {
      resetForm();
      onUserCreated();
      onClose();
    }
  };

  // Fechar modal ao clicar no overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <FaUserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Criar Novo Usuário
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preencha os dados do novo usuário administrativo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleNameChange('firstName', e.target.value)}
                  onBlur={(e) => handleNameChange('firstName', e.target.value)}
                  onKeyDown={(e) => e.key === ' ' && e.preventDefault()}
                  disabled={isLoading}
                  placeholder="Ex: João"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                2-20 caracteres
              </p>
              {formData.firstName && !validateName(formData.firstName) && (
                <p className="text-xs text-red-600 mt-1">
                  Nome deve ter entre 2 e 20 caracteres
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sobrenome *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleNameChange('lastName', e.target.value)}
                  onBlur={(e) => handleNameChange('lastName', e.target.value)}
                  onKeyDown={(e) => e.key === ' ' && e.preventDefault()}
                  disabled={isLoading}
                  placeholder="Ex: Silva"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                2-20 caracteres
              </p>
              {formData.lastName && !validateName(formData.lastName) && (
                <p className="text-xs text-red-600 mt-1">
                  Sobrenome deve ter entre 2 e 20 caracteres
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-mail *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={(e) => handleEmailChange(e.target.value)}
                disabled={isLoading}
                placeholder="usuario@email.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50 lowercase"
              />
            </div>
            {formData.email && !validateEmail(formData.email) && (
              <p className="text-xs text-red-600 mt-1">
                Por favor, insira um email válido
              </p>
            )}
          </div>

          {/* BI Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número do BI *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={formData.bi}
                onChange={(e) => handleBIInput(e.target.value)}
                disabled={isLoading}
                placeholder={getBIPlaceholder(formData.bi)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50 uppercase font-mono tracking-wider"
                maxLength={14}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Formato: <span className="font-mono">000000000XX000</span>
              </p>
              {formData.bi.length > 0 && (
                <p className="text-xs font-medium">
                  {formData.bi.length}/14
                </p>
              )}
            </div>
            
            <div className="flex text-xs text-gray-400 mt-2 space-x-1">
              <span className={formData.bi.length >= 9 ? "text-green-600 font-medium" : ""}>
                9 números
              </span>
              <span>•</span>
              <span className={formData.bi.length >= 11 ? "text-green-600 font-medium" : ""}>
                2 letras
              </span>
              <span>•</span>
              <span className={formData.bi.length >= 14 ? "text-green-600 font-medium" : ""}>
                3 números
              </span>
            </div>
          </div>

          {/* Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  disabled={isLoading}
                  placeholder="Sua senha"
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">6-20 caracteres, maiúscula, minúscula e número</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Senha *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  disabled={isLoading}
                  placeholder="Confirme sua senha"
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Criando...</span>
                </div>
              ) : (
                'Criar Usuário'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}