import { useState } from 'react';
import { Star, Filter, X, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CartButton } from '../ui/CartButton';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  image: string;
  organic?: boolean;
  onSale?: boolean;
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

interface ProductsPageProps {
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onToggleWishlist?: (product: WishlistItem) => void;
  onProductClick?: (productId: number) => void;
  cartItems?: CartItem[];
  wishlistItems?: WishlistItem[];
}

export function ProductsPage({ onAddToCart, onUpdateQuantity, onToggleWishlist, onProductClick, cartItems = [], wishlistItems = [] }: ProductsPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(true);

  const products: Product[] = [
    {
      id: 1,
      name: 'Organic Red Apples',
      price: 4.99,
      originalPrice: 5.99,
      category: 'fruits',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1670808439268-79d2cb00a46e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGZydWl0JTIwcmVkfGVufDF8fHx8MTc1NjcwNTE3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      organic: true,
      onSale: true
    },
    {
      id: 2,
      name: 'Fresh Bananas',
      price: 2.49,
      category: 'fruits',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1661225535262-ed219d29b7b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjB5ZWxsb3clMjBmcnVpdHxlbnwxfHx8fDE3NTY4MDQ1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      name: 'Vine Tomatoes',
      price: 3.99,
      category: 'vegetables',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1621332606136-7e66f02dade1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG9lcyUyMHJlZCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzU2ODA0NTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      organic: true
    },
    {
      id: 4,
      name: 'Artisan Sourdough Bread',
      price: 6.99,
      category: 'bakery',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1679673987713-54f809ce417d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhZCUyMGZyZXNoJTIwYmFrZXJ5fGVufDF8fHx8MTc1NjgwNDUyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 5,
      name: 'Organic Spinach',
      price: 2.99,
      category: 'vegetables',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzU2Njk1MTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      organic: true
    },
    {
      id: 6,
      name: 'Fresh Strawberries',
      price: 5.49,
      category: 'fruits',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1692071096134-4e5e0a85bef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZnJ1aXRzJTIwYmFza2V0fGVufDF8fHx8MTc1NjgwNDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 7,
      name: 'Whole Milk',
      price: 3.49,
      category: 'dairy',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1685531309627-f0c9e8656ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMHByb2R1Y3RzJTIwbWlsayUyMGNoZWVzZXxlbnwxfHx8fDE3NTY3NDU5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 8,
      name: 'Mixed Nuts',
      price: 8.99,
      category: 'snacks',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1671981200629-014c03829abb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFja3MlMjBoZWFsdGh5JTIwbnV0c3xlbnwxfHx8fDE3NTY4MDQ3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 9,
      name: 'Orange Juice',
      price: 4.49,
      category: 'beverages',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1616442046966-31409e29b7a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXZlcmFnZXMlMjBqdWljZSUyMGJvdHRsZXN8ZW58MXx8fHwxNzU2ODA0Nzk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 10,
      name: 'Greek Yogurt',
      price: 5.99,
      category: 'dairy',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1685531309627-f0c9e8656ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMHByb2R1Y3RzJTIwbWlsayUyMGNoZWVzZXxlbnwxfHx8fDE3NTY3NDU5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 11,
      name: 'Broccoli',
      price: 2.79,
      category: 'vegetables',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1634731201932-9bd92839bea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGVzJTIwZnJlc2glMjBncmVlbnxlbnwxfHx8fDE3NTY4MDQ3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 12,
      name: 'Granola Bars',
      price: 6.49,
      originalPrice: 7.99,
      category: 'snacks',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1671981200629-014c03829abb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFja3MlMjBoZWFsdGh5JTIwbnV0c3xlbnwxfHx8fDE3NTY4MDQ3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      onSale: true
    }
  ];

  const categories = [
    { value: 'fruits', label: 'Fruits', count: 4 },
    { value: 'vegetables', label: 'Vegetables', count: 3 },
    { value: 'dairy', label: 'Dairy', count: 2 },
    { value: 'snacks', label: 'Snacks', count: 2 },
    { value: 'beverages', label: 'Beverages', count: 1 },
    { value: 'bakery', label: 'Bakery', count: 1 }
  ];

  const ratings = [5, 4, 3, 2, 1];

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings([...selectedRatings, rating]);
    } else {
      setSelectedRatings(selectedRatings.filter(r => r !== rating));
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50]);
    setSelectedRatings([]);
  };

  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Rating filter
    if (selectedRatings.length > 0 && !selectedRatings.some(rating => product.rating >= rating)) {
      return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Shop</h1>
          <p className="text-xl text-muted-foreground">Fresh, quality groceries delivered to your door</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
            <Card className="sticky top-8 shadow-lg rounded-2xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Category</h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.value} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={category.value}
                            checked={selectedCategories.includes(category.value)}
                            onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                          />
                          <label htmlFor={category.value} className="text-sm cursor-pointer">
                            {category.label}
                          </label>
                        </div>
                        <span className="text-xs text-muted-foreground">({category.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Price Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={50}
                      step={1}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Rating Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Ratings</h3>
                  <div className="space-y-3">
                    {ratings.map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={selectedRatings.includes(rating)}
                          onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                        />
                        <label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-gray-300" />
                          ))}
                          <span className="ml-2 text-sm">& up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                {!showFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                )}
                <span className="text-sm text-muted-foreground">
                  Showing {sortedProducts.length} of {products.length} products
                </span>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
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
                    {product.onSale && (
                      <Badge className="absolute top-2 left-2 bg-accent text-white">Sale</Badge>
                    )}
                    {product.organic && !product.onSale && (
                      <Badge className="absolute top-2 left-2 bg-primary text-white">Organic</Badge>
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
                      onAdd={() => onAddToCart(product)}
                      onUpdateQuantity={onUpdateQuantity}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results</p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}