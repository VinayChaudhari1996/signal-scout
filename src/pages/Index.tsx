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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif text-foreground">
                Stock Screener
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time trading signals & market insights
              </p>
            </div>
            {scanData && (
              <Badge variant="outline" className="text-xs font-mono">
                <Clock className="w-3 h-3 mr-1" />
                {scanData.scan_time}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Scan Stocks</CardTitle>
            <CardDescription>
              Enter stock tickers to scan for trading signals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="e.g., WIPRO, RELIANCE, HAL"
                value={tickers}
                onChange={(e) => setTickers(e.target.value)}
                className="font-mono"
                disabled={scanMutation.isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleScan();
                  }
                }}
              />
              <Button
                className="min-w-[120px]"
                onClick={handleScan}
                disabled={scanMutation.isPending}
              >
                {scanMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Scan
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Separate multiple tickers with commas
            </p>
          </CardContent>
        </Card>

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Trading Signals</CardTitle>
              <CardDescription>
                {scanData.total_signals_found} signals found from{" "}
                {scanData.data_source}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-6">
                  <TabsTrigger value="all">
                    All Signals ({scanData.signals.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="buy"
                    className="data-[state=active]:text-success"
                  >
                    Buy ({buySignals.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="sell"
                    className="data-[state=active]:text-danger"
                  >
                    Sell ({sellSignals.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <SignalsTable signals={filteredSignals} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!scanData && !scanMutation.isPending && (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Ready to scan stocks
                </h3>
                <p className="text-muted-foreground">
                  Enter stock tickers above and click Scan to get started
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
