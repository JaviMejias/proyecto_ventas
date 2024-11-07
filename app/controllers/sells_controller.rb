class SellsController < ApplicationController
  before_action :set_sell, only: %i[ show ]

  include ApplicationHelper

  def index
    @q = Sell.ransack(params[:q])
    @sells = @q.result.order(id: :asc).page(params[:page]).per(10)
  end

  def new
    @sell = Sell.new
    @sell.sell_materials.build
  end

  def show
  end

  def create
    ActiveRecord::Base.transaction do
      @sell = Sell.new(transformed_params)
      @sell.document_date = Date.today

      if @sell.save
        redirect_to new_sell_path, notice: "Venta creada de forma exitosa."
      else
        render :new, status: :unprocessable_entity
        raise ActiveRecord::Rollback
      end
    end
  end

  private

  def set_sell
    @sell = Sell.find(params[:id])
  end

  def sell_params
    params.require(:sell).permit(
      :client_name, :payment_type, :total,
      sell_materials_attributes: [ :menu_item_id, :quantity, :price, :total, addon_ids: [] ]
    )
  end

  def transformed_params
    params = sell_params
    params[:total] = helpers.escape_chars_2(params[:total]) if params[:total].present?

    sell_materials_attributes = params[:sell_materials_attributes].values

    sell_materials_attributes.reject! do |att|
      att[:menu_item_id].blank? && att[:quantity].blank? && att[:price].blank?
    end

    sell_materials_attributes.each do |att|
      att[:quantity] = helpers.escape_chars_2(att[:quantity]) if att[:quantity].present?
      att[:price] = helpers.escape_chars_2(att[:price]) if att[:price].present?
      att[:total] = helpers.escape_chars_2(att[:total]) if att[:total].present?
    end

    params[:sell_materials_attributes] = sell_materials_attributes.map(&:to_h)
    params
  end
end
