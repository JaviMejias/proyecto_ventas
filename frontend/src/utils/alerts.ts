import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export const Toast = {
  fire: ({
    icon,
    title,
    text,
  }: {
    icon: 'success' | 'error' | 'info' | 'warning';
    title: string;
    text?: string;
  }) => {
    const message = text ? `${title}\n${text}` : title;
    if (icon === 'success') {
      toast.success(message);
    } else if (icon === 'error') {
      toast.error(message);
    } else {
      toast(message, { icon: icon === 'warning' ? '⚠️' : 'ℹ️' });
    }
  },
};

export const Dialog = Swal.mixin({
  confirmButtonColor: '#f97316',
  iconColor: '#f97316',
  customClass: {
    popup:
      '!bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-white !rounded-[2rem] !shadow-2xl border border-slate-100 dark:border-slate-700',
    title: '!text-slate-900 dark:!text-white',
    htmlContainer: '!text-slate-600 dark:!text-slate-300',
    confirmButton: '!rounded-xl !px-6 !py-3 !font-bold',
    cancelButton:
      '!rounded-xl !px-6 !py-3 !font-bold !bg-slate-200 dark:!bg-slate-700 !text-slate-800 dark:!text-white',
  },
});
