"use client";

// ============================================================
// Employee Info Card — Flat design, no emojis
// ============================================================

import { Mail, Phone, IdCard, Calendar, User } from "lucide-react";
import type { Employee } from "@/types";

interface EmployeeInfoCardProps {
  employee: Employee;
}

function Row({
  icon: Icon,
  label,
  value,
  iconBg = "bg-muted text-muted-foreground",
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  iconBg?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
        <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <div className="text-sm text-foreground font-medium break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

export function EmployeeInfoCard({ employee }: EmployeeInfoCardProps) {
  const formattedDob = employee.date_of_birth
    ? new Date(employee.date_of_birth).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white border border-border rounded-xl animate-fade-in">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
        <p className="text-xs font-semibold text-foreground uppercase tracking-widest">
          Employee Profile
        </p>
        <span
          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
            employee.is_active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {employee.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Rows */}
      <div className="px-4 pb-1">
        <Row
          icon={User}
          label="Full Name"
          value={employee.full_name}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <Row
          icon={IdCard}
          label="Employee ID"
          value={
            <span className="font-mono text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold inline-block">
              {employee.employee_id}
            </span>
          }
          iconBg="bg-blue-50 text-blue-600"
        />
        <Row
          icon={Mail}
          label="Email"
          value={
            <a
              href={`mailto:${employee.personal_email}`}
              className="text-primary hover:underline underline-offset-2 text-xs break-all"
            >
              {employee.personal_email}
            </a>
          }
          iconBg="bg-amber-50 text-amber-600"
        />
        {employee.contact_number && (
          <Row
            icon={Phone}
            label="Contact"
            value={
              <a href={`tel:${employee.contact_number}`} className="hover:text-primary transition-colors">
                {employee.contact_number}
              </a>
            }
            iconBg="bg-teal-50 text-teal-600"
          />
        )}
        {employee.gender && (
          <Row icon={User} label="Gender" value={employee.gender} iconBg="bg-purple-50 text-purple-600" />
        )}
        {formattedDob && (
          <Row icon={Calendar} label="Date of Birth" value={formattedDob} iconBg="bg-rose-50 text-rose-600" />
        )}
      </div>
    </div>
  );
}
