"use client";

import { Button } from "@/components/ui/button";
import { announcementActionWrapper } from "@/src/wrappers/announcement-action-wrapper";
import { productActionWrapper } from "@/src/wrappers/product-action-wrapper";
import { AnnouncementAddParams } from "@repo/api-client";
import { CreateProductRequest } from "@repo/api-client";

async function login() {
  await fetch("http://localhost:3010/auth/login", {
    method: "POST",
    credentials: "include", // ✅ 必須加
  });
  console.log("已登入並存 cookie");
}

async function refresh() {
  const res = await fetch("http://localhost:3010/auth/refresh", {
    method: "POST",
    credentials: "include", // ✅ 必須加
  });
  const data = await res.json();
  console.log("refresh 回應", data);
}

async function annouce() {
  const dummyAnnouncements: AnnouncementAddParams[] = [
    {
      title: "系統版本更新 v1.2.0",
      content: "我們優化了結帳流程並修復了已知錯誤。",
      type: "success",
      link: {
        action: "external",
        url: "https://your-pos-manual.com/updates",
        label: "查看更新日誌",
        target: "_blank",
      },
      isActive: true,
    },
    {
      title: "庫存不足警告",
      content: "商品「美式咖啡豆」庫存已低於安全水位，請盡快補貨。",
      type: "warning",
      link: {
        action: "external",
        params: { id: "prod_001" },
        label: "前往庫存管理",
      },
      isActive: true,
    },
    {
      title: "未處理訂單提醒",
      content: "您有 5 筆待處理訂單已超過 30 分鐘未接單。",
      type: "critical",
      link: {
        action: "internal_route",
        url: "/admin/orders/pending",
        label: "立即處理",
      },
      isActive: true,
    },
    {
      title: "連假營業時間調整",
      content: "下週端午連假期間，本店營業時間調整為 10:00 - 18:00。",
      type: "info",
      link: {
        action: "none",
      },
      isActive: true,
    },
    {
      title: "異常訂單需人工核實",
      content: "訂單 #ORD-8829 支付金額與系統不符，請點擊確認細節。",
      type: "critical",
      link: {
        action: "external",
        params: { orderId: "ORD-8829" },
        label: "檢查訂單",
      },
      isActive: true,
    },
    {
      title: "夏季新品上市",
      content: "芒果系列飲品現正熱賣中，請確認菜單已完成更新。",
      type: "success",
      link: {
        action: "internal_route",
        url: "/admin/menu/category/summer-special",
        label: "查看菜單",
      },
      isActive: true,
    },
    {
      title: "網路連線不穩定",
      content: "目前偵測到局域網連線不穩，可能會影響出單機速度。",
      type: "warning",
      link: {
        action: "none",
      },
      isActive: true,
    },
    {
      title: "員工教育訓練通知",
      content: "本週五下午 3 點將進行新版 POS 操作培訓。",
      type: "info",
      link: {
        action: "external",
        url: "https://zoom.us/j/123456789",
        label: "進入會議室",
      },
      isActive: true,
    },
    {
      title: "系統定期維護預告",
      content: "系統將於明天凌晨 02:00 - 04:00 進行伺服器升級。",
      type: "info",
      link: {
        action: "none",
      },
      isActive: true,
    },
    {
      title: "過期促銷活動提醒",
      content: "「早鳥優惠」已結束，系統已自動下架相關折扣。",
      type: "warning",
      link: {
        action: "internal_route",
        url: "/admin/promotions",
        label: "管理促銷",
      },
      isActive: false,
    },
  ];

  dummyAnnouncements.map((item) => {
    announcementActionWrapper.create(item);
  });
}

async function createProduct() {
  const createPoductList: CreateProductRequest[] = [
    {
      product: {
        categoryUuid: "68cf3f2c755d2b9375de2554",
        categoryName: "PASTA",
        isShow: true,
        name: "香腸肉醬義大利麵",
        subtitle: "Classic Sausage Bolognese",
        description:
          "義大利長麵、西式香腸、綜合配菜、蘑菇肉醬。均可加焗烤另加30元。",
        hashTag: "#肉醬 #經典",
        is_new: false,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 120,
      },
      specInventories: [
        {
          name: "香腸肉醬義大利麵",
          spec: "標準份量",
          originalPrice: 190,
          salePrice: 169,
          vipPrice: 149,
          stock: 100,
          cost: 60,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1598866594230-a1a1947af570?w=800&h=600&fit=crop",
          alt: "香腸肉醬義大利麵",
        },
      ],
    },
    {
      product: {
        categoryUuid: "68cf3f2c755d2b9375de2554",
        categoryName: "PASTA",
        isShow: true,
        name: "香煎培根義大利麵",
        subtitle: "Bacon Pasta (White/Pesto)",
        description: "義大利長麵、培根、綜合配菜。提供白醬與青醬供選擇。",
        hashTag: "#熱銷 #培根",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.0,
        soldQty: 310,
      },
      specInventories: [
        {
          name: "香煎培根義大利麵 (白醬)",
          spec: "奶油白醬",
          originalPrice: 180,
          salePrice: 159,
          vipPrice: 139,
          stock: 80,
          cost: 55,
          photoTemp: "",
        },
        {
          name: "香煎培根義大利麵 (青醬)",
          spec: "羅勒青醬",
          originalPrice: 180,
          salePrice: 159,
          vipPrice: 139,
          stock: 80,
          cost: 58,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&h=600&fit=crop",
          alt: "香煎培根義大利麵-白醬",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1473093226795-af9932fe5855?w=800&h=600&fit=crop",
          alt: "香煎培根義大利麵-青醬",
        },
      ],
    },
    {
      product: {
        categoryUuid: "68cf3f2c755d2b9375de2554",
        categoryName: "PASTA",
        isShow: true,
        name: "迷迭香雞腿義大利麵",
        subtitle: "Rosemary Chicken Pasta",
        description: "義大利長麵、迷迭香雞腿、綜合配菜。低溫乾操保留麥香。",
        hashTag: "#迷迭香 #雞腿推薦",
        is_new: true,
        isHot: true,
        isSpecialOffer: false,
        ratings: 5.0,
        soldQty: 150,
      },
      specInventories: [
        {
          name: "迷迭香雞腿義大利麵 (白醬)",
          spec: "奶油白醬",
          originalPrice: 210,
          salePrice: 189,
          vipPrice: 169,
          stock: 50,
          cost: 85,
          photoTemp: "",
        },
        {
          name: "迷迭香雞腿義大利麵 (青醬)",
          spec: "羅勒青醬",
          originalPrice: 210,
          salePrice: 189,
          vipPrice: 169,
          stock: 50,
          cost: 88,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop",
          alt: "迷迭香雞腿義大利麵-白醬",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1458644267420-66bc8a5f21e4?w=800&h=600&fit=crop",
          alt: "迷迭香雞腿義大利麵-青醬",
        },
      ],
    },
    {
      product: {
        categoryUuid: "68cf3f2c755d2b9375de2554",
        categoryName: "PASTA",
        isShow: true,
        name: "海鮮總匯義大利麵",
        subtitle: "Seafood Deluxe Pasta",
        description:
          "義大利長麵、綜合海鮮、綜合配菜。可選白醬、青醬或西西里紅醬。",
        hashTag: "#豪華海鮮 #多醬汁",
        is_new: false,
        isHot: true,
        isSpecialOffer: true,
        ratings: 4.5,
        soldQty: 280,
      },
      specInventories: [
        {
          name: "海鮮總匯義大利麵 (白醬)",
          spec: "奶油白醬",
          originalPrice: 220,
          salePrice: 189,
          vipPrice: 169,
          stock: 40,
          cost: 95,
          photoTemp: "",
        },
        {
          name: "海鮮總匯義大利麵 (西西里)",
          spec: "西西里紅醬",
          originalPrice: 220,
          salePrice: 189,
          vipPrice: 169,
          stock: 40,
          cost: 90,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=600&fit=crop",
          alt: "海鮮總匯主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
          alt: "西西里紅醬細節圖",
        },
      ],
    },
    {
      product: {
        categoryUuid: "68cf3f2c755d2b9375de2554",
        categoryName: "PASTA",
        isShow: true,
        name: "煙花女義大利麵",
        subtitle: "Spaghetti alla Puttanesca",
        description: "義大利長麵、綜合配菜、煙花女醬。風味濃郁，經典義式滋味。",
        hashTag: "#重口味 #經典",
        is_new: false,
        isHot: false,
        isSpecialOffer: false,
        ratings: 3.5,
        soldQty: 65,
      },
      specInventories: [
        {
          name: "煙花女義大利麵",
          spec: "標準份量",
          originalPrice: 180,
          salePrice: 159,
          vipPrice: 139,
          stock: 60,
          cost: 50,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&h=600&fit=crop",
          alt: "煙花女義大利麵",
        },
      ],
    },
    {
      product: {
        categoryUuid: "68cf3f2c755d2b9375de2554",
        categoryName: "PASTA",
        isShow: true,
        name: "白酒蛤蠣義大利麵",
        subtitle: "Linguine alle Vongole",
        description: "義大利長麵、蛤蠣、綜合配菜、白酒、風乾辣椒。鮮味十足。",
        hashTag: "#清炒 #白酒蛤蠣",
        is_new: false,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 190,
      },
      specInventories: [
        {
          name: "白酒蛤蠣義大利麵",
          spec: "標準份量",
          originalPrice: 180,
          salePrice: 159,
          vipPrice: 139,
          stock: 70,
          cost: 65,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1534080564607-6e773ee46aac?w=800&h=600&fit=crop",
          alt: "白酒蛤蠣義大利麵",
        },
      ],
    },
    {
      product: {
        categoryUuid: "68cf3f2c755d2b9375de2554",
        categoryName: "PASTA",
        isShow: true,
        name: "清炒三菇義大利麵",
        subtitle: "Triple Mushroom Pasta",
        description: "義大利長麵、綜合菇、綜合配菜、白酒、風乾辣椒。蔬食首選。",
        hashTag: "#蔬食 #清炒",
        is_new: true,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.0,
        soldQty: 45,
      },
      specInventories: [
        {
          name: "清炒三菇義大利麵",
          spec: "標準份量",
          originalPrice: 190,
          salePrice: 169,
          vipPrice: 149,
          stock: 100,
          cost: 45,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800&h=600&fit=crop",
          alt: "清炒三菇義大利麵",
        },
      ],
    },
  ];
  const createProductList2: CreateProductRequest[] = [
    {
      product: {
        categoryUuid: "691f94d4f6928d86d5138784",
        categoryName: "BURGER",
        isShow: true,
        name: "太陽蛋牛肉堡",
        subtitle: "Sunny-side Up Egg Beef Burger",
        description:
          "牛肉、起司、精選雞蛋、新鮮生菜、特選墨西哥辣椒。搭配天然酵母發酵全麥麵包。",
        hashTag: "#經典 #太陽蛋",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 180,
      },
      specInventories: [
        {
          name: "太陽蛋牛肉堡 (標準)",
          spec: "標準單層",
          originalPrice: 210,
          salePrice: 189,
          vipPrice: 169,
          stock: 50,
          cost: 75,
          photoTemp: "",
        },
        {
          name: "太陽蛋牛肉堡 (雙層肉)",
          spec: "雙層牛肉",
          originalPrice: 280,
          salePrice: 259,
          vipPrice: 239,
          stock: 30,
          cost: 110,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop",
          alt: "太陽蛋牛肉堡主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop",
          alt: "太陽蛋牛肉堡雙層細節",
        },
      ],
    },
    {
      product: {
        categoryUuid: "691f94d4f6928d86d5138784",
        categoryName: "BURGER",
        isShow: true,
        name: "花生醬牛肉堡",
        subtitle: "Peanut Butter Beef Burger",
        description:
          "牛肉、培根、起司、獨家特調花生醬、新鮮生菜、特選墨西哥辣椒。",
        hashTag: "#濃郁花生醬 #邪惡美食",
        is_new: true,
        isHot: true,
        isSpecialOffer: false,
        ratings: 5.0,
        soldQty: 250,
      },
      specInventories: [
        {
          name: "花生醬牛肉堡 (標準)",
          spec: "標準單層",
          originalPrice: 220,
          salePrice: 199,
          vipPrice: 179,
          stock: 40,
          cost: 85,
          photoTemp: "",
        },
        {
          name: "花生醬牛肉堡 (加量花生醬)",
          spec: "雙倍花生醬",
          originalPrice: 240,
          salePrice: 219,
          vipPrice: 199,
          stock: 20,
          cost: 95,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=800&h=600&fit=crop",
          alt: "花生醬牛肉堡主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=800&h=600&fit=crop",
          alt: "花生醬牛肉堡特寫",
        },
      ],
    },
    {
      product: {
        categoryUuid: "691f94d4f6928d86d5138784",
        categoryName: "BURGER",
        isShow: true,
        name: "雙層牛肉堡",
        subtitle: "Double Beef Burger",
        description:
          "牛肉x2、起司、培根、新鮮生菜、特選墨西哥辣椒。滿足肉食主義者。",
        hashTag: "#肉量加倍 #飽足感",
        is_new: false,
        isHot: true,
        isSpecialOffer: true,
        ratings: 4.5,
        soldQty: 320,
      },
      specInventories: [
        {
          name: "雙層牛肉堡",
          spec: "標準雙層",
          originalPrice: 280,
          salePrice: 250,
          vipPrice: 230,
          stock: 60,
          cost: 120,
          photoTemp: "",
        },
        {
          name: "雙層牛肉堡 (加起司)",
          spec: "雙層肉+三倍起司",
          originalPrice: 310,
          salePrice: 280,
          vipPrice: 260,
          stock: 40,
          cost: 135,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
          alt: "雙層牛肉堡主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=600&fit=crop",
          alt: "雙層牛肉堡特寫",
        },
      ],
    },
    {
      product: {
        categoryUuid: "691f94d4f6928d86d5138784",
        categoryName: "BURGER",
        isShow: true,
        name: "藍紋起司牛肉堡",
        subtitle: "Blue Cheese Beef Burger",
        description:
          "牛肉、起司、藍紋起司、新鮮生菜、特選墨西哥辣椒。獨特強烈香氣。",
        hashTag: "#藍紋起司 #老饕最愛",
        is_new: true,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.0,
        soldQty: 65,
      },
      specInventories: [
        {
          name: "藍紋起司牛肉堡",
          spec: "標準",
          originalPrice: 220,
          salePrice: 199,
          vipPrice: 179,
          stock: 25,
          cost: 90,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1525164286253-04e68b9d942a?w=800&h=600&fit=crop",
          alt: "藍紋起司牛肉堡",
        },
      ],
    },
    {
      product: {
        categoryUuid: "691f94d4f6928d86d5138784",
        categoryName: "BURGER",
        isShow: true,
        name: "BBQ雞腿堡",
        subtitle: "BBQ Chicken Thigh Burger",
        description:
          "普羅旺斯雞腿、起司、新鮮生菜、特選墨西哥辣椒。雞腿排嫩滑多汁。",
        hashTag: "#雞腿堡 #BBQ醬",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 140,
      },
      specInventories: [
        {
          name: "BBQ雞腿堡 (原味)",
          spec: "普羅旺斯嫩雞",
          originalPrice: 220,
          salePrice: 199,
          vipPrice: 179,
          stock: 45,
          cost: 80,
          photoTemp: "",
        },
        {
          name: "BBQ雞腿堡 (大口吃肉)",
          spec: "雙層雞腿排",
          originalPrice: 300,
          salePrice: 279,
          vipPrice: 259,
          stock: 20,
          cost: 130,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1615210623305-856a42727e6f?w=800&h=600&fit=crop",
          alt: "BBQ雞腿堡主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=800&h=600&fit=crop",
          alt: "雞腿排特寫",
        },
      ],
    },
    {
      product: {
        categoryUuid: "691f94d4f6928d86d5138784",
        categoryName: "BURGER",
        isShow: true,
        name: "墨西哥辣醬牛肉堡",
        subtitle: "Mexican Chili Beef Burger",
        description:
          "牛肉、起司、招牌墨西哥辣醬、新鮮生菜、特選墨西哥辣椒。辛辣夠味。",
        hashTag: "#辣味堡 #墨西哥辣醬",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 110,
      },
      specInventories: [
        {
          name: "墨西哥辣醬牛肉堡",
          spec: "標準辣",
          originalPrice: 220,
          salePrice: 199,
          vipPrice: 179,
          stock: 50,
          cost: 82,
          photoTemp: "",
        },
        {
          name: "墨西哥辣醬牛肉堡 (極限辣)",
          spec: "地獄辣度",
          originalPrice: 230,
          salePrice: 209,
          vipPrice: 189,
          stock: 15,
          cost: 85,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1582196016295-f8c89433760e?w=800&h=600&fit=crop",
          alt: "墨西哥辣醬牛肉堡",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181?w=800&h=600&fit=crop",
          alt: "辣椒細節",
        },
      ],
    },
    {
      product: {
        categoryUuid: "691f94d4f6928d86d5138784",
        categoryName: "BURGER",
        isShow: true,
        name: "培根牛肉堡",
        subtitle: "Bacon Beef Burger",
        description: "牛肉、起司、培根、新鮮生菜、特選墨西哥辣椒。鹹香脆口。",
        hashTag: "#培根起司 #經典牛肉堡",
        is_new: false,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.0,
        soldQty: 195,
      },
      specInventories: [
        {
          name: "培根牛肉堡",
          spec: "標準單層",
          originalPrice: 210,
          salePrice: 189,
          vipPrice: 169,
          stock: 70,
          cost: 78,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=600&fit=crop",
          alt: "培根牛肉堡",
        },
      ],
    },
  ];

  const createProductList3: CreateProductRequest[] = [
    {
      product: {
        categoryUuid: "69eaddd8968dec5e1aefb0ff",
        categoryName: "MEALS",
        isShow: true,
        name: "塔可飯",
        subtitle: "Okinawan Taco Rice",
        description:
          "墨西哥塔可餅與沖繩米食結合。微辣肉醬、生菜、番茄、起司、玉米脆片、酸奶與水煮蛋。層次豐富。",
        hashTag: "#沖繩風味 #微辣 #人氣料理",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 210,
      },
      specInventories: [
        {
          name: "塔可飯 (標準)",
          spec: "台灣豬肉/標準份量",
          originalPrice: 340,
          salePrice: 310,
          vipPrice: 280,
          stock: 40,
          cost: 120,
          photoTemp: "",
        },
        {
          name: "塔可飯 (飯量加大)",
          spec: "台灣豬肉/增量25%",
          originalPrice: 340,
          salePrice: 310,
          vipPrice: 280,
          stock: 30,
          cost: 130,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1513185158878-8d8c196b3f6c?w=800&h=600&fit=crop",
          alt: "塔可飯主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1625398907796-8261b2491195?w=800&h=600&fit=crop",
          alt: "塔可飯細節",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eaddd8968dec5e1aefb0ff",
        categoryName: "MEALS",
        isShow: true,
        name: "日式蔬食雜煮飯",
        subtitle: "Japanese Vegetable Stew with Rice",
        description:
          "奶蛋素可食。結合牛蒡、蓮藕、紅蘿蔔、鵪鶉筍、香菇、蒟蒻等多種時蔬，佐薑汁豆包與水煮蛋。",
        hashTag: "#蔬食友善 #健康餐 #日式",
        is_new: false,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.0,
        soldQty: 95,
      },
      specInventories: [
        {
          name: "日式蔬食雜煮飯",
          spec: "奶蛋素/標準",
          originalPrice: 380,
          salePrice: 340,
          vipPrice: 310,
          stock: 25,
          cost: 110,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop",
          alt: "日式蔬食雜煮飯",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eaddd8968dec5e1aefb0ff",
        categoryName: "MEALS",
        isShow: true,
        name: "奶油咖哩雞肉飯",
        subtitle: "Creamy Butter Chicken Curry",
        description:
          "用奶油把香料變成圓潤細緻但又夠味的神奇咖哩，撫慰身心靈的第一選擇。",
        hashTag: "#奶油咖哩 #濃郁 #必點",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 5.0,
        soldQty: 340,
      },
      specInventories: [
        {
          name: "奶油咖哩雞肉飯 (標準)",
          spec: "香料咖哩/標準",
          originalPrice: 380,
          salePrice: 340,
          vipPrice: 310,
          stock: 60,
          cost: 140,
          photoTemp: "",
        },
        {
          name: "奶油咖哩雞肉飯 (歐姆蛋)",
          spec: "香料咖哩/滑嫩歐姆蛋",
          originalPrice: 420,
          salePrice: 380,
          vipPrice: 350,
          stock: 30,
          cost: 165,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1588166524941-3bf61a7c41eb?w=800&h=600&fit=crop",
          alt: "奶油咖哩雞肉飯主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
          alt: "滑嫩歐姆蛋細節",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eaddd8968dec5e1aefb0ff",
        categoryName: "MEALS",
        isShow: true,
        name: "番茄紅酒燉肉飯",
        subtitle: "Tomato & Red Wine Braised Pork",
        description:
          "台灣豬肉。香甜番茄洋蔥黑豬肉加入大量紅酒熬製，口感厚實飽滿，白飯殺手。",
        hashTag: "#紅酒燉肉 #白飯殺手 #皇冠推薦",
        is_new: true,
        isHot: true,
        isSpecialOffer: false,
        ratings: 5.0,
        soldQty: 180,
      },
      specInventories: [
        {
          name: "番茄紅酒燉肉飯 (標準)",
          spec: "黑豬肉/標準",
          originalPrice: 380,
          salePrice: 340,
          vipPrice: 310,
          stock: 45,
          cost: 150,
          photoTemp: "",
        },
        {
          name: "番茄紅酒燉肉飯 (肉量加大)",
          spec: "黑豬肉/肉量增值",
          originalPrice: 450,
          salePrice: 410,
          vipPrice: 380,
          stock: 20,
          cost: 190,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1547592110-803653ef83b9?w=800&h=600&fit=crop",
          alt: "番茄紅酒燉肉飯主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800&h=600&fit=crop",
          alt: "紅酒燉肉近照",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eaddd8968dec5e1aefb0ff",
        categoryName: "MEALS",
        isShow: true,
        name: "和風豚肉角煮飯",
        subtitle: "Japanese Style Braised Pork Belly",
        description:
          "台灣豬肉。日式燉煮法細火慢煨在地黑豬肉，配菜鮮美有醬香，軟嫩甘甜不油膩。",
        hashTag: "#日式角煮 #黑豬肉 #溫潤恬淡",
        is_new: false,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 125,
      },
      specInventories: [
        {
          name: "和風豚肉角煮飯 (標準)",
          spec: "黑豬肉/附特製辣味噌",
          originalPrice: 390,
          salePrice: 350,
          vipPrice: 320,
          stock: 35,
          cost: 155,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&h=600&fit=crop",
          alt: "和風豚肉角煮飯",
        },
      ],
    },
  ];

  const createProductList4: CreateProductRequest[] = [
    {
      product: {
        categoryUuid: "69eae07f308715a1d92725be",
        categoryName: "DESSERT",
        isShow: true,
        name: "焦糖煉乳布丁",
        subtitle: "Caramel Condensed Milk Pudding",
        description:
          "用奶香超濃郁的煉乳做成的布丁，綿綿密密的布丁有牛奶糖的香氣，搭配苦甜焦糖液。",
        hashTag: "#記憶中的滋味 #綿密口感",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 450,
      },
      specInventories: [
        {
          name: "焦糖煉乳布丁 (單點)",
          spec: "單入/原價",
          originalPrice: 140,
          salePrice: 120,
          vipPrice: 109,
          stock: 50,
          cost: 45,
          photoTemp: "",
        },
        {
          name: "焦糖煉乳布丁 (餐後加購)",
          spec: "搭配套餐折40",
          originalPrice: 120,
          salePrice: 80,
          vipPrice: 80,
          stock: 100,
          cost: 45,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1590080874088-eec64895b423?w=800&h=600&fit=crop",
          alt: "焦糖煉乳布丁主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop",
          alt: "布丁焦糖特寫",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eae07f308715a1d92725be",
        categoryName: "DESSERT",
        isShow: true,
        name: "吃起來像冰淇淋的提拉米蘇",
        subtitle: "Ice Cream Style Tiramisu",
        description:
          "手指餅乾刷上小巷經典配方濃縮，咖啡酒與威士忌，疊加上mascarpone乳酪蛋黃醬。灑上香濃oreo巧克力脆片餅乾。",
        hashTag: "#店長推薦 #危險指數破表",
        is_new: true,
        isHot: true,
        isSpecialOffer: false,
        ratings: 5.0,
        soldQty: 320,
      },
      specInventories: [
        {
          name: "提拉米蘇 (經典)",
          spec: "標準份量",
          originalPrice: 160,
          salePrice: 140,
          vipPrice: 129,
          stock: 30,
          cost: 65,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop",
          alt: "提拉米蘇",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eae07f308715a1d92725be",
        categoryName: "DESSERT",
        isShow: true,
        name: "伯爵奶茶生乳酪",
        subtitle: "Earl Grey Milk Tea Rare Cheesecake",
        description:
          "台南百年老茶行嚴選伯爵茶葉，鮮乳小火熬煮，混入奶油乳酪，倒入特製大麥奶油餅乾裡。",
        hashTag: "#伯爵茶香 #台南老茶行 #清爽不膩",
        is_new: false,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 180,
      },
      specInventories: [
        {
          name: "伯爵奶茶生乳酪",
          spec: "切片",
          originalPrice: 150,
          salePrice: 140,
          vipPrice: 129,
          stock: 20,
          cost: 50,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=600&fit=crop",
          alt: "伯爵奶茶生乳酪",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eae07f308715a1d92725be",
        categoryName: "DESSERT",
        isShow: true,
        name: "檸檬玫瑰塔",
        subtitle: "Lemon Rose Tart",
        description:
          "屏東高樹小農無毒種植台灣原生種檸檬，果汁酸而不嗆，搭配紮實塔皮。",
        hashTag: "#屏東小農 #酸甜適中",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 280,
      },
      specInventories: [
        {
          name: "檸檬玫瑰塔",
          spec: "標準",
          originalPrice: 160,
          salePrice: 140,
          vipPrice: 129,
          stock: 25,
          cost: 55,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&h=600&fit=crop",
          alt: "檸檬玫瑰塔",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eae07f308715a1d92725be",
        categoryName: "DESSERT",
        isShow: true,
        name: "巴斯克乳酪蛋糕",
        subtitle: "Basque Burnt Cheesecake",
        description:
          "頂層的琥珀色澤有焦糖布丁的香氣，重乳酪的超濃奶香重擊味蕾。",
        hashTag: "#巴斯克 #重乳酪",
        is_new: true,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.0,
        soldQty: 150,
      },
      specInventories: [
        {
          name: "巴斯克乳酪蛋糕",
          spec: "標準切片",
          originalPrice: 170,
          salePrice: 150,
          vipPrice: 135,
          stock: 15,
          cost: 60,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1543508282-5c1f427f023f?w=800&h=600&fit=crop",
          alt: "巴斯克乳酪蛋糕",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eae07f308715a1d92725be",
        categoryName: "DESSERT",
        isShow: true,
        name: "特濃巧克力布朗尼佐香草冰淇淋",
        subtitle: "Dark Chocolate Brownie with Vanilla Ice Cream",
        description:
          "加熱後的巧克力布朗尼，放上香草冰淇淋，巧克力醬、巧克力脆片，烤杏仁片。",
        hashTag: "#冰火交融 #巧克力控",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 5.0,
        soldQty: 210,
      },
      specInventories: [
        {
          name: "特濃巧克力布朗尼 (附冰淇淋)",
          spec: "標準組合",
          originalPrice: 180,
          salePrice: 160,
          vipPrice: 149,
          stock: 30,
          cost: 75,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
          alt: "巧克力布朗尼佐冰淇淋",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69eae07f308715a1d92725be",
        categoryName: "DESSERT",
        isShow: true,
        name: "喫茶店的咖啡凍聖代",
        subtitle: "Coffee Jelly Parfait",
        description:
          "底部鋪滿小巷自製咖啡凍，擠上滑順乳霜，放入香草冰淇淋、自製奶油小餅乾。",
        hashTag: "#喫茶店風 #消暑聖品",
        is_new: true,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 90,
      },
      specInventories: [
        {
          name: "咖啡凍聖代",
          spec: "標準份量",
          originalPrice: 210,
          salePrice: 190,
          vipPrice: 175,
          stock: 20,
          cost: 85,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
          alt: "咖啡凍聖代主圖",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop",
          alt: "聖代特寫",
        },
      ],
    },
  ];

  const createProductList5: CreateProductRequest[] = [
    {
      product: {
        categoryUuid: "69ebe075dd062a10542cbfc6",
        categoryName: "DRINK",
        isShow: true,
        name: "美式黑咖啡",
        subtitle: "Americano (Hot/Ice)",
        description:
          "經典美式咖啡，提供熱飲或冰釀選擇。冰釀咖啡採用淺中焙精品豆製作。",
        hashTag: "#精品豆 #每日醒腦",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 520,
      },
      specInventories: [
        {
          name: "美式黑咖啡 (熱)",
          spec: "熱飲/標準",
          originalPrice: 120,
          salePrice: 100,
          vipPrice: 90,
          stock: 999,
          cost: 25,
          photoTemp: "",
        },
        {
          name: "冰釀咖啡",
          spec: "限冰飲/淺中焙",
          originalPrice: 150,
          salePrice: 130,
          vipPrice: 115,
          stock: 50,
          cost: 35,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
          alt: "美式黑咖啡熱飲",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&h=600&fit=crop",
          alt: "冰釀咖啡特寫",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69ebe075dd062a10542cbfc6",
        categoryName: "DRINK",
        isShow: true,
        name: "原味拿鐵",
        subtitle: "Caffè Latte",
        description: "經典義式濃縮搭配綿密鮮奶泡沫。皇冠推薦單品。",
        hashTag: "#皇冠推薦 #經典拿鐵",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 5.0,
        soldQty: 680,
      },
      specInventories: [
        {
          name: "原味拿鐵 (標準)",
          spec: "冰或熱/鮮乳",
          originalPrice: 140,
          salePrice: 120,
          vipPrice: 109,
          stock: 999,
          cost: 45,
          photoTemp: "",
        },
        {
          name: "原味拿鐵 (燕麥奶)",
          spec: "更換燕麥奶/Oatly",
          originalPrice: 170,
          salePrice: 150,
          vipPrice: 139,
          stock: 999,
          cost: 60,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1570914615333-284d0ec5e0be?w=800&h=600&fit=crop",
          alt: "原味拿鐵拉花",
        },
        {
          filename:
            "https://images.unsplash.com/photo-1594910411244-c6f376484e59?w=800&h=600&fit=crop",
          alt: "冰拿鐵分層細節",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69ebe075dd062a10542cbfc6",
        categoryName: "DRINK",
        isShow: true,
        name: "沖繩黑糖牛奶",
        subtitle: "Okinawa Brown Sugar Milk",
        description: "採用日本沖繩黑糖，濃郁焦香與鮮乳完美融合。無咖啡因首選。",
        hashTag: "#黑糖牛奶 #無咖啡因",
        is_new: true,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 210,
      },
      specInventories: [
        {
          name: "沖繩黑糖牛奶 (標準)",
          spec: "冰或熱/鮮乳",
          originalPrice: 140,
          salePrice: 120,
          vipPrice: 109,
          stock: 100,
          cost: 40,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1553784481-933072be2b05?w=800&h=600&fit=crop",
          alt: "沖繩黑糖牛奶",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69ebe075dd062a10542cbfc6",
        categoryName: "DRINK",
        isShow: true,
        name: "伯爵鮮奶茶",
        subtitle: "Earl Grey Milk Tea",
        description: "百年茶行伯爵紅茶，帶有佛手柑香氣，佐以香醇鮮乳。",
        hashTag: "#百年茶行 #伯爵茶香",
        is_new: false,
        isHot: true,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 340,
      },
      specInventories: [
        {
          name: "伯爵鮮奶茶 (標準)",
          spec: "標準/鮮乳",
          originalPrice: 160,
          salePrice: 140,
          vipPrice: 129,
          stock: 999,
          cost: 35,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=600&fit=crop",
          alt: "伯爵鮮奶茶",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69ebe075dd062a10542cbfc6",
        categoryName: "DRINK",
        isShow: true,
        name: "柚柚氣泡飲",
        subtitle: "Grapefruit Sparkling Drink",
        description: "限冰飲。清爽氣泡水搭配香甜柚子醬，夏日消暑最佳選擇。",
        hashTag: "#夏日必喝 #清爽氣泡",
        is_new: true,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.0,
        soldQty: 150,
      },
      specInventories: [
        {
          name: "柚柚氣泡飲 (標準)",
          spec: "限冰飲/標準",
          originalPrice: 150,
          salePrice: 130,
          vipPrice: 115,
          stock: 80,
          cost: 30,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&h=600&fit=crop",
          alt: "柚柚氣泡飲",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69ebe075dd062a10542cbfc6",
        categoryName: "DRINK",
        isShow: true,
        name: "特調漂浮冰咖啡",
        subtitle: "Float Iced Coffee",
        description: "限冰飲。香醇冰咖啡放上一球香草冰淇淋，多重層次享受。",
        hashTag: "#漂浮咖啡 #甜點級飲品",
        is_new: false,
        isHot: false,
        isSpecialOffer: true,
        ratings: 5.0,
        soldQty: 180,
      },
      specInventories: [
        {
          name: "特調漂浮冰咖啡 (標準)",
          spec: "限冰飲/加冰淇淋",
          originalPrice: 170,
          salePrice: 150,
          vipPrice: 139,
          stock: 50,
          cost: 55,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1594631252845-29fc458681b3?w=800&h=600&fit=crop",
          alt: "特調漂浮冰咖啡",
        },
      ],
    },
    {
      product: {
        categoryUuid: "69ebe075dd062a10542cbfc6",
        categoryName: "DRINK",
        isShow: true,
        name: "自家釀製梅酒咖啡",
        subtitle: "Homemade Umeshu Coffee",
        description:
          "內含少量酒精。春曉配方搭配自家釀製梅酒，酒味明確，微醺滋味。開車請勿飲用。",
        hashTag: "#微醺系列 #大人味咖啡",
        is_new: true,
        isHot: false,
        isSpecialOffer: false,
        ratings: 4.5,
        soldQty: 85,
      },
      specInventories: [
        {
          name: "梅酒咖啡 (標準)",
          spec: "限冰飲/含酒精",
          originalPrice: 180,
          salePrice: 160,
          vipPrice: 149,
          stock: 30,
          cost: 70,
          photoTemp: "",
        },
      ],
      photos: [
        {
          filename:
            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
          alt: "梅酒咖啡",
        },
      ],
    },
  ];
  createProductList5.map((item) => {
    productActionWrapper.create(item);
  });
}

export default function TestPage() {
  return (
    <div className="flex gap-4">
      <Button onClick={login}>Login</Button>
      <Button onClick={refresh}>Refresh</Button>
      <Button onClick={annouce}>annouce</Button>
      <Button onClick={createProduct}>Create Product</Button>
    </div>
  );
}
