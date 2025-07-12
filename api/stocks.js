// api/stocks.js
import { createClient } from '@supabase/supabase-js';
import { fullTickerNameMap } from '../lib/stock-data';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


export default async function handler(request, response) {
    const { searchParams } = new URL(request.url, `https://` + request.headers.host);
    const ticker = searchParams.get('ticker');
    const sector = searchParams.get('sector');

    if (ticker) {
        try {
            const data = await fetchSingleStockData(ticker);
            return response.status(200).json(data);
        } catch (error) {
             return response.status(500).json({ error: error.message });
        }
    }

    let cacheKey;
    if (sector) {
        const decodedSector = decodeURIComponent(sector);
        cacheKey = `sector_${decodedSector.replace(/[^a-zA-Z0-9]/g, '_')}`;
    } else {
        cacheKey = 'homepage';
    }
    
    try {
        // 【核心改造】从Supabase读取数据
        const { data, error } = await supabase
            .from('cache')          // 从 'cache' 表
            .select('value')        // 只选择 'value' 这一列
            .eq('key', cacheKey)    // 条件是 'key' 等于我们的目标key
            .single();              // 我们期望只找到一条记录

        if (error || !data) {
            console.error(`Cache MISS or error fetching from Supabase for key ${cacheKey}:`,(401).send('Unauthorized');
    }

    console.log("MANUAL WARMUP TRIGGERED! Starting to pre-populate all caches.");

    // 非阻塞式响应：立刻告诉触发方“我已经开始工作了”
    response.status(202).json({ message: "Cache warmup process started. Check server logs for progress." });
    
    // 在后台继续执行缓存填充任务
    try {
        await populateAllCaches();
    } catch (error) {
        console.error("MANUAL WARMUP FAILED:", error);
    }
}

// --- 核心缓存填充逻辑 ---
async function populateAllCaches() {
    console.log("-> Task: Updating ALL stock data caches...");
    
    // 1. 准备首页数据
    const homepageStockList = [];
    for (const sector in industryStockList) {
        homepageStockList.push(...industryStockList[sector].slice(0, 5));
    }
    await updateCacheForList('homepage', homepageStockList);
    
    // 2. 准备所有行业数据
    for (const sectorName in industryStockList) {
        console.log(`  --> Processing sector: ${sectorName}`);
        await updateCacheForList(sectorName, industryStockList[sectorName]);
    }
    console.log("ALL CACHE POPULATION TASKS FINISHED.");
}

async function updateCacheForList(key, stockList) {
    const processedData = await fetchDataForList(stockList);

    if (processedData.length > 0) {
        const { error } = await supabase
            .from('cache')
            .upsert({ key: key, value: processedData }, { onConflict: 'key' }); // onConflict='key' 确保了覆盖更新

        if (error) {
            console.error(`Error saving data to Supabase for key ${key}:`, error);
        } else {
            console.log(`    - SUCCESS: Cached ${processedData.length} stocks to Supabase for key: ${key}`);
        }
    } else {
        console.warn(`    - WARNING: No data fetched for key ${key}. Cache not updated.`);
    }
}

async function fetchDataForList(stockList) {
    const tickers = stockList.map(s => s.ticker);
    const batchSize = 20;
    const delay = 1500;
    let fetchedData = [];

    for (let i = 0; i < tickers.length; i += batchSize) {
        const batch = tickers.slice(i, i + batchSize);
        const batchPromises = batch.map(t => fetchApiDataForTicker(t));
        const batchResult = (await Promise.all(batchPromises)).filter(Boolean);
        fetchedData.push(...batchResult);
        if (i + batchSize < tickers.length) await new Promise(resolve => setTimeout(resolve, delay));
    }

    return fetchedData.map(stock => {
        let masterSectorName = "Other";
        for (const sector in industryStockList) {
            if (industryStockList[sector].some(s => s.ticker === stock.ticker)) {
                masterSectorName = sector; break;
            }
        }
        return { ...stock, name_zh: fullTickerNameMap.get(stock.ticker) || stock.name_zh, sector: sectorDictionary[masterSectorName] || masterSectorName, original_sector: masterSectorName };
    });
}

async function fetchApiDataForTicker(ticker) {
    try {
        const apiKey = process.env.FINNHUB_API_KEY;
        const [quoteRes, profileRes] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`),
            fetch(`https error);
            return response.status(404).json({ error: '缓存数据不存在或正在生成中。请先访问 /api/warmup 端点来手动生成缓存。' });
        }

        // data.value 就是我们存进去的JSON数据
        return response.status(200).json(data.value);

    } catch (error) {
        console.error(`API Handler Error:`, error.message);
        return response.status(500).json({ error: 'An internal server error occurred.' });
    }
}

async function fetchSingleStockData(ticker) {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) throw new Error('FINNHUB_API_KEY is not configured.');
    
    const [profileRes, quoteRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`),
        fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`)
    ]);
    if (!profileRes.ok || !quoteRes.ok) throw new Error(`Failed to fetch details for ${ticker}`);
    const [profile, quote] = await Promise.all([profileRes.json(), quoteRes.json()]);
    const description = `(自动生成) ${profile.name} 是一家总部位于 ${profile.country || '未知'} 的公司，属于 ${profile.finnhubIndustry || '未知'} 行业，于 ${profile.ipo || '未知日期'} 上市。`;
    const nameZh = fullTickerNameMap.get(ticker) || profile.name;
    return { profile: { ...profile, description, name_zh: nameZh }, quote };
}