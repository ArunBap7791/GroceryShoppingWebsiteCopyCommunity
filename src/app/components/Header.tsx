import { ShoppingCart, Search, User, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AuthUser {
  name: string;
  email: string;
}

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartCount?: number;
  wishlistCount?: number;
  user?: AuthUser | null;
  onOpenAuth?: () => void;
}

export function Header({ currentPage, onNavigate, cartCount = 0, wishlistCount = 0, user, onOpenAuth }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'text-white bg-primary shadow-lg'
                    : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="pl-9 w-56 h-10 bg-input-background rounded-xl border-0 text-sm"
              />
            </div>

            {user ? (
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-secondary transition-colors"
                title={user.name}
              >
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground max-w-[80px] truncate hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                title="Sign in"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => onNavigate('wishlist')}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}