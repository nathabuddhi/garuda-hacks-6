"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useAuthUser } from "@/lib/utils";
import { LoadingSpinner } from "@/components/SmallComponents";
import { listenToTransactionsByUserId } from "@/handlers/transaction";
import type { Transaction } from "@/types/transaction";
import TransactionCard from "@/components/TransactionCard";

export default function DashboardPage() {
  const { user, loading, userProfile } = useAuthUser({
    redirectIfNoUser: true,
  });

  const [currentDate] = useState(new Date());
  const [wasteDeliveries, setWasteDeliveries] = useState<Transaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [latestDelivery, setLatestDelivery] = useState<Transaction | null>(
    null
  );

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/";
    }
  }, [user, loading]);

  useEffect(() => {
    if (loading || !userProfile) return;

    const unsubscribe = listenToTransactionsByUserId(
      userProfile.uid,
      userProfile?.role,
      setTransactions
    );

    return () => unsubscribe();
  }, [userProfile, loading]);

  useEffect(() => {
    setWasteDeliveries(transactions);
    if (!transactions || transactions.length === 0) return;

    const latest = transactions.reduce((latest, current) => {
      const latestTime = latest.submitted_at?.toMillis?.() ?? 0;
      const currentTime = current.submitted_at?.toMillis?.() ?? 0;
      return currentTime > latestTime ? current : latest;
    });

    setLatestDelivery(latest);
  }, [transactions]);

  const [userBalance] = useState(150000);
  const formatDate = (date: Date) => {
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return {
      dayName: days[date.getDay()],
      day: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear(),
    };
  };

  const dateInfo = formatDate(currentDate);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-[#FCF2E1] flex items-center justify-center">
        <Card className="bg-[#F1E6D0] border-2 border-[#7E8257]/20 shadow-lg p-8">
          <div className="text-center">
            <p className="text-[#525837] font-medium mb-4">
              Unable to load dashboard
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#525837] hover:bg-[#7E8257] text-white">
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const SellerDashboard = () => (
    <div className="space-y-6 lg:space-y-8 pt-20">
      <Card className="bg-[#F1E6D0] border-2 border-[#7E8257]/20 shadow-lg">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <Card className="bg-[#525837] text-white">
              <CardContent className="p-4 sm:p-6">
                <div className="text-sm sm:text-base font-medium opacity-90 mb-1">
                  {dateInfo.dayName},
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                    {dateInfo.day}
                  </span>
                  <span className="text-lg sm:text-xl opacity-90">
                    {dateInfo.month} {dateInfo.year}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-[#7E8257]/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">YOUR BALANCE</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#525837]">
                      Rp {userBalance.toLocaleString()}
                    </p>
                  </div>
                  <Button className="bg-[#7E8257] hover:bg-[#525837] text-white px-6 py-2 rounded-lg font-medium w-full sm:w-auto">
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold mb-6 text-center">
            LATEST WASTE TRANSACTION STATUS
          </h3>
          <div className="bg-main rounded-xl not-md:hidden">
            {latestDelivery && <TransactionCard transaction={latestDelivery} />}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#F1E6D0] border-2 border-[#7E8257]/20 shadow-lg">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#525837] italic">
                Ready to turn your waste into something meaningful?
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Join thousands of households making a real impact — one item at
                a time.
              </p>
              <Button
                onClick={() => (window.location.href = "/marketplace")}
                className="bg-[#525837] hover:bg-[#7E8257] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 w-full sm:w-auto">
                Start Selling Today
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="/seller_card.png"
                alt="Seller illustration"
                className="w-full max-w-sm lg:max-w-md object-contain"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BuyerDashboard = () => (
    <div className="space-y-6 lg:space-y-8 pt-20">
      <Card className="bg-[#F1E6D0] border-2 border-[#7E8257]/20 shadow-lg">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <Card className="bg-[#525837] text-white mb-6">
            <CardContent className="p-4 sm:p-6 text-center">
              <h2 className="text-lg sm:text-xl font-semibold">
                {dateInfo.dayName}, {dateInfo.day}{" "}
                {dateInfo.month.toUpperCase()} {dateInfo.year}
              </h2>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            <div className="xl:col-span-2">
              <Card className="bg-white border-2 border-[#7E8257]/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-[#525837]">
                    Waste Deliveries Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-600 justify-between">
                    <span>Items</span>
                    <span className="text-center">Status</span>
                  </div>

                  <div className="space-y-2 mt-4">
                    {wasteDeliveries.map((delivery) => (
                      <div className="grid grid-cols-2 gap-4 py-2 text-sm">
                        <span className="text-gray-800 font-semibold">
                          {delivery.item_name + " - " + delivery.weight + " kg"}
                        </span>
                        <div className="flex justify-center">
                          <Badge
                            variant="secondary"
                            className="bg-[#7E8257]/10 text-[#525837] border border-[#7E8257]/20">
                            {delivery.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#F1E6D0] border-2 border-[#7E8257]/20 shadow-lg">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#525837] italic">
                Wanna Review Your Waste Transactions?
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Take a look at your ongoing and completed transactions.
              </p>
              <Button
                onClick={() => (window.location.href = "/transactions")}
                className="bg-[#525837] hover:bg-[#7E8257] text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto">
                Browse Transaction
              </Button>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="/buyer_card.png"
                alt="Buyer illustration"
                className="w-full max-w-sm lg:max-w-md object-contain"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#FCF2E1] py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-4 lg:mb-6">
            <p className="text-lg sm:text-xl text-[#7E8257] font-medium mt-20">
              Welcome back, {userProfile.username || "User"}! 👋
            </p>
          </div>

          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#525837] leading-tight">
              Ready to turn yesterday's waste into
              <br className="hidden sm:block" />
              <span className="inline-block mt-2">tomorrow's good?</span>
            </h1>
          </div>

          {userProfile.role === "seller" ? (
            <SellerDashboard />
          ) : (
            <BuyerDashboard />
          )}
        </div>
      </div>
    </>
  );
}
