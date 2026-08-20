import { useState } from 'react';
import { CreditCard, Smartphone, Banknote, CheckCircle, MapPin, Phone, Mail, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
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

interface CheckoutPageProps {
  cartItems: CartItem[];
  onNavigate: (page: string) => void;
  user?: AuthUser | null;
}

export function CheckoutPage({ cartItems, onNavigate, user }: CheckoutPageProps) {
  const [firstName, lastName] = user
    ? [user.name.split(' ')[0] ?? '', user.name.split(' ').slice(1).join(' ') ?? '']
    : ['', ''];

  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName,
    lastName,
    email: user?.email ?? '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    instructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.0875;
  const total = subtotal + deliveryFee + tax;

  const handleInputChange = (field: string, value: string) => {
    setDeliveryDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    const missingFields = requiredFields.filter(field => !deliveryDetails[field as keyof typeof deliveryDetails]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    if (paymentMethod === 'card') {
      const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      const missingCardFields = cardFields.filter(field => !cardDetails[field as keyof typeof cardDetails]);
      
      if (missingCardFields.length > 0) {
        alert(`Please fill in the following card details: ${missingCardFields.join(', ')}`);
        return;
      }
    }

    alert('Order placed successfully! You will receive a confirmation email shortly.');
    onNavigate('home');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Checkout</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <button onClick={() => onNavigate('home')} className="hover:text-primary">Home</button>
            <span className="mx-2">/</span>
            <button onClick={() => onNavigate('cart')} className="hover:text-primary">Cart</button>
            <span className="mx-2">/</span>
            <span className="text-foreground">Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <Card className="shadow-lg rounded-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="firstName"
                        value={deliveryDetails.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10"
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="lastName"
                        value={deliveryDetails.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="pl-10"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={deliveryDetails.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="phone"
                        value={deliveryDetails.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={deliveryDetails.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter street address"
                  />
                </div>

                <div>
                  <Label htmlFor="apartment">Apartment, Suite, etc. (Optional)</Label>
                  <Input
                    id="apartment"
                    value={deliveryDetails.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={deliveryDetails.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={deliveryDetails.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    value={deliveryDetails.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    placeholder="Special delivery instructions, gate codes, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card className="shadow-lg rounded-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5 text-primary" />
                      UPI Payment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote className="w-5 h-5 text-primary" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {/* Card Details Form */}
                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <Separator />
                    <h3 className="font-semibold">Card Details</h3>
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name *</Label>
                      <Input
                        id="cardholderName"
                        value={cardDetails.cardholderName}
                        onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                        placeholder="Name on card"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={(e) => handleCardInputChange('expiryDate', formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Details */}
                {paymentMethod === 'upi' && (
                  <div className="mt-6 space-y-4">
                    <Separator />
                    <div className="text-center p-6 bg-secondary rounded-lg">
                      <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">UPI Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        You will be redirected to your UPI app to complete the payment
                      </p>
                    </div>
                  </div>
                )}

                {/* COD Details */}
                {paymentMethod === 'cod' && (
                  <div className="mt-6 space-y-4">
                    <Separator />
                    <div className="text-center p-6 bg-secondary rounded-lg">
                      <Banknote className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Cash on Delivery</h3>
                      <p className="text-sm text-muted-foreground">
                        Pay with cash when your order is delivered. Please keep exact change ready.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-8 shadow-lg rounded-2xl border-0">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-primary font-medium">FREE</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {deliveryFee > 0 && (
                  <div className="text-xs text-muted-foreground bg-secondary p-3 rounded-lg">
                    Add ${(50 - subtotal).toFixed(2)} more for free delivery!
                  </div>
                )}

                <Button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl"
                  size="lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Place Order
                </Button>

                {/* Delivery Info */}
                <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-primary" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-primary" />
                    <span>Same-day delivery available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-primary" />
                    <span>100% satisfaction guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}