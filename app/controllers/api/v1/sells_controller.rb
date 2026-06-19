require 'csv'

module Api
  module V1
    class SellsController < ApplicationController
      skip_before_action :verify_authenticity_token

      def index
        @sells = Sell.recent.includes(:cash_close).page(params[:page] || 1).per(20)
        render json: {
          data: @sells.as_json(
            only: [:id, :client_name, :payment_type, :total, :created_at, :status],
            include: { cash_close: { only: [:id] } }
          ),
          meta: { page: @sells.current_page, pages: @sells.total_pages }
        }
      end

      def export_excel
        start_date = Time.current.beginning_of_month
        end_date = Time.current.end_of_month
        
        if params[:start_date].present? && params[:end_date].present?
          start_date = Time.parse(params[:start_date]).beginning_of_day
          end_date = Time.parse(params[:end_date]).end_of_day
        end

        @sells = Sell.includes(:user, sell_materials: :menu_item)
                    .where(created_at: start_date..end_date)
                    .order(created_at: :desc)

        respond_to do |format|
          format.xlsx do
            response.headers['Content-Disposition'] = "attachment; filename=\"ventas_#{start_date.strftime('%Y-%m-%d')}.xlsx\""
            render xlsx: "export_excel", template: "api/v1/sells/export_excel"
          end
        end
      end

      def show
        sell = Sell.with_details.find(params[:id])
        render json: sell.as_json(
          include: {
            sell_materials: {
              include: { menu_item: { only: [:id, :name] }, addons: { only: [:id, :name] } }
            }
          }
        )
      end

      def create
        sell = current_user.sells.build(sell_params)
        if sell.save
          render json: sell, status: :created
        else
          render json: { errors: sell.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        sell = Sell.find(params[:id])
        if sell.update(sell_params)
          render json: sell
        else
          render json: { errors: sell.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def sell_params
        params.require(:sell).permit(
          :client_name, :payment_type, :total, :status,
          sell_materials_attributes: [
            :menu_item_id, :quantity, :price, :total, addon_ids: []
          ]
        )
      end
    end
  end
end
