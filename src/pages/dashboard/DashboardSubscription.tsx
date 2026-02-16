import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2, Download, Shield, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";

const included = [
  "সকল মডিউল + ভবিষ্যত আপডেট",
  "কমিউনিটি অ্যাক্সেস",
  "বোনাস ম্যাটেরিয়াল (৳৫৮,০০০+)",
  "কোর্স সার্টিফিকেট",
  "১:১ মেন্টরশিপ",
  "লাইভ ক্লাস অ্যাক্সেস",
];

const transactions = [
  { id: "TXN-001", date: "১০ ফেব, ২০২৬", amount: "৳৯৯৯", method: "bKash", status: "success" },
];

export default function DashboardSubscription() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary" />সাবস্ক্রিপশন</h1>
        <p className="text-muted-foreground text-sm mt-1">আপনার সাবস্ক্রিপশন ও পেমেন্ট তথ্য</p>
      </div>

      {/* Lifetime Access Card */}
      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className="gradient-bg p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Infinity className="h-6 w-6" />
                <Badge className="bg-primary-foreground/20 text-primary-foreground">LIFETIME ACCESS</Badge>
              </div>
              <h2 className="text-2xl font-bold">TECH VIBE Pro</h2>
              <p className="text-sm opacity-90 mt-1">কেনার তারিখ: ১০ ফেব, ২০২৬</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">৳৯৯৯</p>
              <p className="text-sm opacity-90">এককালীন পেমেন্ট</p>
            </div>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-success" />
            <span className="font-semibold text-success">LIFETIME অ্যাক্সেস - কোনো মেয়াদ নেই</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {included.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">পেমেন্ট হিস্টরি</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium text-sm">{txn.id}</p>
                  <p className="text-xs text-muted-foreground">{txn.date} · {txn.method}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{txn.amount}</span>
                  <Badge className="bg-success/10 text-success">সফল</Badge>
                  <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
