// src/pages/employee/payroll/SalaryDetails.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Printer,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
  Calendar,
  User,
  FileText,
} from 'lucide-react';

const SalaryDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock payslip data
  const payslip = {
    id: 1,
    month: 'November',
    year: '2024',
    payPeriod: 'Nov 1, 2024 - Nov 30, 2024',
    paidOn: '2024-11-30',
    employee: {
      name: 'John Doe',
      id: 'EMP-2024-001',
      department: 'Engineering',
      designation: 'Senior Developer',
      bankAccount: 'XXXX XXXX 1234',
      pan: 'ABCDE1234F',
    },
    earnings: [
      { label: 'Basic Salary', amount: 25000 },
      { label: 'House Rent Allowance (HRA)', amount: 10000 },
      { label: 'Special Allowance', amount: 8000 },
      { label: 'Transport Allowance', amount: 3000 },
      { label: 'Medical Allowance', amount: 2000 },
      { label: 'Other Allowances', amount: 2000 },
    ],
    deductions: [
      { label: 'Provident Fund (PF)', amount: 3000 },
      { label: 'Professional Tax', amount: 200 },
      { label: 'Income Tax (TDS)', amount: 1500 },
      { label: 'Employee State Insurance', amount: 300 },
    ],
    summary: {
      grossEarnings: 50000,
      totalDeductions: 5000,
      netSalary: 45000,
    },
    workingDays: {
      total: 22,
      present: 21,
      absent: 1,
      leaves: 0,
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/employee/payroll')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Payslip - {payslip.month} {payslip.year}
            </h1>
            <p className="text-gray-600">Pay Period: {payslip.payPeriod}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-gray-100 rounded-lg transition" title="Print">
            <Printer size={20} className="text-gray-600" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Payslip Document */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none">
        {/* Company Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-bold text-2xl">S</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">SL Brothers Ltd</h2>
                <p className="text-blue-100 text-sm">123 Business Park, City - 123456</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Payslip for</p>
              <p className="font-bold text-lg">{payslip.month} {payslip.year}</p>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Employee Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-800">{payslip.employee.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="font-semibold text-gray-800">{payslip.employee.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building size={16} className="text-gray-400" />
                  <span className="text-gray-600">Department:</span>
                  <span className="font-semibold text-gray-800">{payslip.employee.department}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-600">Designation:</span>
                  <span className="font-semibold text-gray-800">{payslip.employee.designation}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">Pay Period:</span>
                  <span className="font-semibold text-gray-800">{payslip.payPeriod}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">Paid On:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(payslip.paidOn).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-gray-600">Bank A/C:</span>
                  <span className="font-semibold text-gray-800">{payslip.employee.bankAccount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-gray-600">PAN:</span>
                  <span className="font-semibold text-gray-800">{payslip.employee.pan}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Working Days Summary */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Attendance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{payslip.workingDays.total}</p>
              <p className="text-xs text-gray-500">Total Days</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl font-bold text-green-600">{payslip.workingDays.present}</p>
              <p className="text-xs text-gray-500">Present</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl font-bold text-red-600">{payslip.workingDays.absent}</p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{payslip.workingDays.leaves}</p>
              <p className="text-xs text-gray-500">Leaves</p>
            </div>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                Earnings
              </h3>
              <div className="space-y-3">
                {payslip.earnings.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-800">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3 bg-green-50 rounded-lg px-3 mt-4">
                  <span className="font-semibold text-green-700">Gross Earnings</span>
                  <span className="font-bold text-green-700 text-lg">{formatCurrency(payslip.summary.grossEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-2">
                <TrendingDown size={16} className="text-red-600" />
                Deductions
              </h3>
              <div className="space-y-3">
                {payslip.deductions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-red-600">-{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3 bg-red-50 rounded-lg px-3 mt-4">
                  <span className="font-semibold text-red-700">Total Deductions</span>
                  <span className="font-bold text-red-700 text-lg">-{formatCurrency(payslip.summary.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Net Salary (Take Home)</p>
              <p className="text-3xl font-bold">{formatCurrency(payslip.summary.netSalary)}</p>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">In Words</p>
              <p className="font-semibold">Forty-Five Thousand Rupees Only</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 text-center text-sm text-gray-500">
          <p>This is a computer-generated payslip and does not require a signature.</p>
          <p className="mt-1">For any queries, please contact HR at hr@slbrothers.co.uk</p>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetails;