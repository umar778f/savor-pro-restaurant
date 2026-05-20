import { useState } from "react";
import { usePOS } from "../../context/POSContext";
import { formatCurrency } from "../../lib/utils";
import { Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, Receipt, CheckCircle2, ShoppingCart } from "lucide-react";
import { paymentMethods } from "../../data/menu";
import { motion, AnimatePresence } from "framer-motion";
import { generateInvoicePDF } from "../../utils/generateInvoice";
import { toast } from "sonner";

export default function CartPanel() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, tax, total, addOrder, orders } = usePOS();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowPayment(true);
  };

  const handlePayment = () => {
    if (selectedPayment === "cash" && parseFloat(amountReceived) < total) {
      toast.error("Insufficient amount received");
      return;
    }
    
    setProcessing(true);
    
    // Simulate real network request
    setTimeout(() => {
      const order = addOrder(selectedPayment);
      setProcessing(false);
      setOrderComplete(order);
      toast.success("Payment successful!");
    }, 1500);
  };

  const resetCart = () => {
    setOrderComplete(null);
    setShowPayment(false);
    setAmountReceived("");
  };

  const handlePrint = () => {
    if (orderComplete) {
      generateInvoicePDF(orderComplete);
    }
  };

  if (orderComplete) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 relative">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">Order #{orderComplete.orderNumber}</p>
          
          <div className="w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 mb-8 border border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Total Amount</span>
              <span className="font-bold text-zinc-900 dark:text-white">{formatCurrency(orderComplete.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Payment Method</span>
              <span className="font-medium text-zinc-900 dark:text-white capitalize">{orderComplete.paymentMethod}</span>
            </div>
            {orderComplete.paymentMethod === "cash" && amountReceived && (
              <div className="flex justify-between mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700 text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Change Due</span>
                <span className="font-bold text-orange-500">{formatCurrency(parseFloat(amountReceived) - orderComplete.total)}</span>
              </div>
            )}
          </div>

          <div className="flex w-full gap-3">
            <button 
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 rounded-xl font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Print Bill
            </button>
            <button 
              onClick={resetCart}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20"
            >
              New Order
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-zinc-900">
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Payment</h2>
          <button 
            onClick={() => setShowPayment(false)}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-zinc-100 dark:border-zinc-800">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Amount to Pay</span>
            <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">{formatCurrency(total)}</span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 uppercase tracking-wider">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(method => {
                const Icon = method.id === 'cash' ? Banknote : method.id === 'card' ? CreditCard : Smartphone;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === method.id 
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">{method.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedPayment === "cash" && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Amount Received</h3>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-zinc-500">Rs.</span>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-white font-medium text-lg"
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2000, 5000].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setAmountReceived(amt.toString())}
                    className="py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                  >
                    +{amt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {selectedPayment === "card" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="py-8 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200 dark:border-zinc-700"
            >
              <div className="w-20 h-14 bg-zinc-800 dark:bg-zinc-950 rounded-xl mb-4 flex items-center justify-end px-3 border border-zinc-700 shadow-lg relative overflow-hidden">
                <div className="w-5 h-8 bg-zinc-400/20 rounded-sm absolute left-3"></div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                </div>
              </div>
              <p className="text-zinc-700 dark:text-zinc-200 font-semibold mb-1">Awaiting Card</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs text-center px-4">Please tap, insert, or swipe card on the terminal</p>
            </motion.div>
          )}

          {(selectedPayment === "jazzcash" || selectedPayment === "easypaisa") && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="py-6 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200 dark:border-zinc-700"
            >
              <div className="bg-white p-2 flex items-center justify-center rounded-xl shadow-sm border border-zinc-200 mb-3 overflow-hidden">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay-${selectedPayment}-${total}`} 
                  alt="QR Code" 
                  className="w-28 h-28 object-contain mix-blend-multiply" 
                />
              </div>
              <p className="text-zinc-700 dark:text-zinc-200 font-semibold mb-1">Scan to Pay</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs text-center px-4">
                Ask customer to scan using {selectedPayment === "jazzcash" ? "JazzCash" : "EasyPaisa"} App
              </p>
            </motion.div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <button
            onClick={handlePayment}
            disabled={processing}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${
              processing 
                ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 cursor-not-allowed" 
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
            }`}
          >
            {processing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : "Confirm Payment"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative w-full bg-white dark:bg-zinc-900">
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-10 sticky top-0">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Current Order</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">#{orders.length + 1001}</p>
        </div>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center"
          >
            <Trash2 className="w-3 h-3 mr-1.5" />
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 opacity-60">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 border border-zinc-100 dark:border-zinc-700">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <p className="font-medium text-zinc-600 dark:text-zinc-300">Cart is empty</p>
            <p className="text-sm mt-1">Add items from the menu to start order</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95, margin: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800 group relative overflow-hidden"
                >
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-zinc-200 dark:bg-zinc-700" />
                  <div className="ml-3 flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-none mb-1">{item.name}</h4>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-2">{formatCurrency(item.price)}</span>
                    
                    <div className="flex items-center gap-2 mt-auto">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-md bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between ml-2">
                     <span className="font-bold text-sm text-zinc-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                     <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-6 z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-none">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            <span>Subtotal</span>
            <span className="text-zinc-900 dark:text-zinc-100">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            <span>Tax (10%)</span>
            <span className="text-zinc-900 dark:text-zinc-100">{formatCurrency(tax)}</span>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-700 border-dashed my-3"></div>
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">Total</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(total)}</span>
          </div>
        </div>
        
        <button 
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className={`w-full py-4 rounded-xl font-bold flex flex-col items-center justify-center transition-all shadow-sm ${
            cart.length === 0 
              ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed" 
              : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white dark:shadow-emerald-500/20 shadow-lg"
          }`}
        >
          <span>Charge {formatCurrency(total)}</span>
        </button>
      </div>
    </div>
  );
}
