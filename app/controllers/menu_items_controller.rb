class MenuItemsController < ApplicationController
  before_action :set_menu_item, only: %i[ edit update destroy get_menu_item_price ]

  include ApplicationHelper

  def index
    @q = MenuItem.ransack(params[:q])
    @menu_items = @q.result.order(id: :asc).page(params[:page]).per(10)
  end

  def new
    @menu_item = MenuItem.new
  end

  def edit
    @menu_item = MenuItem.find(params[:id])
  end

  def create
    @menu_item = MenuItem.new(transformed_params)

    if @menu_item.save
      redirect_to menu_items_path, notice: "Agregado al menú correctamente."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @menu_item.update(transformed_params)
      redirect_to menu_items_path, notice: "Elemento actualizado correctamente."
    else
      render :edit, status: :unprocessable_entity
    end
  rescue ActiveRecord::StaleObjectError
    flash[:alert] = "Otro usuario ha modificado este elemento. Por favor, revisa los cambios y vuelve a intentarlo."
    render :edit, status: :conflict
  end

  def destroy
    @menu_item.destroy!
    redirect_to menu_items_path, status: :see_other, notice: "Elemento eliminado correctamente."
  rescue ActiveRecord::StaleObjectError
    redirect_to menu_items_path, alert: "Otro usuario ha modificado este elemento. No se pudo eliminar."
  end

  def get_menu_item_price
    render json: {
      price: @menu_item.price,
      max_addons: @menu_item.addon_quantity
    }
  end

  private

  def set_menu_item
    @menu_item = MenuItem.find(params[:id])
  end

  def menu_item_params
    params.require(:menu_item).permit(:name, :price, :addon_quantity)
  end

  def transformed_params
    params = menu_item_params
    params[:price] = helpers.escape_chars_2(params[:price]) if params[:price].present?
    params
  end
end
