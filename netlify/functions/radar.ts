import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface RadarModelData {
  id: string;
  month: string;
  nation: "domestic" | "import";
  modelName: string;
  brand: string;
  sales: number;
  prevSales: number;
  momAbs: number;
  momPct: number;
  currentRank: number;
  prevRank: number | null;
  rankChange: number | null;
  score: number;
  danawaUrl: string;
}

const domesticBrands = [
  "현대", "기아", "제네시스", "르노코리아", "쌍용", "쉐보레"
];

const domesticModels: Record<string, string[]> = {
  "현대": ["그랜저", "아반떼", "쏘나타", "투싼", "싼타페", "팰리세이드", "코나", "아이오닉5", "아이오닉6", "캐스퍼", "스타리아", "포터"],
  "기아": ["쏘렌토", "카니발", "K5", "K8", "스포티지", "셀토스", "EV6", "EV9", "레이", "모하비", "K9", "니로"],
  "제네시스": ["G80", "G90", "GV70", "GV80", "GV60", "G70"],
  "르노코리아": ["XM3", "QM6", "SM6", "아르카나", "그랑 콜레오스"],
  "쌍용": ["토레스", "코란도", "티볼리", "렉스턴"],
  "쉐보레": ["트레일블레이저", "이쿼녹스", "콜로라도", "타호", "트랙스"]
};

const importBrands = [
  "벤츠", "BMW", "아우디", "폭스바겐", "볼보", "테슬라", "렉서스", "토요타", "혼다", "포르쉐", "미니", "지프", "랜드로버", "포드", "링컨"
];

const importModels: Record<string, string[]> = {
  "벤츠": ["E-Class", "S-Class", "C-Class", "GLC", "GLE", "A-Class", "EQS", "EQE", "AMG GT", "GLA"],
  "BMW": ["3시리즈", "5시리즈", "7시리즈", "X3", "X5", "X7", "i4", "iX", "M4", "Z4"],
  "아우디": ["A4", "A6", "A8", "Q5", "Q7", "e-tron", "RS6", "TT", "Q8"],
  "폭스바겐": ["티구안", "골프", "아테온", "투아렉", "ID.4", "파사트"],
  "볼보": ["XC60", "XC90", "S90", "V60", "XC40", "C40", "EX90"],
  "테슬라": ["모델 3", "모델 Y", "모델 S", "모델 X", "사이버트럭"],
  "렉서스": ["ES", "RX", "NX", "LS", "UX", "LX"],
  "토요타": ["캠리", "라브4", "하이랜더", "프리우스", "크라운"],
  "혼다": ["어코드", "CR-V", "시빅", "HR-V", "파일럿"],
  "포르쉐": ["카이엔", "파나메라", "마칸", "911", "타이칸"],
  "미니": ["쿠퍼", "컨트리맨", "클럽맨"],
  "지프": ["그랜드 체로키", "랭글러", "컴패스", "글래디에이터"],
  "랜드로버": ["디펜더", "레인지로버", "디스커버리", "이보크"],
  "포드": ["익스플로러", "머스탱", "브롱코", "익스페디션"],
  "링컨": ["에비에이터", "노틸러스", "코세어"]
};

function generateRadarData(month: string, nation: string): RadarModelData[] {
  const brands = nation === "domestic" ? domesticBrands : importBrands;
  const models = nation === "domestic" ? domesticModels : importModels;
  const results: RadarModelData[] = [];
  
  const monthDate = new Date(month.replace("-00", "-01"));
  const seed = monthDate.getTime() + (nation === "domestic" ? 0 : 1000000);
  
  const seededRandom = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };
  
  let id = 0;
  for (const brand of brands) {
    const brandModels = models[brand] || [];
    for (const modelName of brandModels) {
      id++;
      const randomOffset = id * 13;
      
      const baseSales = Math.floor(seededRandom(randomOffset) * 2000 + 100);
      const isNewEntry = seededRandom(randomOffset + 1) < 0.08;
      const prevSales = isNewEntry ? 0 : Math.floor(baseSales * (0.5 + seededRandom(randomOffset + 2) * 0.8));
      const sales = baseSales;
      
      const momAbs = sales - prevSales;
      let momPct = prevSales > 0 ? momAbs / prevSales : (sales > 0 ? 5 : 0);
      momPct = Math.min(momPct, 5);
      
      const currentRank = Math.floor(seededRandom(randomOffset + 3) * 50) + 1;
      const prevRank = isNewEntry ? null : currentRank + Math.floor(seededRandom(randomOffset + 4) * 20) - 5;
      const rankChange = prevRank !== null ? prevRank - currentRank : null;
      
      const zMomAbs = momAbs / 500;
      const zMomPct = momPct / 2;
      const zRankChange = (rankChange || 0) / 10;
      const score = 0.55 * zMomAbs + 0.35 * zMomPct + 0.10 * zRankChange;
      
      const baseUrl = nation === "domestic" 
        ? `https://auto.danawa.com/auto/?Month=${month}&Nation=domestic&Tab=Model&Work=record`
        : `https://auto.danawa.com/auto/?Month=${month}&Nation=export&Tab=Model&Work=record`;
      
      results.push({
        id: `${nation}-${month}-${id}`,
        month,
        nation: nation as "domestic" | "import",
        modelName,
        brand,
        sales,
        prevSales,
        momAbs,
        momPct,
        currentRank,
        prevRank,
        rankChange,
        score,
        danawaUrl: baseUrl,
      });
    }
  }
  
  return results
    .filter(m => m.momAbs > 0)
    .sort((a, b) => b.score - a.score);
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const month = event.queryStringParameters?.month;
  const nation = event.queryStringParameters?.nation;

  if (!month || !nation) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Month and nation are required" })
    };
  }

  if (nation !== "domestic" && nation !== "import") {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Nation must be 'domestic' or 'import'" })
    };
  }

  const monthPattern = /^\d{4}-\d{2}-00$/;
  if (!monthPattern.test(month)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Month must be in format YYYY-MM-00" })
    };
  }

  try {
    const models = generateRadarData(month, nation);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(models)
    };
  } catch (error) {
    console.error("Error generating radar data:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};

export { handler };
