// api/stocks.js
const { createClient } = require('@supabase/supabase-js');
const { fullTickerNameMap } = require('../lib/stock-data');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (request, response) => {
    // Vercel的request对象没有完整的URL，需要拼接
    const fullUrl = `https://${request.headers.host}${request.url}`;
    const url = new URL(fullUrl);
    const ticker = url.searchParams.get('ticker');
    const sector = url.searchParams.get('sector');

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
        cacheKey = decodedSector;
    } else {
        cacheKey = 'homepage';
    }
    
    try {
        const { data, error } = await supabase
            .from('cache')
            .select('value')
            .eq('key', cacheKey)
            .single();

        if (error || !data) {
            console.error(`Cache MISS or error fetching from Supabase for key ${cacheKey}:`, error);
            return response.status(404).json({ error: '缓存数据不存在或正在生成中。' });
        }
        
        response.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
        return response.status(200).json(data.value);
        
    } catch (error) {
        console.error(`API Handler Error:`, error.message);
        return response.status(500).json({ error: 'An internal server error occurred.' });
    }
};

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