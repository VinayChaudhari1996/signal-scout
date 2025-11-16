import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Search, Clock, Target, Shield } from "lucide-react";
import { SignalCard } from "@/components/SignalCard";
import { StatsCard } from "@/components/StatsCard";

// Sample data based on the provided API response
const sampleData = {
  status: "success",
  total_time_seconds: 2.41,
  data_source: "Zerodha KiteConnect",
  scan_time: "12/11/2025 14:30:00 IST",
  total_stocks_scanned: 2,
  total_signals_found: 2,
  buy_signals_count: 1,
  sell_signals_count: 1,
  signals: [
    {
      ticker: "WIPRO",
      action: "BUY" as const,
      current_price: 245.39,
      entry_price: 245.40,
      stop_loss: 240.0,
      target_price: 255.0,
      confidence: "HIGH",
      freshness: "FRESH",
      risk_reward: 2.0,
      hours_since_signal: 0.5,
      price_diff: 0.01,
      signal_time_ist: "12/11/2025 14:30 IST",
      timestamp: "12/11/2025 14:30:00 IST"
    },
    {
      ticker: "HAL",
      action: "SELL" as const,
      current_price: 240.39,
      entry_price: 245.40,
      stop_loss: 250.0,
      target_price: 230.0,
      confidence: "HIGH",
      freshness: "FRESH",
      risk_reward: 2.0,
      hours_since_signal: 0.5,
      price_diff: -5.01,
      signal_time_ist: "12/11/2025 11:30 IST",
      timestamp: "12/11/2025 11:30:00 IST"
    }
  ]
};

const Index = () => {
  const [tickers, setTickers] = useState("WIPRO, RELIANCE, HAL");
  const [activeTab, setActiveTab] = useState("all");
  
  const buySignals = sampleData.signals.filter(s => s.action === "BUY");
  const sellSignals = sampleData.signals.filter(s => s.action === "SELL");
  
  const filteredSignals = activeTab === "buy" 
    ? buySignals 
    : activeTab === "sell" 
    ? sellSignals 
    : sampleData.signals;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif text-foreground">Stock Screener</h1>
              <p className="text-sm text-muted-foreground mt-1">Real-time trading signals & market insights</p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              <Clock className="w-3 h-3 mr-1" />
              {sampleData.scan_time}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Scan Stocks</CardTitle>
            <CardDescription>Enter stock tickers to scan for trading signals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="e.g., WIPRO, RELIANCE, HAL"
                value={tickers}
                onChange={(e) => setTickers(e.target.value)}
                className="font-mono"
              />
              <Button className="min-w-[120px]">
                <Search className="w-4 h-4 mr-2" />
                Scan
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Separate multiple tickers with commas
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Scanned"
            value={sampleData.total_stocks_scanned}
            icon={Search}
          />
          <StatsCard
            title="Buy Signals"
            value={sampleData.buy_signals_count}
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="Sell Signals"
            value={sampleData.sell_signals_count}
            icon={TrendingDown}
            variant="danger"
          />
          <StatsCard
            title="Scan Time"
            value={`${sampleData.total_time_seconds}s`}
            icon={Clock}
          />
        </div>

        {/* Signals Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Trading Signals</CardTitle>
            <CardDescription>
              {sampleData.total_signals_found} signals found from {sampleData.data_source}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-6">
                <TabsTrigger value="all">All Signals</TabsTrigger>
                <TabsTrigger value="buy" className="data-[state=active]:text-success">
                  Buy ({buySignals.length})
                </TabsTrigger>
                <TabsTrigger value="sell" className="data-[state=active]:text-danger">
                  Sell ({sellSignals.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                {filteredSignals.length > 0 ? (
                  filteredSignals.map((signal, index) => (
                    <SignalCard key={`${signal.ticker}-${index}`} signal={signal} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No signals found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
