export interface FeesBreakdown {
  brokerage_buy: number;
  brokerage_sell: number;
  stt: number;
  transaction: number;
  sebi: number;
  gst: number;
  stamp: number;
  dp: number;
  total: number;
  exchange: string;
}

export interface Trade {
  buy_time: string;
  buy_price: number;
  sell_time: string;
  sell_price: number;
  quantity: number;
  gross_pnl?: number;
  fees_total?: number;
  fees_breakdown?: FeesBreakdown;
  pnl: number;
}

export interface SignalPerformance {
  "avg_return_%": number;
  "std_dev_%": number;
  "win_rate_%": number;
}

export interface SignalPredictabilityData {
  count: number;
  performance: {
    ["1_candles"]: SignalPerformance;
    ["3_candles"]: SignalPerformance;
    ["5_candles"]: SignalPerformance;
    ["10_candles"]: SignalPerformance;
    ["20_candles"]: SignalPerformance;
  };
}

export interface TradePairsAnalysis {
  num_pairs: number;
  pnl_mean: number;
  pnl_std_dev: number;
  coefficient_of_variation: number;
  stability_score: number;
  autocorrelation: number;
  pattern_insight: string;
}

export interface SignalPredictability {
  buy_signals: SignalPredictabilityData;
  sell_signals: SignalPredictabilityData;
  overall_consistency: string;
  trade_pairs_analysis: TradePairsAnalysis;
}

export interface StrategyRatingBreakdown {
  "Win Rate": number;
  "Profit Factor": number;
  "Risk-Reward Ratio": number;
  "Expectancy": number;
  "Return Efficiency": number;
  "Drawdown Control": number;
  "Loss Size Control": number;
  "Exit (Sell) Quality": number;
  "Entry (Buy) Quality": number;
  "P&L Stability": number;
  "Sample Size Confidence": number;
}

export interface StrategyRating {
  overall_rating: number;
  rating_category: string;
  rating_1_to_10: string;
  breakdown: StrategyRatingBreakdown;
  key_strength: string;
  key_weakness: string;
  recommendation: string;
}

export interface BacktestSummary {
  "Total Trades": number;
  "Winning Trades": number;
  "Losing Trades": number;
  "Win Rate (%)": number;
  "Gross Profit (₹)": number;
  "Total Profit (₹)": number;
  "Total Fees (₹)": number;
  "Net Profit After Fees (₹)": number;
  "Ending Capital (₹)": number;
  "Overall Return (%)": number;
  "Duration (Days)": number;
  "Duration (Months)": number;
  "Average Win (₹)": number;
  "Average Loss (₹)": number;
  "Profit Factor": number;
  "Expectancy (₹)": number;
  "Max Drawdown (%)": number;
  "Risk-Reward Ratio": number;
}

export interface AdvancedKPIs {
  "Total Trades": number;
  "Winning Trades": number;
  "Losing Trades": number;
  "Win Rate %": number;
  "Total Profit": number;
  "Ending Capital": number;
  "Overall Return %": number;
  "Avg Win": number;
  "Avg Loss": number;
  "Profit Factor": number;
  "Risk/Reward": number;
  "Expectancy per Trade": number;
  "Max Drawdown": number;
  "Best Metric": string;
}

export interface BacktestResult {
  status: string;
  ticker: string;
  summary: BacktestSummary;
  advanced_kpis: AdvancedKPIs;
  signal_predictability: SignalPredictability;
  trades: Trade[];
  descriptive_report: string;
  strategy_rating: StrategyRating;
}

export interface AggregateSummary {
  total_stocks_analyzed: number;
  failed_stocks: number;
  total_trades_all_stocks: number;
  total_winning_trades: number;
  total_losing_trades: number;
  "aggregate_win_rate_%": number;
  total_profit_all_stocks: number;
  aggregate_ending_capital: number;
  "aggregate_return_%": number;
  initial_capital_per_stock: number;
  total_capital_deployed: number;
  failed_stocks_details: string[];
}

export interface BacktestResponse {
  status: string;
  data_source: string;
  total_stocks: number;
  successful_stocks: number;
  failed_stocks: number;
  results: BacktestResult[];
  aggregate_summary: AggregateSummary;
}
