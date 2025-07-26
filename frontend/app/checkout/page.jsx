"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock } from "lucide-react"
import { createOrder, processPayment } from "@/lib/api"

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [shippingForm, setShippingForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  })
  
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "credit_card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (cart.length === 0) {
      router.push("/cart")
      return
    }
  }, [user, cart, router])

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
  }

  const handleShippingChange = (field, value) => {
    setShippingForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field, value) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!shippingForm.street || !shippingForm.city || !shippingForm.state || !shippingForm.zipCode) {
      toast({
        title: "Error",
        description: "Please fill in all shipping details",
        variant: "destructive",
      })
      return
    }

    if (paymentForm.paymentMethod === "credit_card" || paymentForm.paymentMethod === "debit_card") {
      if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.cardholderName) {
        toast({
          title: "Error",
          description: "Please fill in all payment details",
          variant: "destructive",
        })
        return
      }
    }

    try {
      setLoading(true)
      
      // Process payment first (fake)
      if (paymentForm.paymentMethod !== "cash_on_delivery") {
        const paymentResult = await processPayment({
          amount: parseFloat(calculateTotal()),
          paymentMethod: paymentForm.paymentMethod,
          cardNumber: paymentForm.cardNumber,
          expiryDate: paymentForm.expiryDate,
          cvv: paymentForm.cvv,
          cardholderName: paymentForm.cardholderName,
        })
        
        console.log("Payment processed:", paymentResult)
      }

      // Create order
      const orderData = {
        paymentMethod: paymentForm.paymentMethod,
        shippingAddress: shippingForm,
      }

      const order = await createOrder(orderData)
      
      // Clear cart
      await clearCart()
      
      toast({
        title: "Order Placed!",
        description: `Your order ${order.orderNumber} has been placed successfully.`,
      })
      
      router.push(`/profile?tab=orders`)
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || cart.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Where should we deliver your order?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={shippingForm.street}
                  onChange={(e) => handleShippingChange("street", e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingForm.city}
                    onChange={(e) => handleShippingChange("city", e.target.value)}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={shippingForm.state}
                    onChange={(e) => handleShippingChange("state", e.target.value)}
                    placeholder="NY"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={shippingForm.zipCode}
                    onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                    placeholder="10001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={shippingForm.country} onValueChange={(value) => handleShippingChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                How would you like to pay?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentForm.paymentMethod} onValueChange={(value) => handlePaymentChange("paymentMethod", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(paymentForm.paymentMethod === "credit_card" || paymentForm.paymentMethod === "debit_card") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      value={paymentForm.cardholderName}
                      onChange={(e) => handlePaymentChange("cardholderName", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={paymentForm.expiryDate}
                        onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentForm.cvv}
                        onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                Your payment information is secure and encrypted
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
              
              <Button 
                onClick={handleSubmit} 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? "Processing..." : `Place Order ($${calculateTotal()})`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}