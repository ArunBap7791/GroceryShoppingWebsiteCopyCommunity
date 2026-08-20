import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './components/pages/HomePage';
import { ProductsPage } from './components/pages/ProductsPage';
import { ProductDetailsPage } from './components/pages/ProductDetailsPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { CartPage } from './components/pages/CartPage';
import { CheckoutPage } from './components/pages/CheckoutPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { WishlistPage } from './components/pages/WishlistPage';
import * as api from '../utils/api';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
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

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [user, setUser] = useState<api.AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authIntent, setAuthIntent] = useState<'checkout' | null>(null);

  // Refs used to avoid triggering save effects during the initial load
  const syncReadyRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    api.getMe().then(async (me) => {
      if (!me) return;
      userIdRef.current = me.id;
      setUser(me);
      const [serverCart, serverWishlist] = await Promise.all([api.getCart(), api.getWishlist()]);
      setCartItems(serverCart);
      setWishlistItems(serverWishlist);
      syncReadyRef.current = true;
    }).catch(() => {});
  }, []);

  // Debounced cart save — only runs after initial load (syncReadyRef guard)
  useEffect(() => {
    if (!syncReadyRef.current || !userIdRef.current) return;
    const timer = setTimeout(() => {
      api.saveCart(cartItems).catch(console.error);
    }, 800);
    return () => clearTimeout(timer);
  }, [cartItems]);

  // Debounced wishlist save
  useEffect(() => {
    if (!syncReadyRef.current || !userIdRef.current) return;
    const timer = setTimeout(() => {
      api.saveWishlist(wishlistItems).catch(console.error);
    }, 800);
    return () => clearTimeout(timer);
  }, [wishlistItems]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleToggleWishlist = (product: WishlistItem) => {
    setWishlistItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      return exists ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  };

  const handleAuthSuccess = async (loggedInUser: api.AuthUser) => {
    // Snapshot any local items the user had before logging in
    const localCart = cartItems;
    const localWishlist = wishlistItems;

    userIdRef.current = loggedInUser.id;
    setUser(loggedInUser);

    // Load their saved data from server
    const [serverCart, serverWishlist] = await Promise.all([
      api.getCart(),
      api.getWishlist(),
    ]);

    // Merge: server wins for items in both; local-only items are appended
    const mergedCart = [...serverCart];
    for (const local of localCart) {
      if (!mergedCart.find(s => s.id === local.id)) {
        mergedCart.push(local);
      }
    }
    const mergedWishlist = [...serverWishlist];
    for (const local of localWishlist) {
      if (!mergedWishlist.find(s => s.id === local.id)) {
        mergedWishlist.push(local);
      }
    }

    setCartItems(mergedCart);
    setWishlistItems(mergedWishlist);
    syncReadyRef.current = true;

    // Persist merged state immediately
    api.saveCart(mergedCart).catch(console.error);
    api.saveWishlist(mergedWishlist).catch(console.error);

    setShowAuthModal(false);
    if (authIntent === 'checkout') {
      setCurrentPage('checkout');
    }
    setAuthIntent(null);
  };

  const handleLogout = async () => {
    syncReadyRef.current = false;
    userIdRef.current = null;
    await api.logout().catch(console.error);
    setUser(null);
    setCartItems([]);
    setWishlistItems([]);
    setCurrentPage('home');
  };

  const handleOpenAuth = () => {
    setShowAuthModal(true);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedProductId(null);
  };

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
    setCurrentPage('product-details');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onProductClick={handleProductClick}
            onToggleWishlist={handleToggleWishlist}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
          />
        );
      case 'shop':
        return (
          <ProductsPage
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onProductClick={handleProductClick}
            onToggleWishlist={handleToggleWishlist}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
          />
        );
      case 'product-details':
        return selectedProductId ? (
          <ProductDetailsPage
            productId={selectedProductId}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            onNavigate={handleNavigate}
            onToggleWishlist={handleToggleWishlist}
            wishlistItems={wishlistItems}
          />
        ) : (
          <HomePage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onProductClick={handleProductClick}
            onToggleWishlist={handleToggleWishlist}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={handleNavigate}
            user={user}
            onRequireAuth={() => {
              setAuthIntent('checkout');
              setShowAuthModal(true);
            }}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            cartItems={cartItems}
            onNavigate={handleNavigate}
            user={user}
          />
        );
      case 'wishlist':
        return (
          <WishlistPage
            wishlistItems={wishlistItems}
            cartItems={cartItems}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onProductClick={handleProductClick}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return user ? (
          <ProfilePage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
        ) : (
          <HomePage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onProductClick={handleProductClick}
            onToggleWishlist={handleToggleWishlist}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
          />
        );
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onProductClick={handleProductClick}
            onToggleWishlist={handleToggleWishlist}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        user={user}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer onNavigate={handleNavigate} />

      {showAuthModal && (
        <AuthModal
          onClose={() => { setShowAuthModal(false); setAuthIntent(null); }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
