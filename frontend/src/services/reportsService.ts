import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatMoney, formatDate } from '../utils/format';

export const reportsService = {
  generateCashClosePDF: (cashClose: any) => {
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });
    
    const primaryColor: [number, number, number] = [239, 68, 68]; // Red-500
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('REPORTE DE CIERRE DE CAJA', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Cierre #${cashClose.id} - Generado el ${formatDate(new Date().toISOString())}`, 105, 28, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, 196, 35);
    
    // General Info
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Usuario: ${cashClose.user?.name || 'Sistema'}`, 14, 45);
    doc.text(`Fecha del Cierre: ${formatDate(cashClose.created_at)}`, 14, 52);
    doc.text(`Monto Total Esperado: ${formatMoney(cashClose.total_expected)}`, 14, 59);
    doc.text(`Monto Total Declarado: ${formatMoney(cashClose.total_actual)}`, 14, 66);
    
    const diff = cashClose.total_actual - cashClose.total_expected;
    if (diff === 0) {
      doc.setTextColor(16, 185, 129); // Emerald-500
      doc.text('Diferencia: $0 (Cuadre Perfecto)', 14, 73);
    } else if (diff > 0) {
      doc.setTextColor(59, 130, 246); // Blue-500
      doc.text(`Diferencia: Sobrante (+${formatMoney(diff)})`, 14, 73);
    } else {
      doc.setTextColor(239, 68, 68); // Red-500
      doc.text(`Diferencia: Faltante (${formatMoney(diff)})`, 14, 73);
    }
    
    // Desglose de Pagos
    doc.setTextColor(40, 40, 40);
    doc.text('Desglose por Metodos de Pago:', 14, 85);
    
    autoTable(doc, {
      startY: 90,
      head: [['Metodo de Pago', 'Esperado', 'Declarado', 'Diferencia']],
      body: [
        ['Efectivo', formatMoney(cashClose.expected_cash), formatMoney(cashClose.actual_cash), formatMoney(cashClose.actual_cash - cashClose.expected_cash)],
        ['Vouchers (Tarjeta)', formatMoney(cashClose.expected_card), formatMoney(cashClose.actual_card), formatMoney(cashClose.actual_card - cashClose.expected_card)],
        ['Transferencias', formatMoney(cashClose.expected_transfer), formatMoney(cashClose.actual_transfer), formatMoney(cashClose.actual_transfer - cashClose.expected_transfer)],
      ],
      theme: 'grid',
      headStyles: { fillColor: primaryColor },
    });
    
    // Detalle de Ventas
    if (cashClose.sells && cashClose.sells.length > 0) {
      const startY = (doc as any).lastAutoTable.finalY + 15;
      doc.text(`Ventas Asociadas (${cashClose.sells.length}):`, 14, startY);
      
      autoTable(doc, {
        startY: startY + 5,
        head: [['ID Venta', 'Cliente', 'Metodo Pago', 'Monto', 'Fecha']],
        body: cashClose.sells.map((s: any) => [
          `#${s.id}`, 
          s.client_name, 
          s.payment_type, 
          formatMoney(s.total), 
          formatDate(s.created_at)
        ]),
        theme: 'striped',
        headStyles: { fillColor: [71, 85, 105] }, // Slate-600
        styles: { fontSize: 9 },
      });
    }

    // Signatures
    const finalY = (doc as any).lastAutoTable.finalY + 40;
    
    const signatureY = finalY > 270 ? 40 : finalY;
    if (finalY > 270) {
      doc.addPage();
    }
    
    doc.setDrawColor(150, 150, 150);
    doc.line(40, signatureY, 90, signatureY);
    doc.line(120, signatureY, 170, signatureY);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Firma Cajero', 65, signatureY + 5, { align: 'center' });
    doc.text('Firma Administrador', 145, signatureY + 5, { align: 'center' });
    
    // Save
    doc.save(`cierre_caja_${cashClose.id}.pdf`);
  }
};
