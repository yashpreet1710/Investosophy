 
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export const getHealth = () => api.get('/health')

export const getMarketOverview = () => api.get('/market_overview')

export const getQuote = (symbol) => api.get(`/quote?symbol=${symbol}`)

export const getHistory = (symbol, period = '1mo') =>
  api.get(`/history?symbol=${symbol}&period=${period}`)

export const searchStocks = (q) => api.get(`/search?q=${q}`)

export const getTopMovers = () => api.get('/top_movers')

export const getNews = (symbol) => api.get(`/news?symbol=${symbol}`)