import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { usePOS } from "../context/POSContext";
import { formatCurrency } from "../lib/utils";
import { DollarSign, ShoppingBag, TrendingUp, CreditCard, Clock } from "lucide-react";

export default function Dashboard() {
  const { orders } = usePOS();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Simple aggregation for chart (last 7 items) - mock behavior for demo
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  // In a real app we'd aggregate real dates from orders
  const recentOrdersData = orders.slice(0, 5);

  const stats = [
    { name: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { name: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { name: "Avg Value", value: formatCurrency(avgOrderValue), icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  ];

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Real-time store statistics and performance summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${stat.bg}`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Weekly Sales Trend</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Orders</h2>
            <span className="text-sm text-emerald-500 hover:text-emerald-600 cursor-pointer font-medium">View All</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {recentOrdersData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-70">
                <Clock className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-3" />
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">No recent orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrdersData.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-3">
                        <CreditCard className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-zinc-900 dark:text-white">#{order.orderNumber}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {order.items.length} items
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-zinc-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
