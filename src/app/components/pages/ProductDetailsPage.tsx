import { useState } from 'react';
import { Minus, Plus, Heart, Share2, Star, Truck, Shield, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
  category: string;
  organic?: boolean;
  onSale?: boolean;
  nutritionalInfo: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sodium: string;
  };
  ingredients: string[];
  origin: string;
  brand: string;
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

interface ProductDetailsPageProps {
  productId: number;
  onAddToCart: (product: Product, quantity: number) => void;
  onProductClick?: (productId: number) => void;
  onNavigate: (page: string) => void;
  onToggleWishlist?: (product: WishlistItem) => void;
  wishlistItems?: WishlistItem[];
}

export function ProductDetailsPage({ productId, onAddToCart, onProductClick, onNavigate, onToggleWishlist, wishlistItems = [] }: ProductDetailsPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Mock product data - in a real app, this would come from an API
  const product: Product = {
    id: productId,
    name: 'Organic Red Apples',
    price: 4.99,
    originalPrice: 5.99,
    rating: 4.8,
    reviewCount: 124,
    description: 'Fresh, crisp organic red apples picked at peak ripeness. These premium apples are grown without synthetic pesticides or fertilizers, ensuring you get the purest, most natural flavor. Perfect for snacking, baking, or adding to your favorite recipes.',
    images: [
      'https://images.unsplash.com/photo-1670808439268-79d2cb00a46e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGZydWl0JTIwcmVkfGVufDF8fHx8MTc1NjcwNTE3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1679392162435-26bd5b31529d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdHMlMjBjYXRlZ29yeSUyMGNvbG9yZnVsfGVufDF8fHx8MTc1NjgwNDc4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1692071096134-4e5e0a85bef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZnJ1aXRzJTIwYmFza2V0fGVufDF8fHx8MTc1NjgwNDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    category: 'fruits',
    organic: true,
    onSale: true,
    nutritionalInfo: {
      calories: '52 per 100g',
      protein: '0.3g',
      carbs: '14g',
      fat: '0.2g',
      fiber: '2.4g',
      sodium: '1mg'
    },
    ingredients: ['Organic Red Apples'],
    origin: 'Washington State, USA',
    brand: 'Orchard Fresh'
  };

  const recommendedProducts = [
    {
      id: 2,
      name: 'Fresh Bananas',
      price: 2.49,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1661225535262-ed219d29b7b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjB5ZWxsb3clMjBmcnVpdHxlbnwxfHx8fDE3NTY4MDQ1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 6,
      name: 'Fresh Strawberries',
      price: 5.49,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1692071096134-4e5e0a85bef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZnJ1aXRzJTIwYmFza2V0fGVufDF8fHx8MTc1NjgwNDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      name: 'Vine Tomatoes',
      price: 3.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1621332606136-7e66f02dade1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG9lcyUyMHJlZCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzU2ODA0NTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 5,
      name: 'Organic Spinach',
      price: 2.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzU2Njk1MTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-primary">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate('shop')} className="hover:text-primary">Shop</button>
          <span>/</span>
          <span className="text-foreground capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">
              <div className="relative h-96 group">
                <ImageWithFallback
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.onSale && (
                    <Badge className="bg-accent text-accent-foreground">Sale</Badge>
                  )}
                  {product.organic && (
                    <Badge className="bg-primary text-primary-foreground">Organic</Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-primary scale-110' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">{product.brand}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground capitalize">{product.category}</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <Badge variant="destructive">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <Card className="p-6 rounded-2xl border-0 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-lg font-semibold">
                  Total: ${(product.price * quantity).toFixed(2)}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onToggleWishlist?.({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.images[0], rating: product.rating, category: product.category })}
                  className={`px-4 rounded-xl border-border ${wishlistItems.some(i => i.id === product.id) ? 'border-red-400 text-red-500 bg-red-50' : ''}`}
                  title={wishlistItems.some(i => i.id === product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${wishlistItems.some(i => i.id === product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 rounded-xl"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Free Delivery</div>
                <div className="text-xs text-muted-foreground">On orders $50+</div>
              </div>
              <div className="text-center p-4">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Quality Guarantee</div>
                <div className="text-xs text-muted-foreground">100% fresh</div>
              </div>
              <div className="text-center p-4">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Same Day Delivery</div>
                <div className="text-xs text-muted-foreground">Order by 2 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="rounded-2xl border-0 shadow-lg mb-16">
          <CardContent className="p-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Product Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand:</span>
                        <span>{product.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Origin:</span>
                        <span>{product.origin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="capitalize">{product.category}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Ingredients</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.ingredients.join(', ')}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="nutrition" className="space-y-4">
                <h3 className="font-semibold mb-4">Nutritional Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground capitalize">{key}</div>
                      <div className="font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Customer Reviews</h3>
                  <Button variant="outline" size="sm">Write a Review</Button>
                </div>
                <div className="space-y-4">
                  {/* Mock reviews */}
                  {[
                    { name: 'Sarah M.', rating: 5, comment: 'Amazing quality! The apples were crisp and delicious.', date: '2 days ago' },
                    { name: 'John D.', rating: 4, comment: 'Great taste, arrived fresh. Will order again.', date: '1 week ago' },
                    { name: 'Lisa K.', rating: 5, comment: 'Perfect for my kids\' lunch boxes. Highly recommend!', date: '2 weeks ago' }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recommended Products */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <Card 
                key={product.id}
                className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-lg rounded-2xl bg-white cursor-pointer"
                onClick={() => onProductClick?.(product.id)}
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
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
                    <span className="text-sm text-muted-foreground">({product.rating})</span>
                  </div>
                  <div className="text-lg font-bold text-primary">${product.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}