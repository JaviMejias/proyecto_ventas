import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Vault, Plus, Eye, Banknote, CreditCard, Landmark, Printer, FileSpreadsheet } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { PageContainer } from '../components/ui/PageContainer';
import { Card } from '../components/ui/Card';
import { api } from '../services/api';
import { CashClose } from '../types';
import { Dialog, Toast } from '../utils/alerts';
import { formatMoney, formatDate } from '../utils/format';
import { reportsService } from '../services/reportsService';

export default function CashCloses() {
  const navigate = useNavigate();
  const [closes, setCloses] = useState<CashClose[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [selectedClose, setSelectedClose] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const rootStyles = getComputedStyle(document.documentElement);
      const primaryColorHex = rootStyles.getPropertyValue('--color-primary-500').trim() || '#F97316';
      
      await api.exportCashClosesExcel(primaryColorHex);
      Toast.fire({
        icon: 'success',
        title: 'Exportación exitosa',
        text: 'El archivo Excel se ha descargado',
      });
    } catch (err) {
      Dialog.fire({ icon: 'error', title: 'Error', text: 'No se pudo exportar los cierres' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleNewCloseClick = async () => {
    setIsVerifying(true);
    try {
      const previewData = await api.getCashClosePreview('global');
      if (previewData.totals.count === 0) {
        Dialog.fire({
          icon: 'info',
          title: 'Sistema sin ventas',
          text: 'Actualmente no existe ninguna venta abierta en todo el restaurante para hacer un cierre.',
        });
      } else {
        navigate('/cash_closes/new');
      }
    } catch (err) {
      Dialog.fire({ icon: 'error', title: 'Error', text: 'No se pudo verificar el estado de la caja.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const loadMoreCloses = async () => {
    try {
      const response = await api.getCashCloses(page);
      if (page === 1) {
        setCloses(response.data);
      } else {
        setCloses((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.meta.page < response.meta.pages);
      setPage((prev) => prev + 1);
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar los cierres' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setLoading(true);
    api.getCashCloses(1).then((response) => {
      setCloses(response.data);
      setHasMore(response.meta.page < response.meta.pages);
      setPage(2);
      setLoading(false);
    });
  }, []);

  const openCloseDetail = async (id: number) => {
    try {
      const data = await api.getCashClose(id);
      setSelectedClose(data);
      setIsModalOpen(true);
    } catch (err: any) {
      Dialog.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el detalle del cierre.',
      });
    }
  };

  return (
    <>
      <PageContainer
        title="Cierres de Caja"
        icon={<Vault size={24} />}
        action={
          <div className="flex gap-3">
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
            <Button onClick={handleNewCloseClick} isLoading={isVerifying} icon={<Plus size={20} />}>
              Nuevo Cierre
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
            dataLength={closes.length}
            next={loadMoreCloses}
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
            {closes.length === 0 ? (
              <EmptyState
                icon={<Vault size={32} />}
                title="Sin Cierres de Caja"
                description="Aún no se ha registrado ningún cierre de caja. Haz clic en 'Nuevo Cierre' para realizar el primero."
              />
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <AnimatePresence mode="popLayout">
                  {closes.map((close) => {
                    return (
                      <motion.div
                        key={close.id}
                        layout
                        initial={{ opacity: 1, scale: 1, y: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          hoverEffect
                          className="p-6 flex flex-col justify-between group transition-all duration-500 h-full hover:border-primary-500/40 relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary-500/10 to-transparent rounded-bl-[4rem] pointer-events-none transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6"></div>

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-5">
                              <div className="w-14 h-14 bg-primary-100/80 dark:bg-primary-500/20 text-primary-500 rounded-[1.25rem] flex items-center justify-center shadow-inner shadow-white/50 dark:shadow-none border border-white/50 dark:border-primary-500/20 group-hover:scale-110 transition-transform duration-500">
                                <Vault size={28} strokeWidth={2.5} />
                              </div>
                            </div>

                            <h3 className="text-2xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors truncate">
                              Cierre #{close.id}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="text-xs font-semibold text-primary-500 bg-primary-100 dark:bg-primary-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <CalendarCheck size={12} /> {formatDate(close.created_at || close.date)}
                              </span>
                              {close.user && (
                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md flex items-center gap-1">
                                  <Vault size={12} /> {close.user.first_name} {close.user.last_name}
                                </span>
                              )}
                              <span className="text-xs font-semibold text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <Banknote size={12} /> {formatMoney(close.total_cash)}
                              </span>
                              <span className="text-xs font-semibold text-blue-500 bg-blue-100 dark:bg-blue-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <CreditCard size={12} /> {formatMoney(close.total_card)}
                              </span>
                              <span className="text-xs font-semibold text-purple-500 bg-purple-100 dark:bg-purple-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <Landmark size={12} /> {formatMoney(close.total_transfer)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between relative z-10">
                            <span className="text-3xl font-extrabold tracking-tight text-primary-500">
                              {formatMoney(close.total_sales)}
                            </span>

                            <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 md:translate-x-4 group-hover:translate-x-0">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openCloseDetail(close.id)}
                                icon={<Eye size={18} />}
                              >
                                Detalles
                              </Button>
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
        title={`Detalle Cierre #${selectedClose?.id}`}
      >
        {selectedClose ? (
          <div className="space-y-6 mt-4">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Cajero</p>
                <p className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {selectedClose.user?.first_name} {selectedClose.user?.last_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Cierre</p>
                <p className="font-extrabold text-primary-500 text-2xl">
                  {formatMoney(selectedClose.total_sales)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Banknote size={14} /> Efectivo
                </span>
                <p className="font-bold text-lg text-emerald-800 dark:text-emerald-400 mt-1">
                  {formatMoney(selectedClose.total_cash)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <CreditCard size={14} /> Tarjeta
                </span>
                <p className="font-bold text-lg text-blue-800 dark:text-blue-400 mt-1">
                  {formatMoney(selectedClose.total_card)}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                  <Landmark size={14} /> Transf.
                </span>
                <p className="font-bold text-lg text-purple-800 dark:text-purple-400 mt-1">
                  {formatMoney(selectedClose.total_transfer)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Vault size={18} className="text-primary-500" /> Ventas Asociadas ({selectedClose.sells?.length || 0})
              </h4>
              {selectedClose.sells?.length === 0 ? (
                <p className="text-sm text-slate-500">No hay ventas registradas en este cierre.</p>
              ) : (
                <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {selectedClose.sells?.map((sell: any, index: number) => (
                    <motion.div
                      key={sell.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex justify-between items-center p-4 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-sm hover:border-primary-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            sell.payment_type === 'efectivo'
                              ? 'green'
                              : sell.payment_type === 'tarjeta'
                                ? 'blue'
                                : 'purple'
                          }
                        >
                          {sell.payment_type.substring(0, 3).toUpperCase()}
                        </Badge>
                        <span className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[150px] sm:max-w-[200px]">
                          {sell.client_name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {formatMoney(sell.total)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button 
                onClick={() => reportsService.generateCashClosePDF(selectedClose)} 
                icon={<Printer size={20} />} 
                className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-500/20 dark:text-primary-400 dark:hover:bg-primary-500/30 border-none"
              >
                Imprimir Comprobante (PDF)
              </Button>
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
