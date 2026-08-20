import { Minus, Plus } from 'lucide-react';

interface CartButtonProps {
  productId: number;
  quantity: number;
  onAdd: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  size?: 'sm' | 'lg';
}

export function CartButton({ productId, quantity, onAdd, onUpdateQuantity, size = 'sm' }: CartButtonProps) {
  const height = size === 'lg' ? 'h-11' : 'h-9';
  const text = size === 'lg' ? 'text-base' : 'text-sm';

  if (quantity === 0) {
    return (
      <button
        onClick={onAdd}
        className={`w-full ${height} bg-primary hover:bg-primary/85 text-white rounded-xl ${text} font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md active:scale-[0.98]`}
      >
        <Plus className="w-4 h-4" />
        Add to Cart
      </button>
    );
  }

  return (
    <div className={`w-full ${height} flex items-center bg-primary rounded-xl overflow-hidden`}>
      <button
        onClick={() => onUpdateQuantity(productId, quantity - 1)}
        className="flex items-center justify-center w-10 h-full text-white hover:bg-black/10 transition-colors active:bg-black/20"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className={`flex-1 text-center text-white font-bold ${text} select-none`}>
        {quantity}
      </span>

      <button
        onClick={() => onUpdateQuantity(productId, quantity + 1)}
        className="flex items-center justify-center w-10 h-full text-white hover:bg-black/10 transition-colors active:bg-black/20"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
