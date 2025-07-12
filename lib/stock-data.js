// lib/stock-data.js

// === 1. 数据源：去重后的精细化行业数据库 ===
const industryStockList = {
    "Software & Services": [
        { "ticker": "MSFT", "name_zh": "微软" }, { "ticker": "ORCL", "name_zh": "甲骨文" },
        { "ticker": "ADBE", "name_zh": "Adobe" }, { "ticker": "CRM", "name_zh": "赛富时" },
        { "ticker": "ACN", "name_zh": "埃森哲" }, { "ticker": "INTU", "name_zh": "财捷" },
        { "ticker": "NOW", "name_zh": "ServiceNow" }, { "ticker": "PANW", "name_zh": "派拓网络" },
        { "ticker": "CDNS", "name_zh": "铿腾电子" }, { "ticker": "SNPS", "name_zh": "新思科技" },
        { "ticker": "FTNT", "name_zh": "飞塔" }, { "ticker": "ANSS", "name_zh": "安西斯" },
        { "ticker": "PYPL", "name_zh": "PayPal" }, { "ticker": "ADSK", "name_zh": "欧特克" },
        { "ticker": "IT", "name_zh": "加特纳" }, { "ticker": "ROP", "name_zh": "罗珀科技"}
    ],
    "Technology Hardware & Equipment": [
        { "ticker": "AAPL", "name_zh": "苹果" }, { "ticker": "DELL", "name_zh": "戴尔科技" },
        { "ticker": "CSCO", "name_zh": "思科" }, { "ticker": "HPQ", "name_zh": "惠普" },
        { "ticker": "APH", "name_zh": "安费诺" }, { "ticker": "HPE", "name_zh": "慧与" },
        { "ticker": "TEL", "name_zh": "泰科电子" }, { "ticker": "JBL", "name_zh": "捷普" },
        { "ticker": "TRMB", "name_zh": "天宝" }, { "ticker": "STX", "name_zh": "希捷科技" },
        { "ticker": "WDC", "name_zh": "西部数据" }, { "ticker": "NTAP", "name_zh": "NetApp" }
    ],
    "Semiconductors & Semiconductor Equipment": [
        { "ticker": "NVDA", "name_zh": "英伟达" }, { "ticker": "AVGO", "name_zh": "博通" },
        { "ticker": "AMD", "name_zh": "超威半导体" }, { "ticker": "TXN", "name_zh": "德州仪器" },
        { "ticker": "QCOM", "name_zh": "高通" }, { "ticker": "AMAT", "name_zh": "应用材料" },
        { "ticker": "LRCX", "name_zh": "拉姆研究" }, { "ticker": "INTC", "name_zh": "英特尔" },
        { "ticker": "ADI", "name_zh": "亚德诺" }, { "ticker": "KLAC", "name_zh": "科磊" },
        { "ticker": "MU", "name_zh": "美光科技" }, { "ticker": "MCHP", "name_zh": "微芯科技" },
        { "ticker": "NXPI", "name_zh": "恩智浦" }, { "ticker": "ON", "name_zh": "安森美" }
    ],
    "Pharmaceuticals, Biotechnology & Life Sciences": [
        { "ticker": "LLY", "name_zh": "礼来" }, { "ticker": "JNJ", "name_zh": "强生" },
        { "ticker": "MRK", "name_zh": "默克" }, { "ticker": "ABBV", "name_zh": "艾伯维" },
        { "ticker": "PFE", "name_zh": "辉瑞" }, { "ticker": "AMGN", "name_zh": "安进" },
        { "ticker": "VRTX", "name_zh": "福泰制药" }, { "ticker": "REGN", "name_zh": "再生元" },
        { "ticker": "GILD", "name_zh": "吉利德科学" }, { "ticker": "BMY", "name_zh": "百时美施贵宝" },
        { "ticker": "MRNA", "name_zh": "莫德纳" }, { "ticker": "BIIB", "name_zh": "渤健" }
    ],
    "Health Care Equipment & Services": [
        { "ticker": "UNH", "name_zh": "联合健康" }, { "ticker": "TMO", "name_zh": "赛默飞" },
        { "ticker": "DHR", "name_zh": "丹纳赫" }, { "ticker": "ABT", "name_zh": "雅培" },
        { "ticker": "SYK", "name_zh": "史赛克" }, { "ticker": "ISRG", "name_zh": "直觉外科" },
        { "ticker": "MDT", "name_zh": "美敦力" }, { "ticker": "BSX", "name_zh": "波士顿科学" },
        { "ticker": "CVS", "name_zh": "CVS健康" }, { "ticker": "CI", "name_zh": "信诺" },
        { "ticker": "HCA", "name_zh": "HCA医疗" }, { "ticker": "ZTS", "name_zh": "硕腾" }
    ],
    "Banks": [
        { "ticker": "JPM", "name_zh": "摩根大通" }, { "ticker": "BAC", "name_zh": "美国银行" },
        { "ticker": "WFC", "name_zh": "富国银行" }, { "ticker": "GS", "name_zh": "高盛" },
        { "ticker": "MS", "name_zh": "摩根士丹利" }, { "ticker": "C", "name_zh": "花旗集团" },
        { "ticker": "PNC", "name_zh": "PNC金融" }, { "ticker": "USB", "name_zh": "美国合众银行" }
    ],
    "Diversified Financials": [
        { "ticker": "BRK-B", "name_zh": "伯克希尔B" }, { "ticker": "V", "name_zh": "Visa" },
        { "ticker": "MA", "name_zh": "万事达" }, { "ticker": "AXP", "name_zh": "美国运通" },
        { "ticker": "BLK", "name_zh": "贝莱德" }, { "ticker": "SCHW", "name_zh": "嘉信理财" },
        { "ticker": "SPGI", "name_zh": "标普全球" }, { "ticker": "MCO", "name_zh": "穆迪" },
        { "ticker": "COF", "name_zh": "第一资本" }, { "ticker": "ICE", "name_zh": "洲际交易所" }
    ],
    "Insurance": [
        { "ticker": "AIG", "name_zh": "美国国际集团" }, { "ticker": "ALL", "name_zh": "好事达" },
        { "ticker": "CB", "name_zh": "安达" }, { "ticker": "MET", "name_zh": "大都会人寿" },
        { "ticker": "PGR", "name_zh": "前进保险" }, { "ticker": "PRU", "name_zh": "保德信金融" },
        { "ticker": "TRV", "name_zh": "旅行者保险" }, { "ticker": "AFL", "name_zh": "美国家庭人寿" }
    ],
    "Retailing": [
        { "ticker": "AMZN", "name_zh": "亚马逊" }, { "ticker": "HD", "name_zh": "家得宝" },
        { "ticker": "COST", "name_zh": "好市多" }, { "ticker": "WMT", "name_zh": "沃尔玛" },
        { "ticker": "LOW", "name_zh": "劳氏" }, { "ticker": "TGT", "name_zh": "塔吉特" },
        { "ticker": "TJX", "name_zh": "TJX" }, { "ticker": "ORLY", "name_zh": "奥莱利" },
        { "ticker": "ROST", "name_zh": "罗斯百货" }, { "ticker": "AZO", "name_zh": "AutoZone" }
    ],
    "Automobiles & Components": [
        { "ticker": "TSLA", "name_zh": "特斯拉" }, { "ticker": "F", "name_zh": "福特汽车" },
        { "ticker": "GM", "name_zh": "通用汽车" }, { "ticker": "APTV", "name_zh": "安波福" },
        { "ticker": "BWA", "name_zh": "博格华纳" }, { "ticker": "GPC", "name_zh": "Genuine Parts" }
    ],
    "Media & Entertainment": [
        { "ticker": "GOOGL", "name_zh": "谷歌A" }, { "ticker": "META", "name_zh": "Meta" },
        { "ticker": "NFLX", "name_zh": "奈飞" }, { "ticker": "DIS", "name_zh": "迪士尼" },
        { "ticker": "WBD", "name_zh": "华纳兄弟探索" }, { "ticker": "EA", "name_zh": "艺电" },
        { "ticker": "TTWO", "name_zh": "Take-Two" }, { "ticker": "LYV", "name_zh": "Live Nation" }
    ],
    "Telecommunication Services": [
        { "ticker": "CMCSA", "name_zh": "康卡斯特" }, { "ticker": "VZ", "name_zh": "威瑞森" },
        { "ticker": "T", "name_zh": "AT&T" }, { "ticker": "TMUS", "name_zh": "T-Mobile" }
    ],
    "Capital Goods": [
        { "ticker": "CAT", "name_zh": "卡特彼勒" }, { "ticker": "HON", "name_zh": "霍尼韦尔" },
        { "ticker": "DE", "name_zh": "迪尔" }, { "ticker": "ETN", "name_zh": "伊顿" },
        { "ticker": "ITW", "name_zh": "伊利诺伊工具" }, { "ticker": "EMR", "name_zh": "艾默生电气" },
        { "ticker": "PH", "name_zh": "派克汉尼汾" }, { "ticker": "PCAR", "name_zh": "帕卡"}
    ],
    "Aerospace & Defense": [
        { "ticker": "BA", "name_zh": "波音" }, { "ticker": "RTX", "name_zh": "雷神技术" },
        { "ticker": "LMT", "name_zh": "洛克希德马丁" }, { "ticker": "GD", "name_zh": "通用动力" },
        { "ticker": "NOC", "name_zh": "诺斯洛普格鲁门" }, {"ticker": "GE", "name_zh": "通用电气航空"}
    ],
    "Transportation": [
        { "ticker": "UNP", "name_zh": "联合太平洋" }, { "ticker": "UPS", "name_zh": "联合包裹" },
        { "ticker": "FDX", "name_zh": "联邦快递" }, { "ticker": "DAL", "name_zh": "达美航空" },
        { "ticker": "CSX", "name_zh": "CSX运输" }, { "ticker": "NSC", "name_zh": "诺福克南方" },
        { "ticker": "UAL", "name_zh": "联合航空" }, { "ticker": "LUV", "name_zh": "西南航空" }
    ],
    "Food, Beverage & Tobacco": [
        { "ticker": "PEP", "name_zh": "百事" }, { "ticker": "KO", "name_zh": "可口可乐" },
        { "ticker": "PM", "name_zh": "菲利普莫里斯" }, { "ticker": "MDLZ", "name_zh": "亿滋国际" },
        { "ticker": "MO", "name_zh": "奥驰亚" }, { "ticker": "ADM", "name_zh": "ADM" },
        { "ticker": "HSY", "name_zh": "好时" }, { "ticker": "KHC", "name_zh": "卡夫亨氏" }
    ],
    "Household & Personal Products": [
        { "ticker": "PG", "name_zh": "宝洁" }, { "ticker": "CL", "name_zh": "高露洁" },
        { "ticker": "KMB", "name_zh": "金佰利" }, { "ticker": "EL", "name_zh": "雅诗兰黛" },
        { "ticker": "CHD", "name_zh": "切迟杜威" }, { "ticker": "CLX", "name_zh": "高乐氏" }
    ],
    "Energy": [
        { "ticker": "XOM", "name_zh": "埃克森美孚" }, { "ticker": "CVX", "name_zh": "雪佛龙" },
        { "ticker": "COP", "name_zh": "康菲石油" }, { "ticker": "SLB", "name_zh": "斯伦贝谢" },
        { "ticker": "EOG", "name_zh": "EOG能源" }, { "ticker": "VLO", "name_zh": "瓦莱罗能源" },
        { "ticker": "MPC", "name_zh": "马拉松原油" }, { "ticker": "PSX", "name_zh": "菲利普斯66" }
    ],
    "Materials": [
        { "ticker": "LIN", "name_zh": "林德" }, { "ticker": "APD", "name_zh": "空气化工" },
        { "ticker": "SHW", "name_zh": "宣伟" }, { "ticker": "ECL", "name_zh": "艺康" },
        { "ticker": "DOW", "name_zh": "陶氏" }, { "ticker": "NUE", "name_zh": "纽柯" },
        { "ticker": "FCX", "name_zh": "自由港麦克莫兰" }, { "ticker": "NEM", "name_zh": "纽蒙特矿业" }
    ],
    "Real Estate": [
        { "ticker": "PLD", "name_zh": "普洛斯" }, { "ticker": "AMT", "name_zh": "美国电塔" },
        { "ticker": "EQIX", "name_zh": "Equinix" }, { "ticker": "CCI", "name_zh": "冠城国际" },
        { "ticker": "SPG", "name_zh": "西蒙地产" }, { "ticker": "PSA", "name_zh": "公共存储" },
        { "ticker": "O", "name_zh": "房产信托" }, { "ticker": "WELL", "name_zh": "惠康" }
    ],
    "Utilities": [
        { "ticker": "NEE", "name_zh": "新纪元能源" }, { "ticker": "DUK", "name_zh": "杜克能源" },
        { "ticker": "SO", "name_zh": "南方公司" }, { "ticker": "AEP", "name_zh": "美国电力" },
        { "ticker": "EXC", "name_zh": "艾索伦" }, { "ticker": "SRE", "name_zh": "桑普拉能源" },
        { "ticker": "D", "name_zh": "道明尼能源" }, { "ticker": "CEG", "name_zh": "星座能源" }
    ]
};

const sectorDictionary = {
    "Energy": "能源", "Materials": "原材料", "Industrials": "工业", "Consumer Discretionary": "非必需消费品",
    "Consumer Staples": "必需消费品", "Health Care": "医疗健康", "Financials": "金融", "Information Technology": "信息技术",
    "Technology": "信息技术", "Communication Services": "通讯服务", "Communications": "通讯服务", "Utilities": "公用事业",
    "Real Estate": "房地产", "Aerospace & Defense": "航空航天与国防", "Aerospace": "航空航天", "Airlines": "航空公司",
    "Automobiles & Components": "汽车", "Automobiles": "汽车", "Banks": "银行业", "Banking": "银行业",
    "Beverages": "饮料", "Capital Goods": "资本品", "Commercial & Professional Services": "商业服务",
    "Consumer goods": "消费品", "Consumer products": "消费品", "Diversified Financials": "多元化金融",
    "Financial Services": "金融服务", "Food & Staples Retailing": "食品零售", "Food, Beverage & Tobacco": "食品与烟草",
    "Health Care Equipment & Services": "医疗设备与服务", "Hotels, Restaurants & Leisure": "酒店与休闲",
    "Household & Personal Products": "家庭与个人用品", "Insurance": "保险", "Machinery": "机械",
    "Media & Entertainment": "媒体与娱乐", "Media": "媒体", "Pharmaceuticals, Biotechnology & Life Sciences": "制药与生物科技",
    "Pharmaceuticals": "制药", "Retailing": "零售业", "Retail": "零售业", "Road & Rail": "陆路运输",
    "Semiconductors & Semiconductor Equipment": "半导体", "Semiconductors": "半导体", "Software & Services": "软件与服务",
    "Technology Hardware & Equipment": "技术硬件", "Telecommunication Services": "电信服务", "Telecommunication": "电信服务",
    "Textiles, Apparel & Luxury Goods": "纺织品与服装", "Textiles": "纺织品", "Transportation": "交通运输",
};

const fullTickerNameMap = new Map();
for (const sector in industryStockList) {
    industryStockList[sector].forEach(stock => {
        fullTickerNameMap.set(stock.ticker, stock.name_zh);
    });
}

const sectorNames = Object.keys(industryStockList);

// === 【核心修正】使用 module.exports 统一导出 ===
module.exports = {
    industryStockList,
    sectorDictionary,
    fullTickerNameMap,
    sectorNames
};