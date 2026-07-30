
export const iconWhitelist = [
  // 商品 / 通用
  "ShoppingCart",

  // 食物
  "Utensils",
  "Sandwich",
  "Drumstick",
  "Fish",
  "Pizza",
  "Egg",
  "Salad",
  "Carrot",
  "Apple",
  "UtensilsCrossed",

  // 點心
  "Cookie",
  "Cake",
  "IceCream",
  "Candy",

  // 飲料
  "CupSoda",
  "Coffee",
  "Beer",
  "Wine",
  "Martini",
] as const;

export type IconName = typeof iconWhitelist[number];
