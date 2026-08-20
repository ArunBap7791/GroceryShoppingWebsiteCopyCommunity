import { ShoppingCart, Leaf } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex-shrink-0">
        <ShoppingCart className="w-9 h-9 text-primary" />
        <Leaf className="w-4 h-4 text-accent absolute -top-1 -right-1" />
      </div>
      <div className="flex items-baseline gap-1 leading-none">
        <span className="text-lg font-medium text-foreground tracking-tight">The Grocers</span>
        <span className="text-lg font-extrabold text-primary tracking-tight">Market</span>
      </div>
    </div>
  );
}