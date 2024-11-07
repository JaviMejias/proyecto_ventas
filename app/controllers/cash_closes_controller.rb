class CashClosesController < ApplicationController
  before_action :set_cash_close, only: %i[ show edit update destroy ]

  def index
    @q = CashClose.ransack(params[:q])
    @cash_closes = @q.result.order(date: :desc).page(params[:page]).per(10)
  end

  def new
    @cash_close = CashClose.new
    @unclosed_sells = Sell.open_sells.group_by(&:payment_type)

    totals = @cash_close.calculate_totals(@unclosed_sells)

    @cash_close.total_sales = totals[:total_sales]
    @cash_close.total_cash = totals[:total_cash]
    @cash_close.total_card = totals[:total_card]
    @cash_close.total_transfer = totals[:total_transfer]
  end

  def show
    @sells = @cash_close.sells.group_by(&:payment_type)
  end

  def create
    @cash_close = CashClose.new(transformed_params)
    @cash_close.date = Date.today
  
    unclosed_sells = Sell.open_sells.group_by(&:payment_type)
    @cash_close.sells = unclosed_sells.values.flatten
  
    if @cash_close.save
      Sell.open_sells.update_all(cash_close_id: @cash_close.id)
      redirect_to cash_closes_path, notice: "Cierre de caja creado exitosamente."
    else
      @unclosed_sells = unclosed_sells
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @cash_close.update(transformed_params)
      redirect_to cash_closes_path, notice: "Cierre de Caja Actualizado con éxito."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @cash_close.destroy!

    redirect_to cash_closes_path, status: :see_other, notice: "Cash close was successfully destroyed."
  end

  private

  def set_cash_close
    @cash_close = CashClose.find(params[:id])
  end

  def cash_close_params
    params.require(:cash_close).permit(
      :date, :total_sales, :total_cash, :total_card, :total_transfer
    )
  end

  def transformed_params
    transformed = cash_close_params.dup
    transformed[:total_sales] = helpers.escape_chars_2(transformed[:total_sales]) if transformed[:total_sales].present?
    transformed[:total_cash] = helpers.escape_chars_2(transformed[:total_cash]) if transformed[:total_cash].present?
    transformed[:total_card] = helpers.escape_chars_2(transformed[:total_card]) if transformed[:total_card].present?
    transformed[:total_transfer] = helpers.escape_chars_2(transformed[:total_transfer]) if transformed[:total_transfer].present?

    transformed
  end
end
