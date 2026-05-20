import { useState } from "react";
import { usePOS } from "../context/POSContext";
import { formatCurrency } from "../lib/utils";
import { Search, FileText, Download, Trash2, CalendarDays, Filter } from "lucide-react";
import { generateInvoicePDF } from "../utils/generateInvoice";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function History() {
  const { orders, deleteOrder } = usePOS();
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    order => order.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Order History</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Review past transactions and generate invoices.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-zinc-900 dark:text-white transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <CalendarDays className="w-4 h-4 mr-2" />
            Date Filter
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Order ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Date & Time</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Items</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Method</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-zinc-500 dark:text-zinc-400">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                        <p className="font-medium text-lg">No orders found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                          #{order.orderNumber}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-zinc-600 dark:text-zinc-300">
                        <div className="font-medium">{format(new Date(order.date), "MMM d, yyyy")}</div>
                        <div className="text-xs text-zinc-400">{format(new Date(order.date), "h:mm a")}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-zinc-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => generateInvoicePDF(order)}
                            title="Download Invoice"
                            className="p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-colors shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteOrder(order.id)}
                            title="Delete Record"
                            className="p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-colors shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
