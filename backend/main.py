from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

cache = {}
CACHE_TIME = 60

def get_cache(key):
    if key in cache:
        data, timestamp = cache[key]
        if time.time() - timestamp < CACHE_TIME:
            return data
    return None

def set_cache(key, data):
    cache[key] = (data, time.time())

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/market_overview")
def market_overview():
    cached = get_cache("market_overview")
    if cached:
        return cached
    symbols = {"Nifty 50": "^NSEI", "Sensex": "^BSESN", "Bank Nifty": "^NSEBANK"}
    result = []
    for name, symbol in symbols.items():
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.fast_info
            price = round(info.last_price, 2)
            prev = round(info.previous_close, 2)
            change = round(price - prev, 2)
            change_pct = round((change / prev) * 100, 2)
            result.append({"name": name, "symbol": symbol, "price": price, "change": change, "change_pct": change_pct})
        except:
            result.append({"name": name, "symbol": symbol, "price": 0, "change": 0, "change_pct": 0})
    set_cache("market_overview", result)
    return result

@app.get("/quote")
def quote(symbol: str):
    cached = get_cache(f"quote_{symbol}")
    if cached:
        return cached
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        fast = ticker.fast_info
        result = {
            "symbol": symbol,
            "name": info.get("longName", symbol),
            "price": round(fast.last_price, 2),
            "change": round(fast.last_price - fast.previous_close, 2),
            "change_pct": round(((fast.last_price - fast.previous_close) / fast.previous_close) * 100, 2),
            "volume": fast.three_month_average_volume,
            "high": round(fast.day_high, 2),
            "low": round(fast.day_low, 2),
            "week52_high": round(fast.fifty_two_week_high, 2),
            "week52_low": round(fast.fifty_two_week_low, 2),
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": info.get("trailingPE", 0),
            "eps": info.get("trailingEps", 0),
            "dividend_yield": info.get("dividendYield", 0),
        }
        set_cache(f"quote_{symbol}", result)
        return result
    except:
        return {"error": "Could not fetch data"}

@app.get("/history")
def history(symbol: str, period: str = "1mo"):
    cached = get_cache(f"history_{symbol}_{period}")
    if cached:
        return cached
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)
        result = [
            {"date": str(date.date()), "close": round(close, 2)}
            for date, close in zip(hist.index, hist["Close"])
        ]
        set_cache(f"history_{symbol}_{period}", result)
        return result
    except:
        return []

@app.get("/search")
def search(q: str):
    common_stocks = [
        {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "exchange": "NSE"},
        {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "exchange": "NSE"},
        {"symbol": "HDFCBANK.NS", "name": "HDFC Bank", "exchange": "NSE"},
        {"symbol": "INFY.NS", "name": "Infosys", "exchange": "NSE"},
        {"symbol": "ICICIBANK.NS", "name": "ICICI Bank", "exchange": "NSE"},
        {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever", "exchange": "NSE"},
        {"symbol": "SBIN.NS", "name": "State Bank of India", "exchange": "NSE"},
        {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance", "exchange": "NSE"},
        {"symbol": "WIPRO.NS", "name": "Wipro", "exchange": "NSE"},
        {"symbol": "AXISBANK.NS", "name": "Axis Bank", "exchange": "NSE"},
        {"symbol": "TITAN.NS", "name": "Titan Company", "exchange": "NSE"},
        {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "exchange": "NSE"},
        {"symbol": "MARUTI.NS", "name": "Maruti Suzuki", "exchange": "NSE"},
        {"symbol": "SUNPHARMA.NS", "name": "Sun Pharmaceutical", "exchange": "NSE"},
        {"symbol": "NTPC.NS", "name": "NTPC", "exchange": "NSE"},
        {"symbol": "ADANIENT.NS", "name": "Adani Enterprises", "exchange": "NSE"},
        {"symbol": "NIFTYBEES.NS", "name": "Nippon Nifty BeES ETF", "exchange": "NSE"},
    ]
    q = q.lower()
    return [s for s in common_stocks if q in s["symbol"].lower() or q in s["name"].lower()]

@app.get("/top_movers")
def top_movers():
    cached = get_cache("top_movers")
    if cached:
        return cached
    symbols = [
        "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS",
        "ICICIBANK.NS", "HINDUNILVR.NS", "SBIN.NS", "BAJFINANCE.NS",
        "WIPRO.NS", "AXISBANK.NS", "TITAN.NS", "KOTAKBANK.NS",
        "MARUTI.NS", "SUNPHARMA.NS", "NTPC.NS", "ADANIENT.NS", "NIFTYBEES.NS"
    ]
    movers = []
    for symbol in symbols:
        try:
            fast = yf.Ticker(symbol).fast_info
            price = round(fast.last_price, 2)
            prev = round(fast.previous_close, 2)
            change_pct = round(((price - prev) / prev) * 100, 2)
            movers.append({"symbol": symbol, "price": price, "change_pct": change_pct})
        except:
            pass
    movers.sort(key=lambda x: x["change_pct"], reverse=True)
    result = {"gainers": movers[:5], "losers": movers[-5:][::-1]}
    set_cache("top_movers", result)
    return result

@app.get("/news")
def news(symbol: str):
    cached = get_cache(f"news_{symbol}")
    if cached:
        return cached
    try:
        ticker = yf.Ticker(symbol)
        raw_news = ticker.news[:5]
        result = []
        for item in raw_news:
            content = item.get("content", {})
            result.append({
                "title": content.get("title", "No title"),
                "url": content.get("canonicalUrl", {}).get("url", "#"),
                "publisher": content.get("provider", {}).get("displayName", "Unknown"),
                "time": content.get("pubDate", "")
            })
        set_cache(f"news_{symbol}", result)
        return result
    except:
        return []