import { useEffect, useState } from "react";
import { usePumpPortal } from "../../../lib/hooks/usePumpPortal";
import type { Transaction } from "../../../types";

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const { onTransaction } = usePumpPortal();

    useEffect(() => {
        const unsubscribe = onTransaction((tx: Transaction) => {
            setTransactions((prev) => [tx, ...prev]);
        });
        return () => unsubscribe();
    }, [onTransaction]);

    return transactions;
};

