module Api
  module V1
    class MenuItemsController < ApplicationController
      skip_before_action :verify_authenticity_token

      def index
        menu_items = MenuItem.order(id: :desc)
        render json: menu_items.as_json(only: [:id, :name, :price, :addon_quantity, :active])
      end

      def create
        menu_item = MenuItem.new(menu_item_params)
        if menu_item.save
          render json: menu_item, status: :created
        else
          render json: { errors: menu_item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        menu_item = MenuItem.find(params[:id])
        if menu_item.update(menu_item_params)
          render json: menu_item
        else
          render json: { errors: menu_item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        menu_item = MenuItem.find(params[:id])
        menu_item.destroy
        head :no_content
      rescue ActiveRecord::InvalidForeignKey
        render json: { error: 'No puedes borrar este plato porque ya tiene ventas asociadas en el historial.' }, status: :unprocessable_entity
      end

      private

      def menu_item_params
        params.require(:menu_item).permit(:name, :price, :addon_quantity, :active)
      end
    end
  end
end
