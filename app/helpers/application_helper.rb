module ApplicationHelper
  def escape_chars_2(str)
    str.to_s.gsub(".", "")
  end
end
