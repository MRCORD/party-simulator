"use client";

import React from 'react';
import { PlusCircle, Type, Link as LinkIcon, Layers, Box, Ruler, DollarSign, Hash, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ShoppingItem, Category } from '@/types';

interface ItemFormProps {
  newItem: Omit<ShoppingItem, 'id'>;
  editingItem: ShoppingItem | null;
  categories: Category[];
  sizeUnits: Record<string, string[]>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  addItem: () => void;
  saveEdit: () => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({
  newItem,
  editingItem,
  categories,
  sizeUnits,
  handleInputChange,
  addItem,
  saveEdit,
  onCancel
}) => {
  return (
    <div className="p-5 bg-primary-light/10 border-b border-primary-light/20">
      <h3 className="text-lg font-bold text-blue-800 mb-4">
        {editingItem ? 'Editar Artículo' : 'Agregar Nuevo Artículo'}
      </h3>
      
      {/* Name field in the form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="ej. Ron Cartavio"
            label="Nombre del Artículo"
            variant="secondary"
            icon={<Type size={16} />}
          />
        </div>
        
        <div>
          <Input
            type="url"
            name="url"
            value={newItem.url}
            onChange={handleInputChange}
            placeholder="https://..."
            label="URL del Producto"
            variant="secondary"
            icon={<LinkIcon size={16} />}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">Categoría</label>
          <Select
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            variant="secondary"
            icon={<Layers size={16} />}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              type="number"
              name="cost"
              value={newItem.cost}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              placeholder="0.00"
              label="Precio (S/)"
              variant="secondary"
              leftAddon={<DollarSign size={16} />}
            />
          </div>
          
          <div>
            <Input
              type="number"
              name="units"
              value={newItem.units}
              onChange={handleInputChange}
              min="1"
              placeholder="1"
              label="Unidades"
              variant="secondary"
              icon={<Hash size={16} />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 mt-5 gap-4 ml-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Input
                type="text"
                name="size"
                value={newItem.size}
                onChange={handleInputChange}
                placeholder="ej. Botella 750"
                label="Tamaño"
                variant="secondary"
                icon={<Box size={16} />}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Unidad de Medida</label>
              <Select
                name="sizeUnit"
                value={newItem.sizeUnit}
                onChange={handleInputChange}
                variant="secondary"
                icon={<Ruler size={16} />}
              >
                {sizeUnits[newItem.category].map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </Select>
            </div>
          </div>
          
          <div>
            <Input
              type="number"
              name="servings"
              value={newItem.servings}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
              label="Porciones"
              variant="secondary"
              icon={<PlusCircle size={16} />}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button 
          variant="outline" 
          color="secondary"
          onClick={onCancel}
          className="mr-2"
        >
          Cancelar
        </Button>
        <Button 
          variant="solid" 
          color="success"
          onClick={editingItem ? saveEdit : addItem}
        >
          {editingItem ? 'Actualizar' : 'Agregar'}
        </Button>
      </div>
      
      {/* Info about complementary items */}
      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mt-5">
        <div className="flex items-start">
          <LinkIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-indigo-800 font-medium">¿Sabías que puedes vincular artículos complementarios?</p>
            <p className="text-sm text-indigo-700 mt-1">
              Después de agregar tus artículos, usa la sección &quot;Artículos Complementarios&quot; para crear relaciones
              entre productos que se consumen juntos, como hamburguesas y panes, o ron y cola.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;