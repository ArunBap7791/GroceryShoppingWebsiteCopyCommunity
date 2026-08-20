import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface AuthUser {
  name: string;
  email: string;
}

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onNavigate?: (page: string) => void;
  user?: AuthUser | null;
  onRequireAuth?: () => void;
}

export function CartPage({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate, user, onRequireAuth }: CartPageProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (!user) {
      onRequireAuth?.();
      return;
    }
    onNavigate?.('checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-muted py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Button 
              size="lg"
              onClick={() => onNavigate?.('shop')}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="shadow-sm rounded-xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="shadow-lg rounded-xl border-0 sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-primary">FREE</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                {deliveryFee > 0 && (
                  <div className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">
                    Add ${(50 - subtotal).toFixed(2)} more for free delivery!
                  </div>
                )}
                
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/85 text-white"
                  size="lg"
                >
                  {user ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Sign In to Checkout
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  {user
                    ? `Checking out as ${user.name}`
                    : 'Sign in required to place your order'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delivery Info */}
        <Card className="mt-8 shadow-sm rounded-xl border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Delivery Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground">Same-Day Delivery</h4>
                <p className="text-muted-foreground">Order by 2 PM for same-day delivery</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Free Delivery</h4>
                <p className="text-muted-foreground">On orders over $50</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Delivery Window</h4>
                <p className="text-muted-foreground">Choose your preferred 2-hour window</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}