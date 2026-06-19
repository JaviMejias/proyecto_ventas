module Api
  module V1
    class SellersController < ApplicationController
      skip_before_action :verify_authenticity_token
      skip_before_action :authenticate_user!, raise: false

      def index
        render json: Seller.all
      end

      def create
        seller = Seller.new(seller_params)
        if seller.save
          render json: seller, status: :created
        else
          render json: { errors: seller.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        seller = Seller.find(params[:id])
        if seller.update(seller_params)
          render json: seller
        else
          render json: { errors: seller.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        seller = Seller.find(params[:id])
        if seller.sells.any?
          seller.update(active: false)
          render json: { message: 'Vendedor desactivado (tiene ventas asociadas)' }
        else
          seller.destroy
          render json: { message: 'Vendedor eliminado' }
        end
      end

      private

      def seller_params
        params.require(:seller).permit(:name, :active)
      end
    end
  end
end
