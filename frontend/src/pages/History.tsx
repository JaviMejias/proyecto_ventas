import { useState, useEffect } from 'react';
import { CreditCard, Banknote, Landmark, Vault, CircleOff, Eye, FileText, FileSpreadsheet, Clock, ChefHat, CheckCircle, PackageCheck } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { PageContainer } from '../components/ui/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Sell } from '../types';
import { Dialog, Toast } from '../utils/alerts';
import { formatMoney, formatDate } from '../utils/format';
import { consumer } from '../services/cable';

const STATUS_CONFIG = {
  recibido: { label: 'Recibido', color: 'gray', icon: Clock },
  en_proceso: { label: 'En Proceso', color: 'orange', icon: ChefHat },
  listo: { label: 'Listo', color: 'green', icon: CheckCircle },
  entregado: { label: 'Entregado', color: 'blue', icon: PackageCheck },
};

type FilterType = 'pendientes' | 'listos' | 'entregados' | 'todos';

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    // Classic "ding" sound
    oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    oscillator.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.warn("Audio no soportado o bloqueado por el navegador", e);
  }
};

export default function History() {
  const [sells, setSells] = useState<Sell[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [selectedSell, setSelectedSell] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filter, setFilter] = useState<FilterType>('pendientes');

  useEffect(() => {
    const subscription = consumer.subscriptions.create('SellsChannel', {
      received(data: any) {
        if (!data.sell) return;
        const incomingSell = data.sell;
        setSells((prev) => {
          const exists = prev.find((s) => s.id === incomingSell.id);
          if (exists) {
            return prev.map((s) => (s.id === incomingSell.id ? incomingSell : s));
          } else {
            // Nuevo pedido
            playNotificationSound();
            Toast.fire({
              icon: 'info',
              title: '¡Nuevo Pedido!',
              text: `Ingresó un pedido de ${incomingSell.client_name}`,
            });
            return [incomingSell, ...prev];
          }
        });
        
        // Also update modal if the selected sell changed
        setSelectedSell((prevSelected: any) => {
          if (prevSelected && prevSelected.id === incomingSell.id) {
            return incomingSell;
          }
          return prevSelected;
        });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      // Obtener el color primario actual (HEX) desde la variable CSS
      const rootStyles = getComputedStyle(document.documentElement);
      const primaryColorHex = rootStyles.getPropertyValue('--color-primary-500').trim() || '#F97316';
      
      await api.exportSalesExcel(primaryColorHex);
      Toast.fire({
        icon: 'success',
        title: 'Exportación exitosa',
        text: 'El archivo Excel se ha descargado',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const loadMoreSells = async () => {
    try {
      const response = await api.getSells(page);
      if (page === 1) {
        setSells(response.data);
      } else {
        setSells((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.meta.page < response.meta.pages);
      setPage((prev) => prev + 1);
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el historial' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setLoading(true);
    api.getSells(1).then((response) => {
      setSells(response.data);
      setHasMore(response.meta.page < response.meta.pages);
      setPage(2);
      setLoading(false);
    });
  }, []);

  const openSellDetail = async (id: number) => {
    try {
      const data = await api.getSell(id);
      setSelectedSell(data);
      setIsModalOpen(true);
    } catch (err: any) {
      Dialog.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el detalle de la venta.',
      });
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await api.updateSellStatus(id, newStatus);
      // We don't necessarily need to update state manually here if ActionCable does it,
      // but doing it makes the UI feel instantly responsive.
      const updatedSells = sells.map((s) => (s.id === id ? { ...s, status: newStatus as any } : s));
      setSells(updatedSells);
      if (selectedSell && selectedSell.id === id) {
        setSelectedSell({ ...selectedSell, status: newStatus });
      }
      Toast.fire({ icon: 'success', title: 'Estado actualizado' });
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el estado' });
    }
  };

  const filteredSells = sells.filter((sell) => {
    const s = sell.status || 'recibido';
    if (filter === 'pendientes') return s === 'recibido' || s === 'en_proceso';
    if (filter === 'listos') return s === 'listo';
    if (filter === 'entregados') return s === 'entregado';
    return true; // todos
  }).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    
    // Para la cocina (pendientes o listos), mostramos los más antiguos primero (FIFO)
    if (filter === 'pendientes' || filter === 'listos') {
      return dateA - dateB;
    }
    // Para el historial general, mostramos los más recientes primero
    return dateB - dateA;
  });

  return (
    <>
      <PageContainer 
        title="Historial de Ventas" 
        icon={<FileText size={24} />}
        action={
          <div className="flex gap-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm flex text-sm">
              <button
                onClick={() => setFilter('pendientes')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === 'pendientes' ? 'bg-primary-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Cocina
              </button>
              <button
                onClick={() => setFilter('listos')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === 'listos' ? 'bg-green-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Por Entregar
              </button>
              <button
                onClick={() => setFilter('todos')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${filter === 'todos' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Todos
              </button>
            </div>
            <Button 
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
              className="gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md"
            >
              <FileSpreadsheet className="w-5 h-5 text-orange-500" />
              <span className="hidden sm:inline font-semibold">
                {isExporting ? 'Exportando...' : 'Exportar Excel'}
              </span>
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-56 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={filteredSells.length}
            next={loadMoreSells}
            hasMore={hasMore}
            style={{ overflow: 'visible' }}
            loader={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-56 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            }
          >
            {filteredSells.length === 0 ? (
              <EmptyState
                icon={<Banknote size={32} />}
                title="Sin Ventas"
                description="No hay pedidos que mostrar con el filtro actual."
              />
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <AnimatePresence mode="popLayout">
                  {filteredSells.map((sell) => {
                    const isCash = sell.payment_type === 'efectivo';
                    const isCard = sell.payment_type === 'tarjeta';
                    
                    const colors = isCash ? {
                      bg: 'bg-emerald-100/80 dark:bg-emerald-500/20',
                      text: 'text-emerald-500',
                      textHover: 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400',
                      borderHover: 'hover:border-emerald-500/40',
                      borderIcon: 'border-white/50 dark:border-emerald-500/20',
                      gradient: 'from-emerald-500/10',
                      btnBg: 'hover:bg-emerald-500 hover:shadow-emerald-500/30',
                      totalText: 'text-emerald-500',
                      badge: 'green' as any,
                      cardShadow: 'hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/30'
                    } : isCard ? {
                      bg: 'bg-blue-100/80 dark:bg-blue-500/20',
                      text: 'text-blue-500',
                      textHover: 'group-hover:text-blue-500 dark:group-hover:text-blue-400',
                      borderHover: 'hover:border-blue-500/40',
                      borderIcon: 'border-white/50 dark:border-blue-500/20',
                      gradient: 'from-blue-500/10',
                      btnBg: 'hover:bg-blue-500 hover:shadow-blue-500/30',
                      totalText: 'text-blue-500',
                      badge: 'blue' as any,
                      cardShadow: 'hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30'
                    } : {
                      bg: 'bg-purple-100/80 dark:bg-purple-500/20',
                      text: 'text-purple-500',
                      textHover: 'group-hover:text-purple-500 dark:group-hover:text-purple-400',
                      borderHover: 'hover:border-purple-500/40',
                      borderIcon: 'border-white/50 dark:border-purple-500/20',
                      gradient: 'from-purple-500/10',
                      btnBg: 'hover:bg-purple-500 hover:shadow-purple-500/30',
                      totalText: 'text-purple-500',
                      badge: 'purple' as any,
                      cardShadow: 'hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30'
                    };

                    const Icon = isCash ? Banknote : isCard ? CreditCard : Landmark;

                    return (
                      <motion.div
                        key={sell.id}
                        layout
                        initial={{ opacity: 1, scale: 1, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          hoverEffect
                          hoverShadowClass={colors.cardShadow}
                          className={`p-6 flex flex-col justify-between group transition-all duration-500 h-full ${colors.borderHover} relative overflow-hidden`}
                        >
                          <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${colors.gradient} to-transparent rounded-bl-[4rem] pointer-events-none transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6`}></div>

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-5">
                              <div className={`w-14 h-14 ${colors.bg} ${colors.text} rounded-[1.25rem] flex items-center justify-center shadow-inner shadow-white/50 dark:shadow-none border ${colors.borderIcon} group-hover:scale-110 transition-transform duration-500`}>
                                <Icon size={28} strokeWidth={2.5} />
                              </div>
                              <div className="text-right">
                                <Badge variant={colors.badge}>
                                  {sell.payment_type}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              {(() => {
                                const currentStatus = sell.status || 'recibido';
                                const config = STATUS_CONFIG[currentStatus];
                                const StatusIcon = config.icon;
                                return (
                                  <Badge variant={config.color as any} icon={<StatusIcon size={12} />}>
                                    {config.label}
                                  </Badge>
                                );
                              })()}
                            </div>

                            <h3 className={`text-2xl font-extrabold tracking-tight mb-3 transition-colors text-slate-900 dark:text-white ${colors.textHover} truncate`} title={sell.client_name}>
                              {sell.client_name}
                            </h3>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                {sell.created_at ? formatDate(sell.created_at) : 'N/A'}
                              </span>
                              {sell.cash_close ? (
                                <Badge variant="gray" icon={<Vault size={12} />}>
                                  Cierre #{sell.cash_close.id}
                                </Badge>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium px-2.5 py-1">
                                  <CircleOff size={12} /> Abierta
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between relative z-10">
                            <span className={`text-3xl font-extrabold tracking-tight ${colors.totalText}`}>
                              {formatMoney(sell.total)}
                            </span>
                            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 md:translate-x-4 group-hover:translate-x-0">
                              <button
                                onClick={() => openSellDetail(sell.id)}
                                className={`p-3 text-slate-400 hover:text-white ${colors.btnBg} transition-all bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm hover:-translate-y-1`}
                                title="Ver Detalle"
                              >
                                <Eye size={18} />
                              </button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </InfiniteScroll>
        )}
      </PageContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Detalle de Venta #${selectedSell?.id}`}
      >
        {selectedSell ? (
          <div className="space-y-6 mt-4">
            <div className="flex justify-between items-center mb-2">
              {(() => {
                const currentStatus = selectedSell.status || 'recibido';
                const config = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG];
                const StatusIcon = config.icon;
                return (
                  <Badge variant={config.color as any} icon={<StatusIcon size={14} />} className="text-sm px-3 py-1.5">
                    Estado: {config.label}
                  </Badge>
                );
              })()}
              <div className="flex gap-2">
                {(!selectedSell.status || selectedSell.status === 'recibido') && (
                  <Button size="sm" onClick={() => handleUpdateStatus(selectedSell.id, 'en_proceso')} className="bg-orange-500 hover:bg-orange-600 shadow-orange-500/30">
                    Pasar a Preparación
                  </Button>
                )}
                {selectedSell.status === 'en_proceso' && (
                  <Button size="sm" onClick={() => handleUpdateStatus(selectedSell.id, 'listo')} className="bg-green-500 hover:bg-green-600 shadow-green-500/30">
                    Marcar Listo
                  </Button>
                )}
                {selectedSell.status === 'listo' && (
                  <Button size="sm" onClick={() => handleUpdateStatus(selectedSell.id, 'entregado')} className="bg-blue-500 hover:bg-blue-600 shadow-blue-500/30">
                    Entregar Cliente
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Cliente</p>
                <p className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {selectedSell.client_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Cobrado</p>
                <p className="font-extrabold text-primary-500 text-2xl">
                  {formatMoney(selectedSell.total)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={18} className="text-primary-500" /> Resumen de Productos
              </h4>
              <ul className="space-y-3">
                {selectedSell.sell_materials?.map((mat: any) => (
                  <li
                    key={mat.id}
                    className="p-4 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-sm hover:border-primary-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start font-bold text-slate-900 dark:text-white">
                      <div className="flex gap-3">
                        <span className="text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-lg text-sm">
                          {mat.quantity}x
                        </span>
                        <span>{mat.menu_item?.name || 'Producto Eliminado'}</span>
                      </div>
                      <span className="text-slate-600 dark:text-slate-300">{formatMoney(mat.total)}</span>
                    </div>
                    {mat.addons && mat.addons.length > 0 && (
                      <div className="mt-3 pl-11 text-sm text-slate-500 dark:text-slate-400 flex flex-wrap gap-2">
                        {mat.addons.map((a: any) => (
                          <span key={a.id} className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-xs font-medium">
                            + {a.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Cargando detalles...</p>
          </div>
        )}
      </Modal>
    </>
  );
}
