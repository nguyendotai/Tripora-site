"use client";

import { TransactionsList } from "@/features/payment/components/transactions-list";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function TransactionsContent() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Lịch sử giao dịch</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Toàn bộ thanh toán, hoá đơn và hoàn tiền của bạn.
        </p>
        <TransactionsList />
      </div>
    </main>
  );
}

export default function TransactionsPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <TransactionsContent />
      </RequireAuth>
      <Footer />
    </>
  );
}
