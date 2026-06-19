import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Loader2, AlertCircle, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success('Cuenta creada exitosamente');
      navigate('/');
    } catch (error: any) {
      try {
        const parsed = JSON.parse(error.message);
        setErrors(parsed);
      } catch {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[80vh] py-8 relative">
      {/* Dynamic Background Orbs */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 15, 0], scale: [1, 1.05, 1] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 25, 0], x: [0, -20, 0], scale: [1, 1.1, 1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-3xl rounded-[2rem] shadow-2xl shadow-primary-500/10 dark:shadow-black/50 p-10 border border-white dark:border-slate-700/50 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <UserPlus size={32} color="white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Crea tu cuenta</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Comienza a gestionar tu negocio de inmediato</p>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-xl">
            <h4 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
              <AlertCircle size={18} /> Error al registrar
            </h4>
            <ul className="list-disc list-inside text-sm text-red-500 dark:text-red-300 space-y-1">
              {Object.entries(errors).map(([field, msgs]) =>
                msgs.map((msg, i) => (
                  <li key={`${field}-${i}`}>
                    <span className="capitalize">{field}</span> {msg}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileTap={{ scale: 0.995 }} className="relative group">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500/60 group-focus-within:text-primary-500 group-focus-within:scale-110 transition-all duration-300">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Ej. Juan"
                  className="w-full pl-11 pr-5 py-4 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </motion.div>
            <motion.div whileTap={{ scale: 0.995 }} className="relative group">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Apellido</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500/60 group-focus-within:text-primary-500 group-focus-within:scale-110 transition-all duration-300">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Ej. Pérez"
                  className="w-full pl-11 pr-5 py-4 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </motion.div>
          </div>

          <motion.div whileTap={{ scale: 0.995 }} className="relative group">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500/60 group-focus-within:text-primary-500 group-focus-within:scale-110 transition-all duration-300">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@ejemplo.com"
                className="w-full pl-11 pr-5 py-4 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </motion.div>

          <motion.div whileTap={{ scale: 0.995 }} className="relative group">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500/60 group-focus-within:text-primary-500 group-focus-within:scale-110 transition-all duration-300">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-4 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary-500 transition-colors"
                tabIndex={-1}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={showPassword ? "open" : "closed"}
                    initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
                    transition={{ duration: 0.15 }}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </motion.div>

          <motion.div whileTap={{ scale: 0.995 }} className="relative group">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Confirmar Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500/60 group-focus-within:text-primary-500 group-focus-within:scale-110 transition-all duration-300">
                <Lock size={20} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-4 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary-500 transition-colors"
                tabIndex={-1}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={showConfirmPassword ? "open" : "closed"}
                    initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
                    transition={{ duration: 0.15 }}
                  >
                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </motion.div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 cursor-pointer text-lg tracking-wide flex justify-center items-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Registrarse'}
            </button>
          </div>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50 text-sm font-medium flex flex-col gap-3">
          <Link to="/login" className="text-primary-500 hover:text-primary-600 transition-colors">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </motion.div>
    </div>
  );
}
