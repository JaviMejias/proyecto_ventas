import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Receipt,
  Save,
  ShoppingCart,
  Banknote,
  CreditCard,
  Landmark,
  Utensils,
  X,
  User,
  Coffee,
  Hash,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';

import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { api } from '../services/api';
import { Toast, Dialog } from '../utils/alerts';
import { MenuItem, Addon, SellMaterial } from '../types';
import { formatMoney } from '../utils/format';

interface PosMaterial extends SellMaterial {
  uniqueId: string;
}

export default function PointOfSale() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [clientName, setClientName] = useState('');
  const [paymentType, setPaymentType] = useState('efectivo');

  const [materials, setMaterials] = useState<PosMaterial[]>([
    { uniqueId: Math.random().toString(36).substring(2) + Date.now().toString(36), menuItemId: '', quantity: 1, addonIds: [] },
  ]);

  useEffect(() => {
    api.getMenuItems().then(setMenuItems);
    api.getAddons().then(setAddons);
  }, []);

  const addMaterial = () => {
    setMaterials([
      ...materials,
      { uniqueId: Math.random().toString(36).substring(2) + Date.now().toString(36), menuItemId: '', quantity: 1, addonIds: [] },
    ]);
  };

  const removeMaterial = (uniqueId: string) => {
    setMaterials(materials.filter((m) => m.uniqueId !== uniqueId));
  };

  const updateMaterial = (index: number, field: keyof PosMaterial, value: any) => {
    const newMaterials = [...materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setMaterials(newMaterials);
  };

  const handleAddAddon = (index: number, addonIdStr: string, maxAddons: number) => {
    const addonId = parseInt(addonIdStr);
    if (isNaN(addonId)) return;
    const currentAddons = materials[index].addonIds || [];
    if (!currentAddons.includes(addonId)) {
      if (currentAddons.length < maxAddons) {
        updateMaterial(index, 'addonIds', [...currentAddons, addonId]);
      } else {
        Dialog.fire({
          icon: 'warning',
          title: 'Límite alcanzado',
          text: `Este producto permite máximo ${maxAddons} agregados.`,
        });
      }
    }
  };

  const removeAddon = (index: number, addonId: number) => {
    const currentAddons = materials[index].addonIds || [];
    updateMaterial(
      index,
      'addonIds',
      currentAddons.filter((id: number) => id !== addonId),
    );
  };

  const calculateTotal = () => {
    return materials.reduce((total, mat) => {
      const item = menuItems.find((mi) => mi.id === parseInt(mat.menuItemId));
      return total + (item ? item.price * mat.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (materials.length === 0)
      return Dialog.fire({
        icon: 'error',
        title: 'Faltan productos',
        text: 'Debes agregar al menos un producto.',
      });
    if (materials.some((m) => !m.menuItemId))
      return Dialog.fire({
        icon: 'error',
        title: 'Faltan platos',
        text: 'Asegúrate de seleccionar un plato en todos los productos.',
      });
    if (!clientName)
      return Dialog.fire({
        icon: 'error',
        title: 'Cliente requerido',
        text: 'Debes ingresar un nombre de cliente.',
      });

    const payload = {
      sell: {
        client_name: clientName,
        payment_type: paymentType,
        total: calculateTotal(),
        sell_materials_attributes: materials.map((mat) => {
          const item = menuItems.find((mi) => mi.id === parseInt(mat.menuItemId));
          return {
            menu_item_id: mat.menuItemId,
            quantity: mat.quantity,
            price: item?.price || 0,
            total: (item?.price || 0) * mat.quantity,
            addon_ids: mat.addonIds,
          };
        }),
      },
    };

    try {
      await api.createSell(payload);
      Toast.fire({ icon: 'success', title: `Venta de ${formatMoney(calculateTotal())} a ${clientName} registrada` });
      setClientName('');
      setMaterials([{ uniqueId: Math.random().toString(36).substring(2) + Date.now().toString(36), menuItemId: '', quantity: 1, addonIds: [] }]);
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const total = calculateTotal();
  const activeMenuItems = menuItems.filter((mi) => mi.active);
  const activeAddons = addons.filter((addon) => addon.active);

  const paymentIcon =
    paymentType === 'efectivo' ? (
      <Banknote size={18} />
    ) : paymentType === 'tarjeta' ? (
      <CreditCard size={18} />
    ) : (
      <Landmark size={18} />
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 space-y-6">
        <Card className="p-6 sm:p-8 relative overflow-hidden border-0 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-2xl">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3"></div>
          </div>

          <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3 relative z-10 text-slate-900 dark:text-white">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-500 shrink-0">
              <Receipt size={24} />
            </div>
            Nueva Venta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Cliente"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Mesa 4, Juan..."
                  iconLeft={<User size={18} />}
                  required
                />
              </div>
              <div className="relative group">
                <Select
                  label="Método de Pago"
                  value={paymentType}
                  onChange={(val) => setPaymentType(val as string)}
                  searchable={false}
                  iconLeft={paymentIcon}
                  options={[
                    { value: 'efectivo', label: 'Efectivo' },
                    { value: 'tarjeta', label: 'Tarjeta' },
                    { value: 'transferencia', label: 'Transferencia' },
                  ]}
                />
              </div>
            </div>

            <motion.div layout className="space-y-4">
              <AnimatePresence mode="popLayout">
                {materials.map((mat, idx) => {
                  const selectedItem = menuItems.find((mi) => mi.id === parseInt(mat.menuItemId));
                  return (
                    <motion.div
                      key={mat.uniqueId}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -50 }}
                      transition={{ duration: 0.2 }}
                      className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:border-primary-500/30 transition-all relative group backdrop-blur-sm"
                    >

                      <button
                        type="button"
                        onClick={() => removeMaterial(mat.uniqueId)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-all opacity-100 md:opacity-0 group-hover:opacity-100 z-10"
                        title="Eliminar producto"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2 pr-10 pl-2">
                        <div className="md:col-span-3">
                          <Select
                            label={`Plato #${idx + 1}`}
                            value={mat.menuItemId}
                            onChange={(val) => updateMaterial(idx, 'menuItemId', val)}
                            required
                            searchable={true}
                            iconLeft={<Coffee size={18} />}
                            placeholder="Buscar plato..."
                            options={[
                              { value: '', label: 'Selecciona plato...' },
                              ...activeMenuItems.map((mi) => ({
                                value: mi.id.toString(),
                                label: `${mi.name} - ${formatMoney(mi.price)}`,
                              })),
                            ]}
                          />
                        </div>
                        <div>
                          <Input
                            label="Cant."
                            type="number"
                            min="1"
                            value={mat.quantity}
                            iconLeft={<Hash size={16} />}
                            onChange={(e) =>
                              updateMaterial(idx, 'quantity', parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedItem && selectedItem.addon_quantity > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 pl-2"
                          >
                            <Select
                              label={`Añadir Agregado (Máx. ${selectedItem.addon_quantity})`}
                              value={''}
                              onChange={(val) => {
                                if (val)
                                  handleAddAddon(idx, val as string, selectedItem.addon_quantity);
                              }}
                              searchable={true}
                              placeholder="Buscar agregado..."
                              options={[
                                { value: '', label: 'Seleccionar...' },
                                ...activeAddons
                                  .filter((addon) => !mat.addonIds?.includes(addon.id))
                                  .map((addon) => ({
                                    value: addon.id.toString(),
                                    label: addon.name,
                                  })),
                              ]}
                            />

                            {mat.addonIds && mat.addonIds.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                <AnimatePresence>
                                  {mat.addonIds.map((addonId) => {
                                    const addon = addons.find((a) => a.id === addonId);
                                    if (!addon) return null;
                                    return (
                                      <motion.div
                                        key={addon.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="flex items-center gap-1.5 bg-primary-500 text-white px-3 py-1.5 rounded-xl text-sm font-semibold shadow-sm"
                                      >
                                        <Utensils size={14} />
                                        {addon.name}
                                        <button
                                          type="button"
                                          onClick={() => removeAddon(idx, addon.id)}
                                          className="ml-1 p-0.5 hover:bg-white/20 rounded-full transition-colors"
                                        >
                                          <X size={14} />
                                        </button>
                                      </motion.div>
                                    );
                                  })}
                                </AnimatePresence>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            <motion.button
              layout
              type="button"
              className="w-full h-16 border-2 border-dashed border-primary-500/40 hover:border-primary-500 bg-primary-500/5 hover:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.01] active:scale-[0.99]"
              onClick={addMaterial}
            >
              <Plus size={22} className="animate-pulse" />
              Añadir Otro Plato
            </motion.button>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-4">
        <Card className="p-0 overflow-hidden sticky top-24 border-0 ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-2xl">
          <div className="bg-slate-50 dark:bg-slate-950 p-6 text-slate-900 dark:text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 text-slate-900 dark:text-white pointer-events-none transform translate-x-4 -translate-y-4">
              <Receipt size={120} />
            </div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
              <ShoppingCart className="text-primary-500 dark:text-primary-400" /> Mi Pedido
            </h2>

            <div className="space-y-3 mb-6 min-h-[100px] relative z-10">
              <AnimatePresence>
                {materials.length === 0 || (materials.length === 1 && !materials[0].menuItemId) ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-400 text-sm text-center italic mt-10"
                  >
                    Aún no hay productos en la orden.
                  </motion.p>
                ) : (
                  materials.map((mat) => {
                    const item = menuItems.find((mi) => mi.id === parseInt(mat.menuItemId));
                    if (!item) return null;
                    return (
                      <motion.div
                        key={mat.uniqueId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex justify-between items-center text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 sm:p-4 group/item hover:border-primary-500/30 transition-colors shadow-sm dark:shadow-none"
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-2.5 py-1 rounded-lg text-xs">
                            {mat.quantity}x
                          </span>
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            {mat.addonIds && mat.addonIds.length > 0 && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1 bg-slate-100 dark:bg-slate-950/50 inline-flex px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                                <Plus size={10} className="text-primary-500 dark:text-primary-400" /> {mat.addonIds.length} agregados
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-base bg-slate-50 dark:bg-slate-950/50 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 group-hover/item:border-primary-500/30 transition-colors">
                          {formatMoney(item.price * mat.quantity)}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
                Total a Pagar
              </span>
              <motion.div
                key={total}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200 drop-shadow-sm"
              >
                {formatMoney(total)}
              </motion.div>
            </div>

            <button
              className="w-full h-16 text-lg font-bold rounded-2xl bg-primary-500 hover:bg-primary-600 active:scale-[0.98] shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary-500),0.5)] text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              onClick={handleSubmit}
              disabled={materials.length === 0 || !materials[0].menuItemId}
            >
              <Save size={24} />
              Procesar Venta
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
