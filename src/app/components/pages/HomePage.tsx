import { Search, ShoppingCart, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CartButton } from '../ui/CartButton';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  category: string;
}

interface CartItem {
  id: number;
  quantity: number;
}

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
}

interface HomePageProps {
  onNavigate: (page: string) => void;
  onAddToCart?: (product: Product) => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onToggleWishlist?: (product: WishlistItem) => void;
  onProductClick?: (productId: number) => void;
  cartItems?: CartItem[];
  wishlistItems?: WishlistItem[];
}

export function HomePage({ onNavigate, onAddToCart, onUpdateQuantity, onToggleWishlist, onProductClick, cartItems = [], wishlistItems = [] }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      name: 'Fruits',
      image: 'https://images.unsplash.com/photo-1679392162435-26bd5b31529d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdHMlMjBjYXRlZ29yeSUyMGNvbG9yZnVsfGVufDF8fHx8MTc1NjgwNDc4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      count: '150+ items'
    },
    {
      name: 'Vegetables',
      image: 'https://images.unsplash.com/photo-1634731201932-9bd92839bea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGVzJTIwZnJlc2glMjBncmVlbnxlbnwxfHx8fDE3NTY4MDQ3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      count: '200+ items'
    },
    {
      name: 'Dairy',
      image: 'https://images.unsplash.com/photo-1685531309627-f0c9e8656ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMHByb2R1Y3RzJTIwbWlsayUyMGNoZWVzZXxlbnwxfHx8fDE3NTY3NDU5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      count: '80+ items'
    },
    {
      name: 'Snacks',
      image: 'https://images.unsplash.com/photo-1671981200629-014c03829abb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFja3MlMjBoZWFsdGh5JTIwbnV0c3xlbnwxfHx8fDE3NTY4MDQ3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      count: '120+ items'
    },
    {
      name: 'Beverages',
      image: 'https://images.unsplash.com/photo-1616442046966-31409e29b7a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXZlcmFnZXMlMjBqdWljZSUyMGJvdHRsZXN8ZW58MXx8fHwxNzU2ODA0Nzk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      count: '90+ items'
    }
  ];

  const popularProducts: Product[] = [
    {
      id: 1,
      name: 'Organic Red Apples',
      price: 4.99,
      originalPrice: 5.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1670808439268-79d2cb00a46e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGZydWl0JTIwcmVkfGVufDF8fHx8MTc1NjcwNTE3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'fruits'
    },
    {
      id: 2,
      name: 'Fresh Bananas',
      price: 2.49,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1661225535262-ed219d29b7b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjB5ZWxsb3clMjBmcnVpdHxlbnwxfHx8fDE3NTY4MDQ1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'fruits'
    },
    {
      id: 3,
      name: 'Vine Tomatoes',
      price: 3.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1621332606136-7e66f02dade1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG9lcyUyMHJlZCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzU2ODA0NTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'vegetables'
    },
    {
      id: 4,
      name: 'Artisan Sourdough Bread',
      price: 6.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1679673987713-54f809ce417d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhZCUyMGZyZXNoJTIwYmFrZXJ5fGVufDF8fHx8MTc1NjgwNDUyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'bakery'
    },
    {
      id: 5,
      name: 'Organic Spinach',
      price: 2.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzU2Njk1MTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'vegetables'
    },
    {
      id: 6,
      name: 'Fresh Strawberries',
      price: 5.49,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1692071096134-4e5e0a85bef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZnJ1aXRzJTIwYmFza2V0fGVufDF8fHx8MTc1NjgwNDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'fruits'
    },
    {
      id: 7,
      name: 'Whole Milk',
      price: 3.49,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1685531309627-f0c9e8656ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMHByb2R1Y3RzJTIwbWlsayUyMGNoZWVzZXxlbnwxfHx8fDE3NTY3NDU5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'dairy'
    },
    {
      id: 8,
      name: 'Mixed Nuts',
      price: 8.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1671981200629-014c03829abb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFja3MlMjBoZWFsdGh5JTIwbnV0c3xlbnwxfHx8fDE3NTY4MDQ3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'snacks'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[500px] bg-gradient-to-r from-primary/10 to-accent/10 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1614260025937-b4ecb6eb9165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyb2NlcmllcyUyMHZlZ2V0YWJsZXMlMjBmcnVpdHN8ZW58MXx8fHwxNzU2Nzk0Mjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Fresh groceries"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-6xl font-bold text-white mb-6">
              Freshness Delivered Daily
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get farm-fresh groceries delivered to your doorstep. Quality guaranteed, convenience delivered.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20">
                <Search className="ml-5 text-muted-foreground w-5 h-5 shrink-0" />
                <Input
                  type="text"
                  placeholder="Search for products, categories, or brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-5 text-base border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                />
                <Button
                  type="submit"
                  className="m-2 bg-primary hover:bg-primary/90 text-white px-7 py-5 rounded-xl shrink-0 font-semibold"
                >
                  Search
                </Button>
              </div>
            </form>
            
            <Button 
              size="lg" 
              onClick={() => onNavigate('shop')}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg rounded-xl shadow-lg"
            >
              <ShoppingCart className="mr-2 w-5 h-5" />
              Start Shopping
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground">Fresh, quality products in every category</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg rounded-2xl"
                onClick={() => onNavigate('shop')}
              >
                <div className="relative h-40">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Popular Products</h2>
            <p className="text-xl text-muted-foreground">Top picks from our customers</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg rounded-2xl bg-white"
              >
                <div
                  className="relative h-48 cursor-pointer"
                  onClick={() => onProductClick?.(product.id)}
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 rounded-lg text-sm font-semibold">
                      Sale
                    </div>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); onToggleWishlist?.(product); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {(() => { const inWishlist = wishlistItems.some(i => i.id === product.id); return <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />; })()}
                  </button>
                </div>
                
                <CardContent className="p-4">
                  <h3 
                    className="font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onProductClick?.(product.id)}
                  >
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-1">({product.rating})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <CartButton
                    productId={product.id}
                    quantity={cartItems.find(i => i.id === product.id)?.quantity ?? 0}
                    onAdd={() => onAddToCart?.(product)}
                    onUpdateQuantity={(id, qty) => onUpdateQuantity?.(id, qty)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => onNavigate('shop')}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}