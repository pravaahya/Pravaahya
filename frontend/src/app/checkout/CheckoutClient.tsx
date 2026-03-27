"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag, Trash2, Minus, Plus, Tag, X } from "lucide-react";
import { toast } from "sonner";

export function CheckoutClient() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart, removeItem, updateQuantity } = useCartStore();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);


  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", houseNo: "", streetArea: "", landmark: "", cityVillage: "", district: "", state: "Maharashtra", country: "India", pincode: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    let newErrors: Record<string, string> = {};
    if (!/^[a-zA-Z\s]{2,}$/.test(formData.fullName)) newErrors.fullName = "Name must be at least 2 characters (letters only).";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email configuration unconditionally strictly required.";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be exactly 10 digits.";
    if (!formData.houseNo.trim()) newErrors.houseNo = "House Number is required.";
    if (!formData.streetArea.trim()) newErrors.streetArea = "Street is required.";
    if (formData.landmark && formData.landmark.length > 100) newErrors.landmark = "Landmark constraint exceeded.";
    if (!formData.cityVillage.trim() || !/^[a-zA-Z\s]+$/.test(formData.cityVillage)) newErrors.cityVillage = "Valid text characters required.";
    if (!formData.district.trim()) newErrors.district = "District is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    if (!/^\d{5,10}$/.test(formData.pincode)) newErrors.pincode = "Numeric Pincode bounds violated.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please ensure all fields are properly filled correctly.");
      return false;
    }
    return true;
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


  const getDiscountedTotal = () => {
    const base = getTotalPrice();
    if (appliedDiscount === 0) return base;
    return base - (base * (appliedDiscount / 100));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setVerifyingCoupon(true);
    try {
       const res = await fetch(`${API_URL}/coupons/validate`, {
           method: "POST", headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ code: couponCode })
       });
       const json = await res.json();
       if (!res.ok) throw new Error(json.error || "Internal validation exception.");
       setAppliedDiscount(json.discountPercentage);
       toast.success(`Coupon successfully bonded: ${json.discountPercentage}% off!`);
    } catch (err: any) {
       toast.error(err.message || "Unrecognized coupon strict exception.");
       setAppliedDiscount(0);
    } finally {
       setVerifyingCoupon(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // 1. Generate Order precisely on Backend Engine (Strictly secure) mapping cart contents directly tracking user sessions uniquely
      const payloadUser = { 
        name: formData.fullName, 
        email: formData.email,
        phone: formData.phone, 
        address: {
          houseNo: formData.houseNo,
          streetArea: formData.streetArea,
          landmark: formData.landmark,
          cityVillage: formData.cityVillage,
          district: formData.district,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode
        }
      };
      const payloadProducts = items.map(item => ({ product: item.id, name: item.name, quantity: item.quantity, price: item.price }));

      const res = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           amount: getDiscountedTotal(),
           user: payloadUser,
           products: payloadProducts
        })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Order Pipeline faltered");

      // 2. Hydrate Global UI dynamically with minimal footprint overhead 
      const resLoad = await loadRazorpayScript();
      if (!resLoad) {
        toast.error("Razorpay Payment Gateway failed to load. Please verify network.");
        setLoading(false);
        return;
      }

      // 3. Mount UI logic block cleanly
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Pravaahya Eco",
        description: "Sustainable Goods Cart Purchase",
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
             // 4. Force strict untrusted frontend sequence validation algorithm inside Node Engine
             const verifyRes = await fetch(`${API_URL}/payment/verify`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_signature: response.razorpay_signature
               })
             });
             const verifyData = await verifyRes.json();
             
             if (!verifyRes.ok) throw new Error(verifyData.error || "Verification mapping faulty.");
             
             setConfirmedOrderId(verifyData.orderId);
             toast.success("Payment securely verified and processed. Thank you!");
             setSuccess(true);
             clearCart();
             setLoading(false);
          } catch(err: any) {
             toast.error(err.message || "Payment Verification Exception Captured");
             setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#4ade80", 
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        toast.error("Process aborted explicitly: " + response.error.description);
        setLoading(false);
      });
      
      paymentObject.open();
    } catch (err: any) {
      toast.error(err.message || "Payment Sequence Interrupted");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-eco-900 mb-4">Order Confirmed!</h1>
        <p className="text-eco-700 text-lg mb-8 max-w-lg">Thank you for your guest order. We have securely processed your global payment and are actively fulfilling your sustainable goods.</p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
           <Button onClick={() => router.push("/collections")} size="lg" className="rounded-full shadow-md font-bold text-lg h-14 px-8 bg-eco-600 hover:bg-eco-700">Continue Shopping</Button>
           {confirmedOrderId && (
              <a href={`${API_URL}/orders/${confirmedOrderId}/invoice`} target="_blank" rel="noopener noreferrer">
                 <Button type="button" variant="outline" size="lg" className="rounded-full shadow-sm font-bold text-lg h-14 px-8 border-eco-600 text-eco-600 hover:bg-eco-50">Download Invoice</Button>
              </a>
           )}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-20 h-20 text-eco-300 mb-6" />
        <h2 className="text-3xl font-heading font-bold text-eco-900 mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push("/collections")} size="lg" className="rounded-full mt-4 bg-earth-400 hover:bg-earth-500 text-white font-bold h-12 shadow-sm">Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 max-w-6xl">
       <h1 className="text-3xl lg:text-4xl font-heading font-bold text-eco-900 mb-8 border-b border-eco-100 pb-4 tracking-tight">Guest Checkout</h1>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
             <div className="bg-white p-6 sm:p-8 rounded-3xl border border-eco-100 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-eco-400 to-earth-400"></div>
                <h2 className="text-2xl font-heading font-semibold text-eco-900">Contact Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">Full Name</label>
                    <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" className="h-12 bg-eco-50" />
                    {errors.fullName && <p className="text-xs font-bold text-red-500">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">Email Address</label>
                    <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="h-12 bg-eco-50" />
                    {errors.email && <p className="text-xs font-bold text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">Phone</label>
                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" className="h-12 bg-eco-50" />
                    {errors.phone && <p className="text-xs font-bold text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <h2 className="text-2xl font-heading font-semibold text-eco-900 pt-8 border-t border-eco-100">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">House / Flat No.</label>
                     <Input value={formData.houseNo} onChange={e => setFormData({...formData, houseNo: e.target.value})} placeholder="A-12" className="h-12 bg-eco-50" />
                     {errors.houseNo && <p className="text-xs font-bold text-red-500">{errors.houseNo}</p>}
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">Street Name / Local Area</label>
                     <Input value={formData.streetArea} onChange={e => setFormData({...formData, streetArea: e.target.value})} placeholder="Main St" className="h-12 bg-eco-50" />
                     {errors.streetArea && <p className="text-xs font-bold text-red-500">{errors.streetArea}</p>}
                   </div>
                   <div className="space-y-2 lg:col-span-2">
                     <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">Nearby Landmark (Optional)</label>
                     <Input value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} placeholder="Opp. Central Park" className="h-12 bg-eco-50" />
                     {errors.landmark && <p className="text-xs font-bold text-red-500">{errors.landmark}</p>}
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">City / Village</label>
                     <Input value={formData.cityVillage} onChange={e => setFormData({...formData, cityVillage: e.target.value})} placeholder="Metropolis" className="h-12 bg-eco-50" />
                     {errors.cityVillage && <p className="text-xs font-bold text-red-500">{errors.cityVillage}</p>}
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">District</label>
                     <Input value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} placeholder="Metropolitan" className="h-12 bg-eco-50" />
                     {errors.district && <p className="text-xs font-bold text-red-500">{errors.district}</p>}
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">State</label>
                     <select 
                       value={formData.state} 
                       onChange={e => setFormData({...formData, state: e.target.value})} 
                       className="w-full h-12 bg-eco-50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                     >
                       {[
                         "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
                       ].map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                     {errors.state && <p className="text-xs font-bold text-red-500">{errors.state}</p>}
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">Country</label>
                     <Input value={formData.country} readOnly className="h-12 bg-gray-100 text-gray-500 cursor-not-allowed" />
                     {errors.country && <p className="text-xs font-bold text-red-500">{errors.country}</p>}
                   </div>
                   <div className="space-y-2 lg:col-span-2">
                     <label className="text-sm font-bold text-eco-800 uppercase tracking-wider">Pincode</label>
                     <Input 
                        value={formData.pincode} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, ""); // Restrict to numeric natively
                          setFormData({...formData, pincode: val});
                        }} 
                        placeholder="123456" 
                        maxLength={10}
                        className="h-12 bg-eco-50" 
                     />
                     {errors.pincode && <p className="text-xs font-bold text-red-500">{errors.pincode}</p>}
                   </div>
                 </div>

                <div className="pt-8 border-t border-eco-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-heading font-semibold text-eco-900">Payment Information</h2>
                     <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 uppercase tracking-widest">
                       Mode: Online
                     </span>
                  </div>
                  <p className="text-sm font-medium text-eco-600">You will be redirected to our secure payment gateway to complete your purchase using any method (UPI, Cards, Netbanking, etc).</p>
                </div>
              </div>
              
              <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg shadow-md font-bold bg-eco-600 hover:bg-eco-700" disabled={loading}>
                 {loading ? "Initializing Secure Gateway..." : "Confirm & Proceed to Payment"}
              </Button>
           </form>

           {/* Cart Summary Header Alignment */}
          <div>
            <div className="bg-eco-50/50 p-6 sm:p-8 rounded-3xl border border-eco-200 flex flex-col h-max sticky top-24">
               <h2 className="text-2xl font-heading font-bold text-eco-900 mb-6">Order Summary</h2>
               
               <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-eco-800 border-b border-eco-200/50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white rounded-full shadow-sm border border-eco-100 px-1 py-0.5 shrink-0">
                           <button type="button" onClick={() => updateQuantity(item.id!, item.quantity - 1)} className="p-1 text-eco-400 hover:text-eco-600 transition-colors disabled:opacity-50" disabled={item.quantity <= 1}>
                              <Minus className="w-3 h-3" />
                           </button>
                           <span className="w-6 text-center text-[11px] font-bold text-eco-900">{item.quantity}</span>
                           <button type="button" onClick={() => updateQuantity(item.id!, item.quantity + 1)} className="p-1 text-eco-400 hover:text-eco-600 transition-colors">
                              <Plus className="w-3 h-3" />
                           </button>
                        </div>
                        <span className="font-medium max-w-[130px] sm:max-w-[170px] truncate leading-tight text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-eco-900 whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          type="button" 
                          onClick={() => removeItem(item.id!)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
               </div>
               
               <div className="space-y-3 mb-6 pt-6 border-t border-eco-200 text-sm font-medium text-eco-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                     <div className="flex justify-between items-center text-amber-600 font-bold bg-amber-50 rounded-lg -mx-2 px-2 py-1.5 border border-amber-100/50">
                        <span className="flex items-center gap-1.5">
                           <Tag className="w-3.5 h-3.5" /> Promotion ({appliedDiscount}%)
                        </span>
                        <span>-₹{(getTotalPrice() * (appliedDiscount / 100)).toFixed(2)}</span>
                     </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Estimate</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
               </div>

               <div className="mb-6 flex flex-col gap-1.5">
                 <div className="flex gap-2">
                    <Input value={couponCode} onChange={e => setCouponCode(e.target.value)} disabled={appliedDiscount > 0} placeholder="Promo Code..." className="h-11 bg-white border-eco-200 text-sm font-mono tracking-widest uppercase shadow-inner" />
                    <Button 
                       type="button" 
                       onClick={handleApplyCoupon} 
                       disabled={verifyingCoupon || !couponCode.trim() || appliedDiscount > 0} 
                       className="h-11 px-6 bg-eco-900 hover:bg-eco-950 font-bold"
                    >
                       {verifyingCoupon ? "..." : "Apply"}
                    </Button>
                 </div>
                 {appliedDiscount > 0 && (
                    <button type="button" onClick={() => { setAppliedDiscount(0); setCouponCode(""); toast.success("Promo code removed."); }} className="text-xs font-bold text-red-500 hover:text-red-600 text-left pl-1 transition-colors self-start underline underline-offset-2">
                       REMOVE
                    </button>
                 )}
               </div>

               <div className="border-t border-eco-200 pt-6 flex justify-between items-center text-xl">
                   <span className="font-heading font-bold text-eco-900">Total</span>
                   <span className="font-bold text-2xl text-eco-900">₹{getDiscountedTotal().toFixed(2)}</span>
               </div>
            </div>
          </div>
       </div>
    </div>
  )
}
