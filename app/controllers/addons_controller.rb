class AddonsController < ApplicationController
  def index
    @addons = Addon.left_outer_joins(:sell_material_addons)
                   .select("addons.*, COUNT(sell_material_addons.id) AS associated_sales_count")
                   .group("addons.id")
                   .order(:name)
                   .page(params[:page]).per(10)

    respond_to do |format|
      format.json { render json: @addons }
      format.html
    end
  end

  def create
    addon_names = params[:addon][:names].reject(&:blank?)
    created_count = 0

    addon_names.each do |name|
      addon = Addon.find_or_initialize_by(name: name.strip.downcase)
      if addon.new_record?
        addon.name = name.strip
        created_count += 1 if addon.save
      end
    end

    respond_to do |format|
      format.html { redirect_to menu_items_path, notice: "#{created_count} agregados creados exitosamente." }
      format.json { render json: { message: "#{created_count} agregados creados exitosamente.", addons: addon_names }, status: :ok }
    end
  end

  def destroy
    addon = Addon.find(params[:id])

    if addon.sell_materials.exists?
      render json: { error: "El agregado está asociado a una venta y no puede eliminarse." }, status: :unprocessable_entity
    else
      addon.destroy
      render json: { message: "Agregado eliminado exitosamente." }, status: :ok
    end
  end

  private

  def addon_params
    params.require(:addon).permit(names: [])
  end
end
