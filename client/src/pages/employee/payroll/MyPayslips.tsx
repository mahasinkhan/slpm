// src/pages/employee/payroll/MyPayslips.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Calendar,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Filter,
  FileText,
} from 'lucide-react';

const MyPayslips: React.FC = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('2024');

  const years = ['2024', '2023', '2022'];

  const payslips = [
    {
      id: 1,
      month: 'November',
      year: '2024',
      grossSalary: 50000,
      netSalary: 45000,
      deductions: 5000,
      status: 'Paid',
      paidOn: '2024-11-30',
    },
    {
      id: 2,
      month: 'October',
      year: '2024',
      grossSalary: 50000,
      netSalary: 45000,
      deductions: 5000,
      status: 'Paid',
      paidOn: '2024-10-31',
    },
    {
      id: 3,
      month: 'September',
      year: '2024',
      grossSalary: 50000,
      netSalary: 44500,
      deductions: 5500,
      status: 'Paid',
      paidOn: '2024-09-30',
    },
    {
      id: 4,
      month: 'August',
      year: '2024',
      grossSalary: 48000,
      netSalary: 43200,
      deductions: 4800,
      status: 'Paid',
      paidOn: '2024-08-31',
    },
    {
      id: 5,
      month: 'July',
      year: '2024',
      grossSalary: 48000,
      netSalary: 43200,
      deductions: 4800,
      status: 'Paid',
      paidOn: '2024-07-31',
    },
  ];

  // Calculate yearly stats
  const yearlyStats = {
    totalGross: payslips.reduce((sum, p) => sum + p.grossSalary, 0),
    totalNet: payslips.reduce((sum, p) => sum + p.netSalary, 0),
    totalDeductions: payslips.reduce((sum, p) => sum + p.deductions, 0),
    avgMonthly: Math.round(payslips.reduce((sum, p) => sum + p.netSalary, 0) / payslips.length),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">YTD Gross</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(yearlyStats.totalGross)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">YTD Net</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(yearlyStats.totalNet)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-red-100 rounded-lg">
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">YTD Deductions</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(yearlyStats.totalDeductions)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <Calendar className="text-purple-600" size={20} />
            </div>
            <span className="text-sm text-gray-600">Avg Monthly</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(yearlyStats.avgMonthly)}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-800">Payslip History</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-600" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
              <Download size={18} />
              <span className="hidden sm:inline">Download All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payslips List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Gross Salary
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Deductions
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Net Salary
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Paid On
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payslips.map((payslip) => (
                <tr key={payslip.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{payslip.month}</p>
                    <p className="text-xs text-gray-500">{payslip.year}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {formatCurrency(payslip.grossSalary)}
                  </td>
                  <td className="px-6 py-4 text-red-600">
                    -{formatCurrency(payslip.deductions)}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    {formatCurrency(payslip.netSalary)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {payslip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(payslip.paidOn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/employee/payroll/${payslip.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="View"
                      >
                        <Eye size={18} className="text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Download"
                      >
                        <Download size={18} className="text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {payslips.map((payslip) => (
            <div key={payslip.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{payslip.month} {payslip.year}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold mt-1">
                    {payslip.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 text-lg">{formatCurrency(payslip.netSalary)}</p>
                  <p className="text-xs text-gray-500">Net Salary</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <p className="text-gray-600">Gross: {formatCurrency(payslip.grossSalary)}</p>
                  <p className="text-red-600">Deductions: -{formatCurrency(payslip.deductions)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/employee/payroll/${payslip.id}`)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Eye size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Download size={18} className="text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Information Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Tax Documents</h3>
            <p className="text-sm text-gray-600 mb-3">
              Your Form 16 and other tax documents for FY 2023-24 are available for download.
            </p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2">
              <Download size={16} />
              Download Form 16
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPayslips;