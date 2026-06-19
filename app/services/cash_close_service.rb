class CashCloseService
  def preview(user_id, mode = 'personal')
    unclosed_sells = if mode == 'global'
                       Sell.open_sells
                     else
                       Sell.open_sells.where(user_id: user_id)
                     end

    {
      total_cash: unclosed_sells.where(payment_type: :efectivo).sum(:total),
      total_card: unclosed_sells.where(payment_type: :tarjeta).sum(:total),
      total_transfer: unclosed_sells.where(payment_type: :transferencia).sum(:total),
      total_sales: unclosed_sells.sum(:total),
      count: unclosed_sells.count
    }
  end

  def process_close!(user_id, mode = 'personal')
    unclosed_sells = if mode == 'global'
                       Sell.open_sells
                     else
                       Sell.open_sells.where(user_id: user_id)
                     end

    return { success: false, errors: ["No hay ventas abiertas para cerrar."] } if unclosed_sells.empty?

    cash_close = CashClose.new(date: Date.today, user_id: user_id)
    cash_close.sells = unclosed_sells
    totals = preview(user_id, mode)

    cash_close.total_cash = totals[:total_cash]
    cash_close.total_card = totals[:total_card]
    cash_close.total_transfer = totals[:total_transfer]
    cash_close.total_sales = totals[:total_sales]

    if cash_close.save
      { success: true, cash_close: cash_close }
    else
      { success: false, errors: cash_close.errors.full_messages }
    end
  end
end
