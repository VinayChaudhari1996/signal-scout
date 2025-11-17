import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Search, Clock, Loader2, AlertCircle } from "lucide-react";
import { SignalsTable } from "@/components/SignalsTable";
import { StatsCard } from "@/components/StatsCard";
import { toast } from "sonner";

interface Signal {
  ticker: string;
  action: "BUY" | "SELL";
  current_price: number;
  entry_price: number;
  stop_loss: number;
  target_price: number;
  confidence: string;
  freshness: string;
  risk_reward: number;
  hours_since_signal: number;
  price_diff: number;
  signal_time_ist: string;
  timestamp: string;
}

interface ScanResponse {
  status: string;
  total_time_seconds: number;
  data_source: string;
  scan_time: string;
  total_stocks_scanned: number;
  total_signals_found: number;
  buy_signals_count: number;
  sell_signals_count: number;
  signals: Signal[];
}

const API_URL = "http://localhost:8000";

const scanStocks = async (tickers: string[]): Promise<ScanResponse> => {
  const response = await fetch(`${API_URL}/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tickers,
      period_days: 90,
      interval: "60minute",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to scan stocks: ${response.statusText}`);
  }

  return response.json();
};

const Index = () => {
  const [tickers, setTickers] = useState("WIPRO, RELIANCE, HAL");
  const [activeTab, setActiveTab] = useState("all");
  const [scanData, setScanData] = useState<ScanResponse | null>(null);

  const scanMutation = useMutation({
    mutationFn: (tickerList: string[]) => scanStocks(tickerList),
    onSuccess: (data) => {
      setScanData(data);
      toast.success(`Scan completed! Found ${data.total_signals_found} signals`);
    },
    onError: (error: Error) => {
      toast.error(`Scan failed: ${error.message}`);
      console.error("Scan error:", error);
    },
  });

  const handleScan = () => {
    const tickerList = tickers
      .split(",")
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    if (tickerList.length === 0) {
      toast.error("Please enter at least one ticker");
      return;
    }

    scanMutation.mutate(tickerList);
  };

  const buySignals = scanData?.signals.filter((s) => s.action === "BUY") || [];
  const sellSignals = scanData?.signals.filter((s) => s.action === "SELL") || [];

  const filteredSignals =
    activeTab === "buy"
      ? buySignals
      : activeTab === "sell"
      ? sellSignals
      : scanData?.signals || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-[17px] font-semibold tracking-tight text-foreground">
              Stock Screener
            </h1>
            {scanData && (
              <span className="text-[13px] text-muted-foreground">
                {scanData.scan_time}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        {/* Search Section */}
        <div className="mb-6 bg-card rounded-xl border border-border/50 p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter tickers (e.g., WIPRO, RELIANCE, HAL)"
              value={tickers}
              onChange={(e) => setTickers(e.target.value)}
              className="font-mono text-[13px] h-9 border-border/50"
              disabled={scanMutation.isPending}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleScan();
                }
              }}
            />
            <Button
              className="h-9 px-4 text-[13px] font-medium"
              onClick={handleScan}
              disabled={scanMutation.isPending}
            >
              {scanMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Scanning
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 mr-1.5" />
                  Scan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {scanMutation.isError && (
          <Card className="mb-8 border-danger">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-danger">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Scan Failed</p>
                  <p className="text-sm text-muted-foreground">
                    {scanMutation.error?.message || "An error occurred"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        {scanData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <StatsCard
              title="Total Scanned"
              value={scanData.total_stocks_scanned}
              icon={Search}
            />
            <StatsCard
              title="Buy Signals"
              value={scanData.buy_signals_count}
              icon={TrendingUp}
              variant="success"
            />
            <StatsCard
              title="Sell Signals"
              value={scanData.sell_signals_count}
              icon={TrendingDown}
              variant="danger"
            />
            <StatsCard
              title="Scan Time"
              value={`${scanData.total_time_seconds}s`}
              icon={Clock}
            />
          </div>
        )}

        {/* Signals Section */}
        {scanData && (
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50">
              <h2 className="text-[15px] font-semibold text-foreground">
                Trading Signals
              </h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {scanData.total_signals_found} signals from {scanData.data_source}
              </p>
            </div>
            <div className="p-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="h-8 bg-muted/50 p-0.5 mb-4">
                  <TabsTrigger value="all" className="text-[13px] h-7 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    All ({scanData.signals.length})
                  </TabsTrigger>
                  <TabsTrigger value="buy" className="text-[13px] h-7 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Buy ({buySignals.length})
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="text-[13px] h-7 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Sell ({sellSignals.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <SignalsTable signals={filteredSignals} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!scanData && !scanMutation.isPending && (
          <div className="bg-card rounded-xl border border-border/50 p-12">
            <div className="text-center">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="text-[15px] font-semibold mb-1">
                Ready to scan stocks
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Enter stock tickers above and click Scan to get started
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
