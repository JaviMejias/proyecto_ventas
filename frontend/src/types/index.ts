export interface MenuItem {
  id: number;
  name: string;
  price: number;
  addon_quantity: number;
  active: boolean;
}

export interface Addon {
  id: number;
  name: string;
  active: boolean;
}

export interface SellMaterial {
  menuItemId: string;
  quantity: number;
  addonIds: number[];
}

export interface Sell {
  id: number;
  client_name: string;
  payment_type: string;
  total: number;
  status?: 'recibido' | 'en_proceso' | 'listo' | 'entregado';
  created_at: string;
  cash_close?: { id: number };
}

export interface CashClose {
  id: number;
  date: string;
  total_cash: number;
  total_card: number;
  total_transfer: number;
  total_sales: number;
  sells?: Sell[];
  created_at?: string;
  user?: { first_name: string; last_name?: string };
}

export interface Seller {
  id: number;
  name: string;
  active: boolean;
  created_at?: string;
}
