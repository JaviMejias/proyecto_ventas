import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Vault,
  Banknote,
  CreditCard,
  Landmark,
  CheckCircle,
  AlertTriangle,
  Info,
  Sigma,
  User,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/ui/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MoneyInput } from '../components/ui/MoneyInput';
import { EmptyState } from '../components/ui/EmptyState';
import { api } from '../services/api';
import { Toast, Dialog } from '../utils/alerts';
import { formatMoney } from '../utils/format';

export default function NewCashClose() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'personal' | 'global'>('personal');
  const [actualCash, setActualCash] = useState<string>('');
  const [actualCard, setActualCard] = useState<string>('');
  const [actualTransfer, setActualTransfer] = useState<string>('');

  const loadPreview = async (fetchMode: 'personal' | 'global') => {
    setLoading(true);
    try {
      const previewData = await api.getCashClosePreview(fetchMode);
      setData(previewData);
      
      // Limpiar inputs al cambiar de modo
      setActualCash('');
      setActualCard('');
      setActualTransfer('');
    } catch (err) {
      Dialog.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar la vista previa del cierre.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview(mode);
  }, [mode, navigate]);

  const sellsByPayment = useMemo(() => {
    if (!data) return { efectivo: [], tarjeta: [], transferencia: [] };
    const grouped = { efectivo: [], tarjeta: [], transferencia: [] } as Record<string, any[]>;
    data.sells.forEach((s: any) => {
      if (grouped[s.payment_type]) {
        grouped[s.payment_type].push(s);
      }
    });
    return grouped;
  }, [data]);

  const calculateDiff = (expected: number, actualStr: string) => {
    const actual = parseInt(actualStr.replace(/\./g, ''), 10) || 0;
    return actual - expected;
  };

  const getDiffColorStyles = (diff: number, isEmpty: boolean, type: 'cash' | 'card' | 'transfer' | 'total') => {
    if (isEmpty) {
      if (type === 'cash') return 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30';
      if (type === 'card') return 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/30';
      if (type === 'transfer') return 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200/50 dark:border-purple-800/30';
      return 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700';
    }
    if (diff === 0)
      return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50';
    if (diff > 0)
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50';
    return 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600 shadow-md shadow-red-500/10 ring-1 ring-red-500/50';
  };

  const renderDiffText = (diff: number, isEmpty: boolean) => {
    if (isEmpty) return <span className="text-slate-400 font-medium">Falta ingresar monto</span>;
    if (diff === 0)
      return (
        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 justify-end">
          <CheckCircle size={16} /> Cuadrado Perfecto ($0)
        </span>
      );
    if (diff > 0)
      return (
        <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 justify-end">
          <Info size={16} /> Sobrante (+{formatMoney(diff)})
        </span>
      );
    return (
      <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1 justify-end">
        <AlertTriangle size={16} /> Faltante ({formatMoney(diff)})
      </span>
    );
  };

  const handleCreateClose = async () => {
    try {
      await api.createCashClose(mode);
      Toast.fire({ icon: 'success', title: `Caja por ${formatMoney(data?.totals?.total_sales || 0)} cerrada exitosamente` });
      navigate('/cash_closes');
    } catch (err: any) {
      Dialog.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Error al cerrar la caja',
      });
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <div className="animate-spin mb-4">
          <Vault size={32} className="text-primary-500" />
        </div>
        <p className="text-slate-500">Cargando desglose...</p>
      </div>
    );
  if (!data) return null;

  const totalExpected = data.totals.total_sales;
  const totalActual =
    (parseInt(actualCash.replace(/\./g, ''), 10) || 0) +
    (parseInt(actualCard.replace(/\./g, ''), 10) || 0) +
    (parseInt(actualTransfer.replace(/\./g, ''), 10) || 0);
  const totalDiff = totalActual - totalExpected;
  const allFilled = actualCash !== '' && actualCard !== '' && actualTransfer !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer
        title="Desglose de Cuadratura"
        icon={<Vault size={24} />}
        backTo="/cash_closes"
        noCard={true}
      >
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex items-center shadow-inner border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setMode('personal')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${mode === 'personal' ? 'bg-white dark:bg-slate-700 shadow-md text-primary-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <User size={18} /> Cierre Personal
            </button>
            <button
              onClick={() => setMode('global')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${mode === 'global' ? 'bg-white dark:bg-slate-700 shadow-md text-primary-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Globe size={18} /> Cierre Global
            </button>
          </div>
        </div>

        {data.totals.count === 0 ? (
          <EmptyState
            icon={<Vault size={48} />}
            title="Sin Ventas Abiertas"
            description={
              mode === 'personal' 
                ? 'No tienes ninguna venta personal pendiente de cerrar. Si necesitas cerrar la caja de otro usuario, selecciona "Cierre Global" arriba.'
                : 'No hay ninguna venta abierta en todo el sistema. Todas las cajas están cerradas.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-7">
              <Card className="p-6 border-2 border-slate-200/60 dark:border-slate-700/60 shadow-xl space-y-8 h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 mb-2 border-b border-slate-200 dark:border-slate-700/50 pb-4 relative z-10">
                  Detalle de Ventas ({data.totals.count})
                </h2>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="font-extrabold flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-lg">
                <Banknote size={24} /> Ventas en Efectivo ({sellsByPayment.efectivo.length})
              </h3>
              {sellsByPayment.efectivo.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                  No hay ventas en efectivo.
                </p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {sellsByPayment.efectivo.map((s: any, idx: number) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex justify-between items-center p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-inner border border-emerald-200/50 dark:border-emerald-500/20">
                            <Banknote size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-base">{s.client_name}</p>
                            <p className="text-xs text-slate-500 max-w-[180px] sm:max-w-[250px] truncate">
                              {s.sell_materials.map((m: any) => `${m.quantity}x ${m.menu_item?.name}`).join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-lg text-emerald-600 dark:text-emerald-400">{formatMoney(s.total)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <div className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/20 dark:to-transparent rounded-2xl border border-emerald-200 dark:border-emerald-800/50 mt-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Total Efectivo</span>
                    <span className="font-black text-2xl text-emerald-600 dark:text-emerald-400">{formatMoney(data.totals.total_cash)}</span>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="font-extrabold flex items-center gap-2 text-blue-600 dark:text-blue-400 text-lg">
                <CreditCard size={24} /> Ventas con Tarjeta ({sellsByPayment.tarjeta.length})
              </h3>
              {sellsByPayment.tarjeta.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                  No hay ventas con tarjeta.
                </p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {sellsByPayment.tarjeta.map((s: any, idx: number) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex justify-between items-center p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-inner border border-blue-200/50 dark:border-blue-500/20">
                            <CreditCard size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-base">{s.client_name}</p>
                            <p className="text-xs text-slate-500 max-w-[180px] sm:max-w-[250px] truncate">
                              {s.sell_materials.map((m: any) => `${m.quantity}x ${m.menu_item?.name}`).join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-lg text-blue-600 dark:text-blue-400">{formatMoney(s.total)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-2xl border border-blue-200 dark:border-blue-800/50 mt-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Total Vouchers</span>
                    <span className="font-black text-2xl text-blue-600 dark:text-blue-400">{formatMoney(data.totals.total_card)}</span>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="font-extrabold flex items-center gap-2 text-purple-600 dark:text-purple-400 text-lg">
                <Landmark size={24} /> Ventas por Transferencia ({sellsByPayment.transferencia.length})
              </h3>
              {sellsByPayment.transferencia.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                  No hay ventas por transferencia.
                </p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {sellsByPayment.transferencia.map((s: any, idx: number) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex justify-between items-center p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-inner border border-purple-200/50 dark:border-purple-500/20">
                            <Landmark size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-base">{s.client_name}</p>
                            <p className="text-xs text-slate-500 max-w-[180px] sm:max-w-[250px] truncate">
                              {s.sell_materials.map((m: any) => `${m.quantity}x ${m.menu_item?.name}`).join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-lg text-purple-600 dark:text-purple-400">{formatMoney(s.total)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <div className="flex justify-between items-center p-5 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent rounded-2xl border border-purple-200 dark:border-purple-800/50 mt-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Total Transferencias</span>
                    <span className="font-black text-2xl text-purple-600 dark:text-purple-400">{formatMoney(data.totals.total_transfer)}</span>
                  </div>
                </div>
              )}
            </motion.div>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="p-6 sticky top-24 border-2 border-slate-200/60 dark:border-slate-700/60 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-500/10 transition-colors duration-500"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300 mb-2 flex items-center gap-2">
                  <Vault className="text-primary-500" /> Declaración de Caja
                </h2>

                <p className="text-sm text-slate-500 mb-6 font-medium">
                  Ingresa los montos físicos que contaste en caja y vouchers. Si un campo queda vacío,
                  se asume que no hay monto ingresado aún.
                </p>

                <div className="space-y-5">
                  <motion.div
                    layout
                    transition={{ duration: 0.3 }}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 ${getDiffColorStyles(calculateDiff(data.totals.total_cash, actualCash), actualCash === '', 'cash')}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                        <Banknote size={16} /> Efectivo Esperado
                      </span>
                      <span className="font-black text-xl text-slate-900 dark:text-white">
                        {formatMoney(data.totals.total_cash)}
                      </span>
                    </div>
                    <MoneyInput
                      label="Efectivo Contado Físicamente"
                      placeholder="Ej. 10.000"
                      value={actualCash}
                      onValueChange={setActualCash}
                    />
                    <div className="mt-3 text-right text-sm">
                      {renderDiffText(
                        calculateDiff(data.totals.total_cash, actualCash),
                        actualCash === '',
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    layout
                    transition={{ duration: 0.3 }}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 ${getDiffColorStyles(calculateDiff(data.totals.total_card, actualCard), actualCard === '', 'card')}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                        <CreditCard size={16} /> Vouchers Esperados
                      </span>
                      <span className="font-black text-xl text-slate-900 dark:text-white">
                        {formatMoney(data.totals.total_card)}
                      </span>
                    </div>
                    <MoneyInput
                      label="Suma de Vouchers Tarjeta"
                      placeholder="Ej. 5.000"
                      value={actualCard}
                      onValueChange={setActualCard}
                    />
                    <div className="mt-3 text-right text-sm">
                      {renderDiffText(
                        calculateDiff(data.totals.total_card, actualCard),
                        actualCard === '',
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    layout
                    transition={{ duration: 0.3 }}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 ${getDiffColorStyles(calculateDiff(data.totals.total_transfer, actualTransfer), actualTransfer === '', 'transfer')}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                        <Landmark size={16} /> Transferencias Esperadas
                      </span>
                      <span className="font-black text-xl text-slate-900 dark:text-white">
                        {formatMoney(data.totals.total_transfer)}
                      </span>
                    </div>
                    <MoneyInput
                      label="Suma en Banco Real"
                      placeholder="Ej. 8.500"
                      value={actualTransfer}
                      onValueChange={setActualTransfer}
                    />
                    <div className="mt-3 text-right text-sm">
                      {renderDiffText(
                        calculateDiff(data.totals.total_transfer, actualTransfer),
                        actualTransfer === '',
                      )}
                    </div>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {allFilled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      className={`mt-6 p-6 rounded-2xl border-2 shadow-lg relative overflow-hidden ${getDiffColorStyles(totalDiff, false, 'total')}`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                      <h3 className="text-xl font-black mb-5 flex items-center gap-2">
                        <Sigma /> Resumen General
                      </h3>
                      <div className="space-y-3 mb-5">
                        <div className="flex justify-between text-sm items-center">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">Total de Ventas Registradas</span>
                          <span className="font-black text-lg">{formatMoney(totalExpected)}</span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="font-semibold text-slate-600 dark:text-slate-400">Total Dinero Declarado</span>
                          <span className="font-black text-lg">{formatMoney(totalActual)}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t-2 border-black/10 dark:border-white/10 flex justify-between items-center">
                        <span className="font-black uppercase tracking-wider text-sm">Resultado:</span>
                        <span className="text-xl">{renderDiffText(totalDiff, false)}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 relative">
                  {allFilled && totalDiff === 0 && (
                     <div className="absolute inset-0 bg-green-400 blur-xl opacity-30 rounded-full animate-pulse pointer-events-none"></div>
                  )}
                  <Button
                    onClick={handleCreateClose}
                    className={`w-full h-16 text-lg font-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${allFilled && totalDiff === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none' : ''}`}
                    icon={<CheckCircle size={28} />}
                  >
                    {allFilled && totalDiff === 0 ? '¡Cuadre Perfecto! Guardar Cierre' : 'Guardar Cierre Definitivo'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
        )}
      </PageContainer>
    </motion.div>
  );
}
