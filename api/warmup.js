// api/warmup.js
const { createClient } = require('@supabase/supabase-js');
const { industryStockList, sectorDictionary, fullTickerNameMap } = require('../lib/stock-data');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (request, response) => {
    // 【推荐】启用安全检查，防止被滥用
    // 注意：您需要在Vercel和GitHub Secrets中都设置 WARMUP_SECRET
    const secret = request.headers['x-warmup-secret'];
    if (secret !== process.env.WARMUP_SECRET) {
        return response.status(401).send('Unauthorized');
    }

    console.log("MANUAL WARMUP TRIGGERED! Starting to pre-populate all caches.");
    response.status(202).json({ message: "Cache warmup process started. Check server logs for progress." });
    
    try {
        await populateAllCaches();
    } catch (error) {
        console.error("MANUAL WARMUP FAILED:", error);
    }
};

async function populateAllCaches() {
    console.log("-> Task: Updating ALL stock data caches...");
    
    const homepageStockList = [];
    for (const sector in industryStockList) {
        homepageStockList.push(...industryStockList[sector].slice(0, 5));
    }
    await updateCacheForList('homepage', homepageStockList);
    
    for (const sectorName in industryStockList) {
        console.log(`  --> Processing sector: ${sectorName}`);
        await updateCacheForList(sectorName, industryStockList[sectorName]);
    }
    console.log("ALL CACHE POPULATION TASKS FINISHED.");
}

async function updateCacheForList(key, stockList) {
    const processedData = await fetchDataForList(stockList);
    if (processedData && processedData.length > 0) {
        const { error } = await supabase
            .from('cache')
            .upsert({ key: key, value: processedData }, { onConflict: 'key' });
        if (error) {
            console.error(`Error saving to Supabase for key ${key}:`, error);
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
            fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`)
        ]);
        if (!quoteRes.ok || !profileRes.ok) return null;
        const [quote, profile] = await Promise.all([quoteRes.json(), quoteRes.json()]);
        if (!profile || typeof profile.marketCapitalization === 'undefined' || profile.marketCapitalization === 0) return null;
        return { ticker, market_cap: profile.marketCapitalization, change_percent: quote.dp };
    } catch (error) {
        return null;
    }
}