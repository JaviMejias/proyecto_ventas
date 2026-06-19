module Api
  module V1
    class AddonsController < ApplicationController
      skip_before_action :verify_authenticity_token

      def index
        render json: Addon.order(id: :desc).as_json(only: [:id, :name, :active])
      end

      def create
        addon = Addon.new(addon_params)
        if addon.save
          render json: addon, status: :created
        else
          render json: { errors: addon.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        addon = Addon.find(params[:id])
        if addon.update(addon_params)
          render json: addon
        else
          render json: { errors: addon.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        addon = Addon.find(params[:id])
        addon.destroy
        head :no_content
      rescue ActiveRecord::InvalidForeignKey
        render json: { error: 'No puedes borrar este agregado porque ya tiene ventas asociadas en el historial.' }, status: :unprocessable_entity
      end

      private

      def addon_params
        params.require(:addon).permit(:name, :active)
      end
    end
  end
end
