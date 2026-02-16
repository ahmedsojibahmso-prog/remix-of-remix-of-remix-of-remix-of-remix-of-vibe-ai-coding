import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Loader2 } from "lucide-react";

export default function AdminPayments() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("transactions").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setTransactions(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const success = transactions.filter(t => t.status === "success");
  const totalToday = success.filter(t => new Date(t.created_at).toDateString() === new Date().toDateString()).reduce((s, t) => s + t.amount_bdt, 0);
  const totalAll = success.reduce((s, t) => s + t.amount_bdt, 0);

  const statusColors: Record<string, string> = { success: "bg-success/10 text-success", pending: "bg-warning/10 text-warning", failed: "bg-destructive/10 text-destructive", refunded: "bg-info/10 text-info" };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary" />পেমেন্ট ও রেভিনিউ</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 gradient-bg text-primary-foreground"><CardContent className="pt-5"><p className="text-sm opacity-90">আজকের</p><p className="text-2xl font-bold">৳{totalToday.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5"><p className="text-sm text-muted-foreground">মোট</p><p className="text-2xl font-bold">৳{totalAll.toLocaleString()}</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5"><p className="text-sm text-muted-foreground">মোট ট্রানজেকশন</p><p className="text-2xl font-bold">{transactions.length}</p></CardContent></Card>
      </div>
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">ট্রানজেকশন</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">কোনো ট্রানজেকশন নেই</p>
          ) : transactions.map(txn => (
            <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium text-sm">৳{txn.amount_bdt}</p>
                <p className="text-xs text-muted-foreground">{txn.payment_method || "Unknown"} · {new Date(txn.created_at).toLocaleDateString("bn-BD")}</p>
              </div>
              <Badge className={statusColors[txn.status] || "bg-secondary"}>{txn.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
