"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Inbox } from "lucide-react";
import { useAuthUser } from "@/lib/utils";
import { LoadingSpinner } from "@/components/SmallComponents";

interface WasteDelivery {
  id: string;
  item: string;
  user: string;
  status: "On Going" | "Completed" | "Pending";
  date: string;
}

interface InboxMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  date: string;
}

export default function DashboardPage() {
  const { user, loading, userProfile } = useAuthUser({
    redirectIfNoUser: true,
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [wasteDeliveries] = useState<WasteDelivery[]>([
    {
      id: "1",
      item: "Used Palm Oil 30 Liter",
      user: "@JaneDoe",
      status: "On Going",
      date: "2025-01-25",
    },
    {
      id: "2",
      item: "Used Palm Oil 30 Liter",
      user: "@JaneDoe",
      status: "On Going",
      date: "2025-01-25",
    },
    {
      id: "3",
      item: "Used Palm Oil 30 Liter",
      user: "@JaneDoe",
      status: "On Going",
      date: "2025-01-25",
    },
    {
      id: "4",
      item: "Used Palm Oil 30 Liter",
      user: "@JaneDoe",
      status: "On Going",
      date: "2025-01-25",
    },
  ]);

  const [inboxMessages] = useState<InboxMessage[]>([
    {
      id: "1",
      sender: "Jane Doe",
      message: "I'd like to request ...",
      time: "21:07",
      date: "Thurs",
    },
    {
      id: "2",
      sender: "Jane Doe",
      message: "I'd like to request ...",
      time: "21:07",
      date: "Thurs",
    },
    {
      id: "3",
      sender: "Jane Doe",
      message: "I'd like to request ...",
      time: "21:07",
      date: "Thurs",
    },
    {
      id: "4",
      sender: "Jane Doe",
      message: "I'd like to request ...",
      time: "21:07",
      date: "Thurs",
    },
    {
      id: "5",
      sender: "Jane Doe",
      message: "I'd like to request ...",
      time: "21:07",
      date: "Thurs",
    },
    {
      id: "6",
      sender: "Jane Doe",
      message: "I'd like to request ...",
      time: "21:07",
      date: "Thurs",
    },
  ]);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/";
    }
  }, [user, loading]);

  const [userBalance] = useState(150000);

  const deliverySteps = [
    { id: 1, label: "Requested", completed: true },
    { id: 2, label: "Confirmed", completed: false, current: true },
    { id: 3, label: "Picked Up", completed: false },
    { id: 4, label: "On the Way", completed: false },
    { id: 5, label: "Complete", completed: false },
  ];

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

          <Card className="bg-[#7E8257] text-white">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-6 text-center">
                WASTE DELIVERY STATUS
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2 mb-6">
                {deliverySteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 sm:gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 ${
                          step.completed
                            ? "bg-green-500 border-green-500"
                            : step.current
                            ? "bg-white border-white text-[#7E8257]"
                            : "border-white/50"
                        }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <span className="text-sm sm:text-base font-bold">
                            {step.id}
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm mt-2 text-center">
                        {step.label}
                      </span>
                    </div>

                    {index < deliverySteps.length - 1 && (
                      <div className="hidden sm:block w-8 lg:w-16 h-0.5 bg-white/30 mx-2 ml-10 mb-5" />
                    )}
                  </div>
                ))}
              </div>

              <p className="text-center text-sm opacity-90">
                Current Status: Requesting Waste Delivery
              </p>
            </CardContent>
          </Card>
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

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <Card className="bg-white border-2 border-[#7E8257]/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-[#525837]">
                    Waste Deliveries Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                    <span>Items</span>
                    <span className="text-center">User</span>
                    <span className="text-center">Status</span>
                  </div>

                  <div className="space-y-3 mt-4">
                    {wasteDeliveries.map((delivery) => (
                      <div
                        key={delivery.id}
                        className="grid grid-cols-3 gap-4 py-2 text-sm">
                        <span className="text-gray-800">{delivery.item}</span>
                        <span className="text-center text-[#525837] font-medium">
                          {delivery.user}
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

            <div className="xl:col-span-1">
              <Card className="bg-white border-2 border-[#7E8257]/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-[#525837] flex items-center gap-2">
                    <Inbox className="w-5 h-5" />
                    Inbox
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {inboxMessages.map((message) => (
                      <div
                        key={message.id}
                        className="flex justify-between items-start gap-3 py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate">
                            {message.sender}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {message.message}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">
                            {message.date}
                          </p>
                          <p className="text-xs text-gray-500">
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 text-[#525837] border-[#7E8257] hover:bg-[#7E8257]/10 bg-transparent">
                    View Request Details
                  </Button>
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
                onClick={() => (window.location.href = "/transaction")}
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
        </div>
      </div>
    </>
  );
}
