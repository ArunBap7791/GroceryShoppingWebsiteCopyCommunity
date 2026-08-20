import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CartButton } from '../ui/CartButton';
import { Star } from 'lucide-react';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
}

interface CartItem {
  id: number;
  quantity: number;
}

interface WishlistPageProps {
  wishlistItems: WishlistItem[];
  cartItems: CartItem[];
  onToggleWishlist: (product: WishlistItem) => void;
  onAddToCart: (product: WishlistItem) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onProductClick?: (id: number) => void;
  onNavigate: (page: string) => void;
}

export function WishlistPage({
  wishlistItems,
  cartItems,
  onToggleWishlist,
  onAddToCart,
  onUpdateQuantity,
  onProductClick,
  onNavigate
}: WishlistPageProps) {
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center py-16">
        <div className="text-center px-4">
          <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Save items you love by tapping the heart on any product. They'll appear here for easy access.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('shop')}
            className="bg-primary hover:bg-primary/85 text-white rounded-xl px-8"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">
              {wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate('shop')}
            className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map(product => {
            const cartQty = cartItems.find(i => i.id === product.id)?.quantity ?? 0;

            return (
              <Card
                key={product.id}
                className="group overflow-hidden border-0 shadow-lg rounded-2xl bg-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                {/* Image */}
                <div
                  className="relative h-48 cursor-pointer"
                  onClick={() => onProductClick?.(product.id)}
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Remove from wishlist */}
                  <button
                    onClick={e => { e.stopPropagation(); onToggleWishlist(product); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-accent text-white text-xs font-semibold px-2 py-1 rounded-lg">
                      Sale
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3
                    className="font-semibold mb-1.5 line-clamp-2 cursor-pointer hover:text-primary transition-colors text-sm"
                    onClick={() => onProductClick?.(product.id)}
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.rating})</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <CartButton
                    productId={product.id}
                    quantity={cartQty}
                    onAdd={() => onAddToCart(product)}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
