"use client";

import { getItemDetails } from "@/handlers/item";
import type { Item } from "@/types/item";
import type { Transaction } from "@/types/transaction";
import { CheckCircle, Calendar, MapPin, Package, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function TransactionCard({
  transaction,
}: {
  transaction: Transaction;
}) {
  const initialSteps = [
    {
      id: "pending_confirmation",
      label: "Requested",
      step: 1,
      completed: false,
      current: false,
    },
    {
      id: "pending_pickup",
      label: "Confirmed",
      step: 2,
      completed: false,
      current: false,
    },
    {
      id: "assigned_pickup",
      label: "Picked Up",
      step: 3,
      completed: false,
      current: false,
    },
    {
      id: "picked_up",
      label: "On the Way",
      step: 4,
      completed: false,
      current: false,
    },
    {
      id: "completed",
      label: "Complete",
      step: 5,
      completed: false,
      current: false,
    },
  ];

  const [deliverySteps, setDeliverySteps] = useState(initialSteps);
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (!transaction) return;

    const currentIndex = initialSteps.findIndex(
      (s) => s.id === transaction.status
    );

    const updatedSteps = initialSteps.map((step, index) => ({
      ...step,
      completed: index < currentIndex,
      current: index === currentIndex,
    }));

    setDeliverySteps(updatedSteps);
  }, [transaction]);

  useEffect(() => {
    async function fetchItemDetails() {
      if (transaction) {
        const item = await getItemDetails(transaction.item_id);
        setItem(item);
      }
    }
    fetchItemDetails();
  }, [transaction]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      case "pending_confirmation":
        return "text-yellow-400";
      default:
        return "text-blue-400";
    }
  };

  return (
    <div className="bg-transparent border border-gray-700 rounded-xl p-4 sm:p-6 shadow-lg w-full">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6">
        <div className="flex gap-3 sm:gap-4 w-full lg:w-1/3">
          <div className="flex-shrink-0">
            <img
              src={
                item?.image_url ||
                "/placeholder.svg?height=80&width=80&query=waste item"
              }
              alt={item?.name || "Item"}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg object-cover border border-gray-600"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-1 truncate">
              {item?.name || "Loading..."}
            </h2>
            <div className="space-y-1">
              <p className="text-lg sm:text-xl font-bold text-green-400">
                Rp{" "}
                {(
                  transaction.weight * transaction.curr_buyer_price
                ).toLocaleString("id-ID")}
              </p>
              <p className="text-xs sm:text-sm text-gray-300">
                {transaction.weight} kg × Rp{" "}
                {transaction.curr_buyer_price.toLocaleString("id-ID")}/kg
              </p>
              {transaction.is_donation && (
                <span className="inline-block px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                  Donation
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Submitted: {formatDate(transaction.submitted_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4" />
            <span className="truncate">
              {transaction.pick_up_location.address},{" "}
              {transaction.pick_up_location.city}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Package className="w-4 h-4" />
            <span
              className={`font-medium ${getStatusColor(transaction.status)}`}>
              {transaction.status.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          {transaction.status_notes && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-300 leading-relaxed">
                {transaction.status_notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {transaction.status !== "completed" && (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-4">
            Delivery Progress
          </h3>

          <div className="hidden sm:flex items-center justify-between gap-2">
            {deliverySteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : step.current
                        ? "bg-white border-white text-gray-800"
                        : "border-white/30 text-white/50"
                    }`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                    ) : (
                      <span className="text-sm lg:text-base font-bold">
                        {step.step}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs lg:text-sm mt-2 text-center transition-colors duration-300 ${
                      step.completed || step.current
                        ? "text-white"
                        : "text-white/50"
                    }`}>
                    {step.label}
                  </span>
                </div>
                {index < deliverySteps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                      step.completed ? "bg-green-500" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="sm:hidden space-y-3 mt-2">
            {deliverySteps.map((step, _) => (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300 ${
                    step.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : step.current
                      ? "bg-white border-white text-gray-800"
                      : "border-white/30 text-white/50"
                  }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{step.step}</span>
                  )}
                </div>
                <div className="flex-1">
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      step.completed || step.current
                        ? "text-white font-medium"
                        : "text-white/50"
                    }`}>
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(transaction.assigned_at ||
        transaction.picked_up_at ||
        transaction.completed_at) && (
        <div className="border-t border-gray-700 pt-4 mt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {transaction.assigned_at && (
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-3 h-3" />
                <span>Assigned: {formatDate(transaction.assigned_at)}</span>
              </div>
            )}
            {transaction.picked_up_at && (
              <div className="flex items-center gap-2 text-gray-300">
                <Package className="w-3 h-3" />
                <span>Picked up: {formatDate(transaction.picked_up_at)}</span>
              </div>
            )}
            {transaction.completed_at && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Completed: {formatDate(transaction.completed_at)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
