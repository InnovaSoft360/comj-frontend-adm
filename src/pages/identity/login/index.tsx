import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowRight, FaHome, FaUsers, FaFileAlt, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/components/ui/customAlert";

export default function Login() {
  const { login, isLoading } = useAuth();
  const { showAlert } = useAlert();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      showAlert('Login realizado com sucesso!', 'success');
    } catch (error: any) {
      showAlert(error.message, 'error');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Converte SEMPRE para minúsculas
    const emailValue = e.target.value.toLowerCase();
    
    setFormData({
      ...formData,
      email: emailValue
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      password: e.target.value
    });
  };

  const features = [
    {
      icon: <FaHome className="w-5 h-5" />,
      title: "Gestão de Unidades",
      description: "Controle completo das residências disponíveis"
    },
    {
      icon: <FaUsers className="w-5 h-5" />,
      title: "Candidaturas",
      description: "Processo seletivo organizado e transparente"
    },
    {
      icon: <FaFileAlt className="w-5 h-5" />,
      title: "Documentação",
      description: "Gestão centralizada de documentos"
    },
    {
      icon: <FaShieldAlt className="w-5 h-5" />,
      title: "Acesso Seguro",
      description: "Sistema protegido e confiável"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <img 
              src="/logo.png" 
              alt="Condomínio Osvaldo MJ" 
              className="w-8 h-8"
            />
          </div>
          <div className="text-center">
            <h1 className="font-bold text-xl">Osvaldo MJ</h1>
            <p className="text-orange-100 text-sm">Sistema de Candidatura</p>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Desktop Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="hidden lg:flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <img 
                    src="/logo.png" 
                    alt="Condomínio Osvaldo MJ" 
                    className="w-12 h-12"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-50 shadow-lg"></div>
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
              Acesso Restrito
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
              Sistema administrativo do Condomínio Osvaldo MJ
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field - SEMPRE MINÚSCULAS */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    required
                    disabled={isLoading}
                    placeholder="seu@email.com"
                    className="w-full pl-11 lg:pl-12 pr-4 py-3 lg:py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300 disabled:opacity-50 lowercase"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full pl-11 lg:pl-12 pr-11 lg:pr-12 py-3 lg:py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200 disabled:opacity-50"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4 lg:w-5 lg:h-5" /> : <FaEye className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 lg:py-4 px-6 rounded-xl lg:rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center text-sm lg:text-base">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 lg:mr-3"></div>
                      Autenticando...
                    </>
                  ) : (
                    <>
                      Acessar Sistema
                      <FaArrowRight className="ml-2 lg:ml-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                
                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-xs lg:text-sm text-blue-700 dark:text-blue-300 text-center">
                💡 <strong>Acesso Restrito:</strong> Apenas administradores autorizados
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 lg:mt-8">
            <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">
              Condomínio Osvaldo MJ • Sistema de Candidatura
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual (Desktop Only) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white p-12 max-w-2xl">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
              <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Condomínio Osvaldo MJ" 
                  className="w-10 h-10"
                />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Condomínio Osvaldo MJ
            </h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Sistema de gestão e candidatura de residências
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mt-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <div className="text-white mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/80 text-sm leading-tight">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Security Badge */}
          <div className="mt-12 pt-6 border-t border-white/20">
            <div className="flex items-center justify-center space-x-2 text-white/70">
              <FaShieldAlt className="w-4 h-4" />
              <span className="text-sm">Sistema seguro e restrito</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}