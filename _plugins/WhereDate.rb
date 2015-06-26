module Jekyll
    module AdvancedWhere
        def where_before(input, property, value)
            return input unless input.is_a?(Enumerable)
            input = input.values if input.is_a?(Hash)
            input.select { |object| item_property(object, property) <= value }
        end
        def where_after(input, property, value)
            return input unless input.is_a?(Enumerable)
            input = input.values if input.is_a?(Hash)
            input.select { |object| item_property(object, property) >= value }
        end
        def where_contains(input, property, value)
            return input unless input.is_a?(Enumerable)
            input = input.values if input.is_a?(Hash)
            input.select { |object| item_property(object, property).include? value }
        end
    end
end

Liquid::Template.register_filter(Jekyll::AdvancedWhere)