// api/warmup.js
// 这是我们手动的、只有我们自己知道的缓存预热触发器

import { createClient } from '@supabase/supabase-js';
import { industryStockList, sectorDictionary, fullTickerNameMap } from '../lib/stock-data';

// 使用Supabase的密钥初始化客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


export default async function handler(request, response) {
    // 【推荐】未来可以启用安全检查，防止被意外触发
    // const secret = request.headers['x-warmup-secret'];
    // if (secret !== process.env.WARMUP_SECRET) {
    //     return response.status(401).send('Unauthorized');
    // }

    console.log("MANUAL WARMUP TRIGGERED! Starting to pre-populate all caches.");

    // 非阻塞式响应：立刻告诉浏览器“我已经开始工作了”，然后让后台任务继续运行
    response.status(202).json({ message: "Cache warmup process started. This will take several minutes. Check server logs for progress." });
    
    // 使用 try...finally 确保即使出错也能记录
    try {
        await populateAllCaches();
        console.log("MANUAL WARMUP FINISHED SUCCESSFULLY.");
    } catch (error) {
        console.error("MANUAL WARMUP FAILED:", error);
    }
}

async function populateAllCaches() {
    console.log("-> Task: Updating ALL stock data caches...");
    
    const homepageStockList = [];
    for (const sector in industryStockList) {
        homepageStockList.push(...industryStockList[sector].slice(0, 5));
    }
    await updateCacheForList('homepage', homepageStockList);
    
    for (const sectorName in industryStockList) {
        await updateCacheForList(`sector_${sectorName.replace(/[^a-zA-Z0-9]/g, '_')}`, industryStockList[sectorName]);
    }
}

async function updateCacheForList(key, stockList) {
    const fullKey = key; // 在Supabase中，我们直接用处理过的key
    console.log(`    - Processing key: ${full太棒了！我们已经完成了最关键的基础设施搭建。现在，是时候进行“软件安装”了——让我们的代码学会与这个全新的、强大的Supabase数据库对话。

---

### **第二步：改造代码，让程序学会使用新仓库**

**目标：** 更新我们的后台和前台API代码，让它们Key}`);
    
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

    const processedData能够读写Supabase数据库。

#### **子任务2.1：安装Supabase客户端库**

1.  **打开您的VS Code**，并确保您在终端（Terminal）中，当前目录是您最新的项目文件夹 (`heatmap`)。
2.  在终端中，运行以下命令来安装Supabase的官方库：
    ```bash
    npm install @supabase/supabase-js
    ```
    您会看到`package.json` = fetchedData.map(stock => {
        let masterSectorName = "Other";
        for (const sector in industryStockList) {
            if (industryStockList[sector].some(s => s.ticker === stock.ticker)) {
                masterSectorName = sector; break;
            }
        }
        return {
            ...stock,
            name_zh: fullTickerNameMap.get(stock.ticker) || stock.name_zh,
            sector: sectorDictionary[masterSectorName] || masterSectorName,
            original_sector: masterSectorName,
        };
    });

    if (processedData.length > 0) {
        // 【核心改造】将数据存入Supabase
        const { error } = await supabase
            .from('cache') // 对应我们创建的表名
            .upsert({ key: fullKey, value: processedData }, { onConflict: 'key' }); // 如果key已存在，则更新value

        if (error) {
            console.error(`    - ERROR saving to Supabase for key ${fullKey}:`, error);
        } else {
            console.log(`    - SUCCESS: Cached ${processedData.length} stocks to Supabase for key: ${fullKey}`);
        }
    }
}

async function fetchApiDataForTicker(ticker) {
    try {
        const apiKey = process.env.FINNHUB_API_KEY;
        const [quoteRes, profileRes] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`),
            fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker和`package-lock.json`文件发生变化，这是完全正常的。

---

#### **子任务2.2：改造后台任务脚本 (`api/warmup.js`)**

这个文件将负责从Finnhub获取数据，然后将结果存入Supabase的`cache`表中。

**操作：** 请用以下【最终版】代码，**完整覆盖**您项目中的 `api/warmup.js` 文件。

```javascript
// api/warmup.js
import { createClient } from '@supabase/supabase-js';
import { industryStockList, sectorDictionary, fullTickerNameMap } from '../lib/stock-data';

// 使用Supabase的密钥初始化客户端
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// 确保密钥已设置，否则抛出错误
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is not defined in environment variables.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 主处理函数 ---
export default async function handler(request, response) {
    // 【推荐】重新启用安全检查，防止被滥用
    // 注意：您需要在Vercel和GitHub Secrets中都设置 WARMUP_SECRET
    const secret = request.headers['x-warmup-secret'];
    if (secret !== process.env.WARMUP_SECRET) {
        return response.status}&token=${apiKey}`)
        ]);
        if (!quoteRes.ok || !profileRes.ok) return null;
        const [quote, profile] = await Promise.all([quoteRes.json(), quoteRes.json()]);
        if (!profile || typeof profile.marketCapitalization === 'undefined' || profile.marketCapitalization === 0) return null;
        return { ticker, market_cap: profile.marketCapitalization, change_percent: quote.dp };
    } catch (error) {
        return null;
    }
}