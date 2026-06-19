import { useState, useEffect } from 'react';
import { Utensils, Plus, Pencil, Trash2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/ui/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Switch } from '../components/ui/Switch';
import { api } from '../services/api';
import { MenuItem, Addon } from '../types';
import { Toast, Dialog } from '../utils/alerts';
import { formatMoney } from '../utils/format';

export default function Menu() {
  const [activeTab, setActiveTab] = useState<'menu' | 'addons'>('menu');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [addonQuantity, setAddonQuantity] = useState('');

  const loadData = () => {
    api.getMenuItems().then(setItems);
    api.getAddons().then(setAddons);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewItemModal = () => {
    setEditingItem(null);
    setName('');
    setPrice('');
    setAddonQuantity('0');
    setIsMenuModalOpen(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price.toLocaleString('es-CL'));
    setAddonQuantity(item.addon_quantity.toString());
    setIsMenuModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        price: parseInt(price.replace(/\./g, ''), 10),
        addon_quantity: parseInt(addonQuantity, 10),
      };

      if (editingItem) {
        await api.updateMenuItem(editingItem.id, payload);
        Toast.fire({ icon: 'success', title: `Plato "${payload.name}" actualizado` });
      } else {
        await api.createMenuItem(payload);
        Toast.fire({ icon: 'success', title: `Plato "${payload.name}" creado` });
      }
      setIsMenuModalOpen(false);
      loadData();
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const itemToDelete = items.find((i) => i.id === id);
      await api.deleteMenuItem(id);
      Toast.fire({ icon: 'success', title: `Plato "${itemToDelete?.name || 'Desconocido'}" eliminado` });
      loadData();
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Acción Bloqueada', text: err.message });
    }
  };

  const toggleItemActive = async (item: MenuItem) => {
    try {
      await api.updateMenuItem(item.id, { active: !item.active });
      Toast.fire({ icon: 'success', title: item.active ? `Plato "${item.name}" pausado` : `Plato "${item.name}" activado` });
      loadData();
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const openNewAddonModal = () => {
    setEditingAddon(null);
    setName('');
    setIsAddonModalOpen(true);
  };

  const openEditAddonModal = (addon: Addon) => {
    setEditingAddon(addon);
    setName(addon.name);
    setIsAddonModalOpen(true);
  };

  const handleSaveAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddon) {
        await api.updateAddon(editingAddon.id, { name });
        Toast.fire({ icon: 'success', title: `Agregado "${name}" actualizado` });
      } else {
        await api.createAddon({ name });
        Toast.fire({ icon: 'success', title: `Agregado "${name}" creado` });
      }
      setIsAddonModalOpen(false);
      loadData();
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const handleDeleteAddon = async (id: number) => {
    try {
      const addonToDelete = addons.find((a) => a.id === id);
      await api.deleteAddon(id);
      Toast.fire({ icon: 'success', title: `Agregado "${addonToDelete?.name || 'Desconocido'}" eliminado` });
      loadData();
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Acción Bloqueada', text: err.message });
    }
  };

  const toggleAddonActive = async (addon: Addon) => {
    try {
      await api.updateAddon(addon.id, { active: !addon.active });
      Toast.fire({
        icon: 'success',
        title: addon.active ? `Agregado "${addon.name}" pausado` : `Agregado "${addon.name}" activado`,
      });
      loadData();
    } catch (err: any) {
      Dialog.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const tabsContent = (
    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
      <button
        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'menu' ? 'bg-white dark:bg-slate-700 text-primary-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        onClick={() => setActiveTab('menu')}
      >
        Platos
      </button>
      <button
        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'addons' ? 'bg-white dark:bg-slate-700 text-primary-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        onClick={() => setActiveTab('addons')}
      >
        Agregados
      </button>
    </div>
  );

  return (
    <PageContainer
      title={activeTab === 'menu' ? 'Carta Principal' : 'Agregados'}
      icon={activeTab === 'menu' ? <Utensils size={24} /> : <Layers size={24} />}
      tabs={tabsContent}
      action={
        <Button
          onClick={activeTab === 'menu' ? openNewItemModal : openNewAddonModal}
          icon={<Plus size={20} />}
        >
          {activeTab === 'menu' ? 'Añadir Plato' : 'Añadir Agregado'}
        </Button>
      }
    >

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            <AnimatePresence mode="popLayout">
              {activeTab === 'menu'
                ? items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 1, scale: 1, y: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      hoverEffect
                      className={`p-6 flex flex-col justify-between group transition-all duration-500 h-full ${!item.active ? 'opacity-60 grayscale' : 'hover:border-primary-500/40'} relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary-500/10 to-transparent rounded-bl-[4rem] pointer-events-none transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6"></div>

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-5">
                          <div className="w-14 h-14 bg-primary-100/80 dark:bg-primary-500/20 text-primary-500 rounded-[1.25rem] flex items-center justify-center shadow-inner shadow-white/50 dark:shadow-none border border-white/50 dark:border-primary-500/20 group-hover:scale-110 transition-transform duration-500">
                            <Utensils size={28} strokeWidth={2.5} />
                          </div>
                          <Switch
                            checked={item.active}
                            onChange={() => toggleItemActive(item)}
                            title={item.active ? 'Pausar plato' : 'Habilitar plato'}
                          />
                        </div>
                        <h3
                          className={`text-2xl font-extrabold tracking-tight mb-3 transition-colors ${!item.active ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400'}`}
                        >
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="primary" icon={<Layers size={14} />}>
                            {item.addon_quantity > 0 ? `Hasta ${item.addon_quantity} agregados` : 'Sin agregados'}
                          </Badge>
                          {!item.active && <Badge variant="gray">Pausado</Badge>}
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between relative z-10">
                        <span
                          className={`text-3xl font-extrabold tracking-tight ${item.active ? 'text-primary-500' : 'text-slate-500'}`}
                        >
                          {formatMoney(item.price)}
                        </span>
                        <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 md:translate-x-4 group-hover:translate-x-0">
                          <button
                            onClick={() => openEditItemModal(item)}
                            className="p-3 text-slate-400 hover:text-white hover:bg-primary-500 transition-all bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-primary-500/30 hover:-translate-y-1"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-3 text-slate-400 hover:text-white hover:bg-red-500 transition-all bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-red-500/30 hover:-translate-y-1"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
                : addons.map((addon) => (
                  <motion.div
                    key={addon.id}
                    layout
                    initial={{ opacity: 1, scale: 1, y: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      hoverEffect
                      className={`p-6 flex flex-col justify-between group transition-all duration-500 h-full ${!addon.active ? 'opacity-60 grayscale' : 'hover:border-primary-500/40'} relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary-500/10 to-transparent rounded-bl-[4rem] pointer-events-none transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6"></div>

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-5">
                          <div className="w-14 h-14 bg-primary-100/80 dark:bg-primary-500/20 text-primary-500 rounded-[1.25rem] flex items-center justify-center shadow-inner shadow-white/50 dark:shadow-none border border-white/50 dark:border-primary-500/20 group-hover:scale-110 transition-transform duration-500">
                            <Plus size={28} strokeWidth={2.5} />
                          </div>
                          <Switch
                            checked={addon.active}
                            onChange={() => toggleAddonActive(addon)}
                            title={addon.active ? 'Pausar agregado' : 'Habilitar agregado'}
                          />
                        </div>
                        <h3
                          className={`text-2xl font-extrabold tracking-tight mb-3 transition-colors ${!addon.active ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400'}`}
                        >
                          {addon.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {addon.active ? <Badge variant="primary">Disponible</Badge> : <Badge variant="gray">Pausado</Badge>}
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-end relative z-10">
                        <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 md:translate-x-4 group-hover:translate-x-0">
                          <button
                            onClick={() => openEditAddonModal(addon)}
                            className="p-3 text-slate-400 hover:text-white hover:bg-primary-500 transition-all bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-primary-500/30 hover:-translate-y-1"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddon(addon.id)}
                            className="p-3 text-slate-400 hover:text-white hover:bg-red-500 transition-all bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-red-500/30 hover:-translate-y-1"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </AnimatePresence>

            {activeTab === 'menu' && items.length === 0 && (
              <EmptyState
                icon={<Utensils size={32} />}
                title="Menú Vacío"
                description="No hay platos registrados. Haz clic en 'Añadir Plato' para comenzar a llenar tu carta principal."
              />
            )}
            {activeTab === 'addons' && addons.length === 0 && (
              <EmptyState
                icon={<Layers size={32} />}
                title="Sin Agregados"
                description="No hay agregados registrados. Haz clic en 'Añadir Agregado' para ofrecer extras a tus clientes."
              />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <Modal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        title={editingItem ? 'Editar Plato' : 'Añadir Plato'}
      >
        <form onSubmit={handleSaveItem} className="space-y-4 mt-4">
          <Input
            label="Nombre del Plato"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej. Hamburguesa Doble"
          />
          <Input
            label="Precio ($)"
            type="text"
            value={price}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, '');
              if (rawValue === '') setPrice('');
              else setPrice(parseInt(rawValue, 10).toLocaleString('es-CL'));
            }}
            required
            placeholder="Ej. 5.000"
          />
          <Input
            label="Límite de Agregados"
            type="number"
            value={addonQuantity}
            onChange={(e) => setAddonQuantity(e.target.value)}
            required
            placeholder="Ej. 2"
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsMenuModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Plato</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAddonModalOpen}
        onClose={() => setIsAddonModalOpen(false)}
        title={editingAddon ? 'Editar Agregado' : 'Añadir Agregado'}
      >
        <form onSubmit={handleSaveAddon} className="space-y-4 mt-4">
          <Input
            label="Nombre del Agregado"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej. Extra Queso"
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsAddonModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Agregado</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
