import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function FactorChart({ result }) {
  if (!result) return null;

  const { factors, motherTotal, fatherTotal } = result;

  const pieData = [
    { name: 'Mother', value: motherTotal },
    { name: 'Father', value: fatherTotal }
  ];

  const COLORS = ['#f43f5e', '#3b82f6'];

  const barData = factors.map(f => ({
    name: f.name.substring(0, 4) + '.',
    fullName: f.name,
    Mother: f.mother,
    Father: f.father
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Visual Comparison</h2>
      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-2/3 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', color: '#fff', borderRadius: '8px', border: 'none' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="Mother" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Father" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/3 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toFixed(3)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
