module Api
  module V1
    class CashClosesController < ApplicationController
      skip_before_action :verify_authenticity_token

      def index
        @cash_closes = CashClose.includes(:user).recent.page(params[:page] || 1).per(20)
        render json: {
          data: @cash_closes.as_json(
            only: [:id, :date, :total_cash, :total_card, :total_transfer, :total_sales, :created_at],
            include: { user: { only: [:first_name, :last_name] } }
          ),
          meta: { page: @cash_closes.current_page, pages: @cash_closes.total_pages }
        }
      end

      def export_excel
        @cash_closes = CashClose.includes(:user, sells: { sell_materials: :menu_item }).recent
        respond_to do |format|
          format.xlsx do
            response.headers['Content-Disposition'] = "attachment; filename=\"cierres_#{Time.current.strftime('%Y-%m-%d')}.xlsx\""
            render xlsx: "export_excel", template: "api/v1/cash_closes/export_excel"
          end
        end
      end

      def show
        cash_close = CashClose.find(params[:id])
        render json: cash_close.as_json(
          include: { 
            user: { only: [:first_name, :last_name] },
            sells: { only: [:id, :client_name, :payment_type, :total] } 
          }
        )
      end

      def preview
        mode = params[:mode] || 'personal'
        unclosed_sells = if mode == 'global'
                           Sell.open_sells.with_details
                         else
                           current_user.sells.open_sells.with_details
                         end

        sells_data = unclosed_sells.as_json(
          only: [:id, :client_name, :payment_type, :total, :created_at],
          include: {
            sell_materials: {
              only: [:quantity, :total],
              include: { menu_item: { only: [:name] }, addons: { only: [:name] } }
            }
          }
        )

        totals = CashCloseService.new.preview(current_user.id, mode)
        render json: { sells: sells_data, totals: totals }
      end

      def create
        mode = params[:mode] || 'personal'
        result = CashCloseService.new.process_close!(current_user.id, mode)

        if result[:success]
          render json: result[:cash_close], status: :created
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      private

      def cash_close_params
        params.fetch(:cash_close, {}).permit(
          :total_sales, :total_cash, :total_card, :total_transfer
        )
      end
    end
  end
end
