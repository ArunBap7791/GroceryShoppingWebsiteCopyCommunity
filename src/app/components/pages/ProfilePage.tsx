import { useState } from 'react';
import { User, Mail, Phone, MapPin, Package, ChevronRight, LogOut, Edit3, ShoppingBag, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface AuthUser {
  name: string;
  email: string;
}

interface ProfilePageProps {
  user: AuthUser;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const mockOrders = [
  {
    id: '#ORD-4821',
    date: 'Aug 15, 2026',
    status: 'Delivered',
    total: 38.47,
    items: ['Organic Red Apples', 'Fresh Bananas', 'Vine Tomatoes']
  },
  {
    id: '#ORD-4762',
    date: 'Aug 8, 2026',
    status: 'Delivered',
    total: 61.20,
    items: ['Whole Milk', 'Greek Yogurt', 'Artisan Sourdough']
  },
  {
    id: '#ORD-4701',
    date: 'Jul 29, 2026',
    status: 'Delivered',
    total: 24.95,
    items: ['Mixed Nuts', 'Orange Juice', 'Fresh Strawberries']
  }
];

export function ProfilePage({ user, onLogout, onNavigate }: ProfilePageProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'edit' | 'orders'>('overview');
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: '',
    address: ''
  });
  const [saved, setSaved] = useState(false);

  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-muted py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header card */}
        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden mb-8">
          <div className="h-28 bg-gradient-to-r from-primary to-primary/70" />
          <CardContent className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-12 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-3xl font-extrabold text-primary">{initials}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveSection('edit')}
                className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl"
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                Edit Profile
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1.5 mt-1 text-sm">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar nav */}
          <div className="space-y-3">
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardContent className="p-2">
                {[
                  { id: 'overview', label: 'Account Overview', icon: User },
                  { id: 'orders', label: 'Order History', icon: Package },
                  { id: 'edit', label: 'Edit Profile', icon: Edit3 }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id as typeof activeSection)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeSection === id
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </button>
                ))}
              </CardContent>
            </Card>

            <Button
              variant="outline"
              onClick={() => { onLogout(); onNavigate('home'); }}
              className="w-full rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            {activeSection === 'overview' && (
              <Card className="border-0 shadow-md rounded-2xl">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-lg font-bold text-foreground">Account Overview</h2>
                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Total Orders', value: mockOrders.length, icon: ShoppingBag, color: 'bg-primary/10 text-primary' },
                      { label: 'Items Delivered', value: '12', icon: Package, color: 'bg-accent/10 text-accent' }
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className={`${color} rounded-2xl p-5`}>
                        <Icon className="w-6 h-6 mb-3" />
                        <div className="text-3xl font-extrabold">{value}</div>
                        <div className="text-sm font-medium mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Account Details</h3>
                    <div className="space-y-3">
                      {[
                        { icon: User, label: 'Name', value: user.name },
                        { icon: Mail, label: 'Email', value: user.email },
                        { icon: Phone, label: 'Phone', value: 'Not added yet' },
                        { icon: MapPin, label: 'Default Address', value: 'Not added yet' }
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">{label}</p>
                            <p className="text-foreground font-medium">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => onNavigate('shop')}
                    className="w-full bg-primary hover:bg-primary/85 text-white rounded-xl"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeSection === 'orders' && (
              <Card className="border-0 shadow-md rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Order History</h2>
                  <Separator className="mb-4" />
                  <div className="space-y-4">
                    {mockOrders.map(order => (
                      <div key={order.id} className="border border-border rounded-2xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-bold text-foreground text-sm">{order.id}</span>
                            <span className="text-muted-foreground text-xs ml-3">{order.date}</span>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {order.items.join(', ')}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">${order.total.toFixed(2)}</span>
                          <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                            View Details <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'edit' && (
              <Card className="border-0 shadow-md rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Edit Profile</h2>
                  <Separator className="mb-6" />
                  <form onSubmit={handleSave} className="space-y-5">
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Full Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        className="h-11 rounded-xl bg-muted border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Email Address</Label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                        className="h-11 rounded-xl bg-muted border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Phone Number</Label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={editForm.phone}
                        onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                        className="h-11 rounded-xl bg-muted border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Default Delivery Address</Label>
                      <Input
                        placeholder="123 Main Street, City, State ZIP"
                        value={editForm.address}
                        onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}
                        className="h-11 rounded-xl bg-muted border-0"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-primary hover:bg-primary/85 text-white rounded-xl font-semibold"
                    >
                      {saved ? (
                        <span className="flex items-center gap-2">
                          <Check className="w-4 h-4" /> Saved!
                        </span>
                      ) : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
