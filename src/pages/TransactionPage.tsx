import { LoadingSpinner } from "@/components/SmallComponents";
import TransactionCard from "@/components/TransactionCard";
import { listenToTransactionsByUserId } from "@/handlers/transaction";
import { useAuthUser } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function TransactionPage() {
  const { loading, user, userProfile } = useAuthUser({
    redirectIfNoUser: true,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }

    if (!user || !userProfile || loading) return;
  }, [user, loading]);

  useEffect(() => {
    if (!userProfile) return;

    const unsubscribe = listenToTransactionsByUserId(
      userProfile.uid,
      userProfile?.role,
      setTransactions
    );

    return () => unsubscribe();
  }, [userProfile]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="w-screen min-h-screen bg-main-white flex flex-col justify-center items-center">
        <div className="mt-30 mb-20">
          <h1 className="text-6xl text-gray-800 font-semibold text-center not-md:text-4xl">
            Your Transactions, All in One Place.
          </h1>
        </div>
        <div className="flex flex-col items-center gap-y-8 bg-main w-[calc(100%-200px)] p-2 my-10 rounded-2xl">
          <p className="justify-left w-full text-white pl-2 text-xl font-semibold pt-1">
            ONGOING
          </p>

          {transactions.filter((t) => t.status !== "completed").length === 0 ? (
            <p className="text-white">No ongoing transactions yet.</p>
          ) : (
            transactions
              .filter((t) => t.status !== "completed")
              .map((t) => <TransactionCard transaction={t} />)
          )}
        </div>
        <div className="flex flex-col items-center gap-y-8 bg-main/70 w-[calc(100%-200px)] p-2 my-10 rounded-2xl">
          <p className="justify-left w-full text-white pl-2 text-xl font-semibold pt-1">
            COMPLETED
          </p>
          {transactions.filter((t) => t.status === "completed").length === 0 ? (
            <p className="text-white">No completed transactions yet.</p>
          ) : (
            transactions
              .filter((t) => t.status === "completed")
              .map((t) => <TransactionCard transaction={t} />)
          )}
        </div>
      </div>
    </>
  );
}
