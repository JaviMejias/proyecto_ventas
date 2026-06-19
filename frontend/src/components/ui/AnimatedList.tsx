import { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

export function AnimatedList({ children, className = '' }: AnimatedListProps) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className={className}>
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </motion.div>
  );
}

export function AnimatedListItem({
  children,
  className = '',
  keyId,
}: {
  children: ReactNode;
  className?: string;
  keyId: string | number;
}) {
  return (
    <motion.div
      key={keyId}
      layout
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
