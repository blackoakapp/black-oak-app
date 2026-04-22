import * as React from "react";
import { 
  collection, query, where, onSnapshot, orderBy, 
  addDoc, updateDoc, deleteDoc, doc, limit, 
  startAfter, getDocs, QueryDocumentSnapshot, DocumentData
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/src/firebase";
import { useAuth } from "../auth/AuthContext";
import { Trade } from "@/src/types";

interface TradeContextType {
  trades: Trade[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  addTrade: (trade: Omit<Trade, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTrade: (id: string, trade: Partial<Trade>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  refreshTrades: () => Promise<void>;
  fetchAllTrades: () => Promise<Trade[]>;
}

const PAGE_SIZE = 20;

const TradeContext = React.createContext<TradeContextType>({
  trades: [],
  loading: true,
  hasMore: false,
  loadMore: async () => {},
  addTrade: async () => {},
  updateTrade: async () => {},
  deleteTrade: async () => {},
  refreshTrades: async () => {},
  fetchAllTrades: async () => [],
});

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [trades, setTrades] = React.useState<Trade[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lastDoc, setLastDoc] = React.useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = React.useState(true);

  const fetchTrades = React.useCallback(async (isNextPage = false) => {
    if (!user) return;
    
    const path = "trades";
    try {
      let q = query(
        collection(db, path),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (isNextPage && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const newTrades = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trade[];

      if (isNextPage) {
        setTrades(prev => [...prev, ...newTrades]);
      } else {
        setTrades(newTrades);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  }, [user, lastDoc]);

  React.useEffect(() => {
    if (!user) {
      setTrades([]);
      setLoading(false);
      setHasMore(false);
      return;
    }

    // Initial fetch
    setLoading(true);
    fetchTrades();
  }, [user]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await fetchTrades(true);
  };

  const refreshTrades = async () => {
    setLoading(true);
    setLastDoc(null);
    await fetchTrades();
  };

  const fetchAllTrades = React.useCallback(async () => {
    if (!user) return [];
    const path = "trades";
    try {
      const q = query(
        collection(db, path),
        where("userId", "==", user.uid),
        orderBy("createdAt", "asc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trade[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }, [user]);

  const addTrade = async (tradeData: Omit<Trade, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const path = "trades";
    try {
      // Filter out undefined values
      const cleanData = Object.fromEntries(
        Object.entries(tradeData).filter(([_, v]) => v !== undefined)
      );
      await addDoc(collection(db, path), {
        ...cleanData,
        userId: user.uid,
        createdAt: Date.now(),
      });
      // Refresh to show new trade
      await refreshTrades();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateTrade = async (id: string, tradeData: Partial<Trade>) => {
    const path = `trades/${id}`;
    try {
      // Filter out undefined values
      const cleanData = Object.fromEntries(
        Object.entries(tradeData).filter(([_, v]) => v !== undefined)
      );
      await updateDoc(doc(db, "trades", id), cleanData);
      setTrades(prev => prev.map(t => t.id === id ? { ...t, ...cleanData } : t));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteTrade = async (id: string) => {
    const path = `trades/${id}`;
    try {
      await deleteDoc(doc(db, "trades", id));
      setTrades(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <TradeContext.Provider value={{ 
      trades, 
      loading, 
      hasMore, 
      loadMore, 
      addTrade, 
      updateTrade, 
      deleteTrade,
      refreshTrades,
      fetchAllTrades
    }}>
      {children}
    </TradeContext.Provider>
  );
}

export const useTrades = () => React.useContext(TradeContext);
