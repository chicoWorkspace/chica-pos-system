export const paletteTheme = {
  meta: {
    name: "palette",
    direction: "Graphite + Indigo",
  },
  tokens: {
    colors: {
      appBg: "#0F1115",
      surface1: "#161B26",
      surface2: "#242F44",
      surface3: "#111722",
      surfaceOverlay: "#11151B",
      surfaceSoft: "rgba(255,255,255,0.03)",
      borderDefault: "rgba(255,255,255,0.14)",
      borderStrong: "#2D3A56",
      primary: "#6F7BF7",
      primaryHover: "#5C67E8",
      primarySoft: "rgba(111,123,247,0.22)",
      primaryBorder: "rgba(111,123,247,0.25)",
      success: "#34C38F",
      successSoft: "rgba(52,195,143,0.10)",
      warning: "#F5B546",
      warningSoft: "rgba(245,181,70,0.12)",
      danger: "#E35D6A",
      dangerSoft: "rgba(227,93,106,0.10)",
      textMain: "#F3F5F7",
      textStrong: "#D9DEEA",
      textSub: "#B2BED1",
      textMuted: "#6B7280",
      white: "#FFFFFF",
    },
  },
  classes: {
    layout: {
      page: "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-[#F3F5F7]",
      container: "px-4 py-6 md:px-8",
    },

    section: {
      shell:
        "rounded-[32px] border border-white/15 bg-[#161B26]/[0.92] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.34)]",
      card: "rounded-[28px] border-[1.5px] border-[#364b70] bg-gradient-to-b from-slate-800/60 via-slate-900/60 to-slate-950/60 border-r border-slate-700/50 backdrop-blur-xl p-5",
      innerCard: "rounded-3xl border border-white/15 g-[#161B26]/[0.92] p-4",
      mutedBlock: "rounded-2xl border border-white/15 bg-[#242F44] p-4",
      mutedBlock2: "rounded-2xl border border-white/10 bg-white/5 p-4",
      overlayCard:
        "rounded-[28px] border border-white/15 bg-[#111722] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)]",
    },
    text: {
      title: "text-white",
      strong: "text-[#D9DEEA]",
      sub: "text-[#B2BED1]",
      muted: "text-[#6B7280]",
      accent: "text-[#D5D9FF]",
      danger: "text-[#E35D6A]",
    },
    icon: {
      primaryChip:
        "flex h-12 w-12 items-center justify-center rounded-2xl border border-[#6F7BF7]/25 bg-[#6F7BF7]/12 text-[#D5D9FF]",
    },
    badge: {
      primary:
        "inline-flex items-center gap-2 rounded-full border border-[#6F7BF7]/25 bg-[#6F7BF7]/12 px-4 py-2 text-sm text-[#D3D7FF]",
      active:
        "inline-flex items-center rounded-full border border-[#6F7BF7]/25 bg-[#6F7BF7]/12 px-3 py-1 text-xs text-[#D3D7FF]",
      success:
        "inline-flex rounded-full border border-[#34C38F]/20 bg-[#34C38F]/10 px-3 py-1 text-xs text-[#B8F1DA]",
      warning:
        "inline-flex rounded-full border border-[#F5B546]/25 bg-[#F5B546]/12 px-3 py-1 text-xs text-[#F3D59D]",
      danger:
        "inline-flex rounded-full border border-[#E35D6A]/25 bg-[#E35D6A]/10 px-3 py-1 text-xs text-[#FFCCD2]",
      neutral:
        "inline-flex rounded-full border border-white/15 bg-[#242F44] px-3 py-1 text-xs text-[#D9DEEA]",
    },
    button: {
      primary:
        "rounded-2xl bg-[#6F7BF7] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5C67E8]",
      nebula:
        "flex items-center justify-center px-4 py-3 rounded-2xl bg-[#3D5E9E] border border-[#4A70B8] text-sm font-medium text-[#E8EEFF] transition-all hover:bg-[#4A6EB0] active:bg-[#2F4A7D] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.5] disabled:hover:bg-[#3D5E9E]",
      primaryWide:
        "inline-flex items-center rounded-2xl bg-[#6F7BF7] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(111,123,247,0.28)] transition-colors hover:bg-[#5C67E8] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.5] disabled:hover:bg-[#6F7BF7]",
      secondary:
        "rounded-2xl border border-white/15 bg-[#242F44] px-4 py-3 text-sm text-[#D9DEEA] transition-colors hover:bg-[#2E3A54]",
      iconSecondary:
        "rounded-xl border border-white/15 bg-[#242F44] p-3 text-[#D9DEEA] transition-colors hover:bg-[#2E3A54]",
      success:
        "flex items-center justify-between rounded-2xl border border-[#34C38F]/20 bg-[#34C38F]/10  text-sm text-[#B8F1DA]",
      warning:
        "flex items-center justify-between rounded-2xl border border-[#F5B546]/25 bg-[#F5B546]/10  text-sm text-[#F3D59D]",
      danger:
        "flex items-center justify-between rounded-2xl border border-[#E35D6A]/25 bg-[#E35D6A]/10  text-sm text-[#FFCCD2]",
      blue: "rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-200 transition-colors hover:bg-blue-500/20",
      green:
        "rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200 transition-colors hover:bg-green-500/20",
    },
    input: {
      field:
        "px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white outline-none transition-colors placeholder:text-[#B2BED1] focus:border-[#6F7BF7]/80 focus:bg-[#2E3A54]/80",
      staticField:
        "rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#B2BED1] focus:border-[#6F7BF7]/80 focus:bg-[#2E3A54]/80",
      textarea:
        "rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm leading-6 text-[#D9DEEA] outline-none transition-colors placeholder:text-[#B2BED1] focus:border-[#6F7BF7]/80 focus:bg-[#2E3A54]/80",
    },
    select: {
      normal:
        "px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white outline-none transition-colors focus:border-[#6F7BF7]/80 focus:bg-[#2E3A54]/80",
      options:
        "rounded-2xl border border-white/15 bg-[#1A2231] p-2 shadow-[0_16px_36px_rgba(0,0,0,0.32)]",
      option:
        "rounded-xl cursor-pointer px-3 py-2 text-sm text-[#D9DEEA] transition-colors hover:bg-white/5",
      optionActive:
        "rounded-xl cursor-pointer border border-[#6F7BF7]/25 bg-[#6F7BF7]/12 px-3 py-2 text-sm text-[#D3D7FF]",
      optionDanger:
        "rounded-xl px-3 py-2 text-sm text-[#FFCCD2] transition-colors hover:bg-[#E35D6A]/10",
    },
    table: {
      wrapper: "overflow-hidden rounded-2xl border border-[#2D3A56]",
      header:
        "bg-[#2A3550] px-5 py-4 text-sm text-[#D9DEEA] hover:bg-[#2A3550]",
      row: " px-5 py-4",
      rowOdd: "bg-[#141B28]",
      rowEven: "bg-[#1B2433]",
      divider: "divide-y divide-[#2D3A56]",
      media:
        "h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,#1F2740_0%,#4754B7_52%,#6F7BF7_100%)]",
      detailsRow: {
        card: {
          body: "border border-white/10 bg-[#161B26]",
          item: {
            body: "border border-white/10 bg-white/5",
            text: "text-slate-400",
            title: "text-white",
          },
          badge: "border border-white/10 bg-[#0F1320]/70 text-slate-400",
        },
      },
    },
    dialog: {
      shell:
        "rounded-[28px] border border-white/15 bg-[#111722] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)]",
      section:
        "space-y-4 rounded-3xl border border-white/15 bg-white/[0.05] p-4",
      media:
        "rounded-2xl border-2 border-dashed border-white/15 bg-[#1A2231] p-5 text-center",
      mediaIcon:
        "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#6F7BF7]/25 bg-[#6F7BF7]/12 text-[#D5D9FF]",
    },
    productModalStyle: {
      // 彈窗整體本體 (還原成日系暖白、搭配你的軟陰影與細邊)
      overlay:
        "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4",
      dialog:
        "w-full max-w-5xl rounded-[28px] bg-[#F9F8F6] border border-[#1f1f1e26] shadow-[0_24px_64px_rgba(26,25,23,0.1)] overflow-hidden relative flex flex-col max-h-[90vh]",

      // 頂部 Header 區
      header:
        "px-8 py-6 border-b border-[#1f1f1e26] flex items-center justify-between bg-white",
      title: "text-lg font-bold text-[#1A1917]",
      subtitle: "text-xs text-[#6B6760] mt-0.5",
      closeBtn:
        "w-8 h-8 rounded-full flex items-center justify-center bg-[#F0EEE9] hover:bg-[#E6E3DC] text-[#6B6760] transition-colors",

      // 核心內容區 (滾動條與左右雙面板排版)
      contentWrapper:
        "flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-6 scrollbar-clean",

      // 左右兩塊獨立卡片樣式
      panelCard:
        "rounded-2xl border border-[#1f1f1e26] bg-white p-6 shadow-[0_4px_20px_rgba(26,25,23,0.02)] flex flex-col gap-5",
      panelHeader:
        "flex items-center gap-3 border-b border-black/[0.05] pb-4 mb-1",

      // 表單標籤與輸入框
      formLabel: "block text-xs font-semibold text-[#6B6760] mb-1.5",
      formInput:
        "w-full px-4 py-2.5 rounded-xl border border-[#1f1f1e26] bg-[#FBFBFA] focus:bg-white focus:border-[#1A1917] text-sm text-[#1A1917] transition-all outline-none",

      // 規格分頁選鈕 (Active/Inactive)
      tabActive:
        "bg-[#1A1917] text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm",
      tabInactive:
        "bg-[#F0EEE9] text-[#6B6760] hover:bg-[#E6E3DC] px-4 py-1.5 rounded-lg text-xs font-medium transition-colors",
    },
    state: {
      empty:
        "rounded-2xl border border-dashed border-white/15 bg-[#111722] px-4 py-10 text-center",
      loading:
        "rounded-2xl border border-white/15 bg-[#111722] px-4 py-10 text-center",
      infoSuccess:
        "rounded-2xl border border-[#34C38F]/20 bg-[#34C38F]/10 px-4 py-4 text-sm text-[#B8F1DA]",
      infoDanger:
        "rounded-2xl border border-[#E35D6A]/20 bg-[#E35D6A]/10 px-4 py-4 text-sm text-[#FFCCD2]",
    },
    card: {
      default:
        "rounded-2xl bg-[#2B3A58] border-color-[#4B5D84] border border-slate-500/60 bg-slate-800/55 backdrop-blur-sm transition-all duration-300  shadow-2xl hover:shadow-indigo-500/10",
    },
    productCard: {
      bg: "rounded-2xl  border border-[#334E8A] bg-[#1F3056]",
    },
    defaultProductCard: {
      shell:
        "w-full h-full overflow-hidden rounded-2xl border border-[#334E8A] bg-[#1F3056]",
      imageArea: "relative h-44 bg-[#253868]",
      imagePlaceholder: "flex h-full w-full items-center justify-center",
      imagePlaceholderIcon: "h-11 w-11 text-[#6A86B8]",
      imageTopLeftBadges: "absolute left-2.5 top-2.5 flex gap-1.5",
      imageHotBadge:
        "flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#9B3030] bg-[#6B1F1F] px-2 py-0.5 text-[10px] font-medium text-[#FFB0B0]",
      imageDiscountBadge:
        "text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#2A7040] bg-[#1A4428] px-2 py-0.5 text-[10px] font-medium text-[#80ECA0]",
      imageTopRightBadgeWrap: "absolute right-2.5 top-2.5",
      imageLowStockBadge:
        "rounded-full border border-[#8A6010] bg-[#5A3C08] px-2 py-0.5 text-[10px] font-medium text-[#FFD080]",
      imageRatingWrap:
        "absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2 py-0.5",
      imageRatingText: "text-[11px] font-mono text-[#E8EEFF]",
      imageActionsWrap: "absolute bottom-2.5 right-2.5 flex gap-1",
      imageActionButton:
        "flex h-6 w-6 items-center justify-center rounded-lg border border-white/15 bg-black/55",
      imageActionIcon: "h-3 w-3 text-[#C8D8F8]",
      body: "px-3.5 pt-3.5",
      titleRow: "mb-0.5 flex items-start justify-between gap-2",
      title: "text-sm font-medium leading-snug text-[#E8EEFF]",
      category: "shrink-0 pt-px text-[11px] text-[#A0B4DC]",
      subtitle: "text-[11px] leading-relaxed text-[#A0B4DC]",
      tagsWrap: "mb-3 flex flex-wrap gap-1",
      tag: "rounded-lg border border-[#334E8A] bg-[#253868] px-2 py-0.5 text-[11px] text-[#A0B4DC]",
      specLabel: "mb-1 text-[11px] text-[#6A86B8]",
      selectWrap: "relative mb-3",
      select:
        "w-full cursor-pointer appearance-none rounded-lg border border-[#3D5E9E] bg-[#253868] px-3 py-1.5 pr-8 text-[13px] text-[#E8EEFF] focus:outline-none",
      selectOption: "bg-[#253868] text-[#E8EEFF] cursor-pointer",
      selectCaretWrap:
        "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2",
      selectCaretIcon: "h-2.5 w-2.5 text-[#6A86B8]",
      stockWrap: "mb-3",
      stockChip:
        "inline-flex items-center gap-1.5 rounded-lg border border-[#334E8A] bg-[#253868] px-2.5 py-1.5",
      stockText: "text-xs text-[#A0B4DC]",
      stockValue: "text-[13px] font-medium font-mono text-[#E8EEFF]",
      priceSection: "border-t border-[#334E8A] pb-3 pt-3",
      priceRow: "mb-1 flex items-baseline gap-2",
      priceMain: "text-[22px] font-medium font-mono text-[#E8EEFF]",
      priceOrigin: "text-xs font-mono text-[#6A86B8] line-through",
      metaRow: "flex gap-4",
      metaText: "text-[11px] text-[#6A86B8]",
      metaValue: "text-[#A0B4DC]",
      footer:
        "flex items-center justify-between border-t border-[#334E8A] px-3.5 py-3.5",
      qtyWrap: "flex items-center gap-2.5",
      qtyBtn:
        "flex h-8 w-8 items-center justify-center rounded-lg border border-[#4A70B8] bg-[#3D5E9E] text-[#E8EEFF] hover:bg-[#4A6EB0] active:bg-[#2F4A7D] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.5] disabled:hover:bg-[#3D5E9E]",
      qtyText: "w-6 text-center text-base font-medium font-mono text-[#E8EEFF]",
      subtotalWrap: "text-right",
      subtotalLabel: "mb-0.5 text-[11px] text-[#6A86B8]",
      subtotalValue: "text-lg font-medium font-mono text-[#E8EEFF]",
    },
    horizontalProductCard: {
      // 卡片最外層主體，限制最大寬度 2xl，並採用 flex 橫向排列
      shell:
        "w-full h-full rounded-2xl overflow-hidden border border-[#334E8A] bg-[#1F3056]",
      rowWrap: "flex",

      // 左側圖片與標籤區（固定寬度 w-40，高度隨內容撐開）
      imageArea: "relative w-40 shrink-0 bg-[#253868]",
      imagePlaceholder: "w-full h-full flex items-center justify-center",
      imagePlaceholderIcon: "w-10 h-10 text-[#6A86B8]",

      // 左上角標籤區（改為 flex-col 垂直堆疊，適應橫版窄空間）
      imageBadgesWrap: "absolute top-2.5 left-2 flex flex-col gap-1",
      imageHotBadge:
        "flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#6B1F1F] text-[#FFB0B0] border border-[#9B3030]",
      imageDiscountBadge:
        "text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1A4428] text-[#80ECA0] border border-[#2A7040]",
      imageLowStockBadge:
        "text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#5A3C08] text-[#FFD080] border border-[#8A6010]",

      // 左下角評分
      imageRatingWrap:
        "absolute bottom-2.5 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-white/15",
      imageRatingText: "text-[11px] font-mono text-[#E8EEFF]",

      // 右側內容大容器
      contentArea: "flex flex-col flex-1 min-w-0",

      // 上層：商品標題、基本資訊與操作按鈕
      topSection:
        "flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b border-[#334E8A]",
      infoWrap: "min-w-0",
      title: "text-lg font-semibold text-[#E8EEFF] leading-snug",
      metaInfoRow: "flex items-center gap-2 mt-0.5",
      category: "text-[11px] text-[#6A86B8]",
      divider: "text-[#334E8A]",
      subtitle: "text-xs text-[#A0B4DC]",
      tagsWrap: "flex flex-wrap gap-1 mt-2",
      tag: "text-[11px] px-2 py-0.5 rounded-lg text-[#A0B4DC] bg-[#253868] border border-[#334E8A]",

      // 右上角操作按鈕區
      actionsWrap: "flex gap-1 shrink-0",
      actionButton:
        "w-7 h-7 rounded-lg flex items-center justify-center bg-[#253868] border border-[#3D5E9E]",
      actionIcon: "w-3.5 h-3.5 text-[#C8D8F8]",

      // 中層：規格、庫存與價格（橫向一字排開，極致利用空間）
      middleSection: "border-b border-[#334E8A]",
      selectWrap: "flex-1 relative",
      select:
        "w-full px-2.5 py-1.5 text-[13px] text-[#E8EEFF] bg-[#253868] border border-[#3D5E9E] rounded-lg appearance-none pr-7 focus:outline-none",
      selectOption: "bg-[#253868]",
      selectCaretIcon:
        "absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none",

      // 中層庫存晶片
      stockChip:
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#253868] border border-[#334E8A] shrink-0",
      stockDot: "w-1.5 h-1.5 rounded-full bg-[#80ECA0]",
      stockText: "text-xs text-[#A0B4DC]",
      stockValue: "text-[13px] font-medium font-mono text-[#E8EEFF]",

      // 中層右側價格區
      priceWrap: "text-right shrink-0",
      priceRow: "flex items-baseline gap-1.5",
      priceMain: "text-lg font-medium font-mono text-[#E8EEFF]",
      priceOrigin: "text-[11px] line-through font-mono text-[#6A86B8]",
      costText: "text-[11px] text-[#6A86B8]",
      costValue: "text-[#A0B4DC]",

      // 下層：數量增減與小計結帳
      bottomSection: "flex items-center justify-between px-4 py-3",
      qtyWrap: "flex items-center gap-2.5",
      qtyBtn:
        "w-8 h-8 rounded-lg flex items-center justify-center bg-[#253868] border border-[#3D5E9E] text-[#E8EEFF]",
      qtyText: "text-base font-medium font-mono w-6 text-center text-[#E8EEFF]",

      // 右下角小計
      subtotalWrap: "text-right",
      subtotalLabel: "text-[11px] text-[#6A86B8] mb-0.5",
      subtotalValue: "text-lg font-medium font-mono text-[#E8EEFF]",
    },
    compactCard: {
      card: "rounded-xl border border-[#334E8A] bg-[#1F3056] w-full ",
      imgWrap: "relative h-24 bg-[#253868] rounded-t-xl overflow-hidden",
      imgPlaceholderIcon: "w-8 h-8 text-[#6A86B8]",
      badge:
        "absolute top-1.5 left-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#6B1F1F] text-[#FFB0B0] border border-[#9B3030]",
      infoSection: "px-2.5 pt-2.5 pb-2",
      nameText: "text-sm font-semibold text-[#E8EEFF] leading-snug truncate",
      priceText: "text-base font-medium font-mono text-[#E8EEFF] mt-0.5",
      specSection: "px-2.5 pb-2",
      selectWrapper: "relative",
      selectInput:
        "w-full px-2 py-1 cursor-pointer text-[11px] text-[#E8EEFF] bg-[#253868] border border-[#3D5E9E] rounded-lg appearance-none pr-5 focus:outline-none",
      selectOption: "cursor-pointer bg-[#253868] text-[#E8EEFF]",
      selectArrowIcon: "#6A86B8",
      btnSection: "px-2.5 pb-2.5",
      // 這裡預設套用你原先定義好的系統類別，若沒有也可以直接換成普通的 Tailwind 類別
      addBtn:
        "w-full inline-flex items-center justify-center gap-1 rounded-lg bg-[#E0E7FF] text-[#312E81] py-1.5 text-xs font-semibold transition-all hover:bg-[#D2DBFF] active:scale-95",
      actionButton:
        "w-7 h-7 rounded-lg flex items-center justify-center bg-[#253868] border border-[#3D5E9E]",
      actionIcon: "w-3.5 h-3.5 text-[#C8D8F8]",
    },
    cart: {
      wrapperSection:
        "mt-6 bg-[#F5F4F1] rounded-[32px] border border-black/[0.07] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.22)]",
      headerRow: "mb-4 flex items-center justify-between",
      headerTitleWrap: "flex items-center gap-2",
      headerIcon: "h-5 w-5 text-[#1E2A42]",
      headerTitle: "text-lg font-semibold text-[#1A1917]",

      // 頂部右側主題晶片（深藍版：淺藍底深藍字）
      themeChip:
        "rounded-full bg-[#E0E7FF] border border-[#A5B4FC] px-3 py-1 text-xs text-[#312E81] font-medium",

      // 購物車主面板（深藍夜空底）
      panel:
        "mx-auto max-w-[360px] rounded-l-[28px] bg-[#1E2A42] !border-2 border-[#364B70]  shadow-[0_12px_28px_rgba(15,23,42,0.10)]",

      // 「今日訂單」小狀態欄
      statusRow:
        "flex items-center justify-between rounded-2xl bg-[#23324D] border border-[#3A5179] px-3 py-2",
      statusTitleWrap: "flex items-center gap-2 text-sm text-[#F3F6FF]",
      statusIcon: "h-4 w-4 text-[#E0E7FF]",

      // 狀態晶片（科技亮綠）
      successChip:
        "inline-flex items-center gap-1 rounded-full bg-[rgba(52,195,143,0.18)] border border-[#34C38F]/30 px-2 py-0.5 text-xs text-[#B8F1DA] font-medium",
      successIcon: "h-3.5 w-3.5",

      groupWrap: "space-y-4",
      groupHeader:
        "mb-2 flex items-center gap-2 text-xs font-medium text-[#D3DCF0]",
      groupIcon: "h-3.5 w-3.5 text-[#E0E7FF]",
      groupList: "space-y-2",

      // 單一商品品項卡片
      itemCard: "rounded-2xl bg-[#23324D] border border-[#3A5179] p-3",
      itemMainRow: "flex items-start gap-3",

      // 商品小圖區
      itemImgWrap:
        "relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#2D3E5E] border border-[#3A5179]",
      itemImg: "object-cover",

      itemInfo: "min-w-0 flex-1",
      itemName: "truncate text-sm font-semibold text-[#F3F6FF]",
      itemMetaRow: "mt-0.5 flex items-center gap-2",
      itemSpec: "text-xs text-[#A5B4CF]",

      // 商品特殊標籤（科技亮黃）與普通標籤
      warningChip:
        "rounded-full bg-[rgba(245,181,70,0.18)] border border-[#F5B546]/30 px-1.5 py-0.5 text-[10px] text-[#F7E1B0] font-medium",
      normalChip:
        "rounded-full bg-[#2C3E61] border border-[#3A5179] px-1.5 py-0.5 text-[10px] text-[#D3DCF0]",

      // 刪除按鈕
      trashBtn:
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/25 active:scale-95",
      trashIcon: "h-3.5 w-3.5",

      itemBottomRow: "mt-3 flex items-center justify-between gap-2",
      priceCalcText: " text-base font-bold text-[#A5B4CF]",
      priceCalcBold: "font-bold text-[#F3F6FF] font-mono",

      // 數量按鈕組
      qtyActionWrap: "flex items-center gap-2",
      qtyMinusBtn:
        "flex h-8 w-8 items-center justify-center rounded-lg bg-[#2C3E61] border border-[#4A638F.] text-[#DDE6FA] transition-all hover:bg-[#344B75] active:scale-90",
      qtyPlusBtn:
        "flex h-8 w-8 items-center justify-center rounded-lg bg-[#E0E7FF] border border-[#A5B4FC] text-[#312E81] transition-all hover:bg-[#D2DBFF] active:scale-90",
      qtyMinusIcon: "h-3.5 w-3.5",
      qtyPlusIcon: "h-3.5 w-3.5",
      qtyValueDisplay:
        "min-w-[40px] rounded-lg bg-[#23324D] border border-[#3A5179] px-2 py-1 text-center text-sm font-semibold text-[#F3F6FF] font-mono",

      // 結帳明細收據區
      summaryCard:
        "mt-4 rounded-2xl bg-[#23324D] border border-[#3A5179] p-3 text-sm",
      summaryRow: "flex items-center justify-between text-[#D3DCF0]",
      summaryRowMuted: "mt-1 flex items-center justify-between text-[#D3DCF0]",
      summaryDivider: "mt-2 border-t border-[#3A5179] pt-2",
      totalRow:
        "flex items-center justify-between text-base font-semibold text-[#F3F6FF]",
      totalValue: "font-mono text-lg text-[#F3F6FF]",

      // 付款方式網格
      paymentGrid: "mt-4 grid grid-cols-3 gap-2",
      paymentBtnActive:
        "inline-flex items-center justify-center gap-1 rounded-xl bg-[#E0E7FF] border border-[#A5B4FC] px-2 py-2 text-xs font-medium text-[#312E81] shadow-sm transition-all active:scale-95",
      paymentBtnNormal:
        "inline-flex items-center justify-center gap-1 rounded-xl bg-[#23324D] border border-[#3A5179] px-2 py-2 text-xs font-medium text-[#D3DCF0] transition-colors hover:bg-[#2A3B5C] active:scale-95",
      paymentIcon: "h-3.5 w-3.5",

      // 最下方結帳大按鈕（沿用系統的主按鈕類別，這裡預設填入深色系寬按鈕）
      checkoutBtn:
        "mt-4 flex w-full justify-center items-center gap-2 rounded-xl bg-[#E0E7FF] text-[#312E81] font-semibold py-3 text-sm shadow-md transition-transform duration-150 ease-out hover:bg-[#D2DBFF] active:scale-[0.98]",
      checkoutIcon: "h-4 w-4",
    },
    viewSwitcher: {
      outerPosition: "w-auto flex",
      container:
        "ml-auto relative flex p-1 border-[1.5px] border-[#364b70] bg-gradient-to-b from-slate-800/60 via-slate-900/60 to-slate-950/60 border-r border-slate-700/50 backdrop-blur-xl  rounded-md",
      // 選中指示塊（保留原本的亮眼藍紫）
      indicator:
        "absolute top-1 left-1 w-10 h-10 bg-[#7678ED] rounded-sm transition-all duration-300 ease-out",
      // 按鈕顏色控制邏輯
      btnActive: "text-white",
      btnInactive: "text-slate-500 hover:text-slate-300",
      btnBase:
        "relative z-10 flex items-center justify-center w-10 h-10 transition-colors",
    },
    sidebar: {
      wrapper:
        "hidden lg:flex flex-col h-screen rounded-r-[28px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-r border-slate-700/50 backdrop-blur-xl relative",
      glow: "absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none",
      borderStyle: { border: "1.5px solid #364B70" },

      divider: "border-b border-slate-700/30",
      sectionDivider: "my-4 border-t border-slate-700/30",

      navBtnActive: "bg-blue-500/20 border border-blue-500/40 text-white",
      navBtnInactive:
        "hover:bg-slate-700/50 border border-transparent text-slate-400",

      popoverContent:
        "w-96 text-white rounded-lg shadow-xl px-4 py-4 z-50 backdrop-blur-sm border border-white/10 bg-[#1e2a42]",
      popoverItem:
        "py-3 px-2 cursor-pointer rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300",
      popoverArrow: "fill-[#1e2a42]",

      loadingSpinner:
        "w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin",

      userBtn:
        "w-full h-8 rounded-lg bg-slate-700/50 hover:bg-slate-600 font-semibold text-xs transition-colors text-slate-400",

      themeToggler: {
        container:
          "flex p-1 bg-slate-950/80 rounded-xl border border-slate-800 relative items-center",
        btnActive: "bg-[#334E8A] text-white shadow-inner font-semibold",
        btnInactive: "text-slate-500 hover:text-slate-300 font-medium",
      },
    },
    mobileNav: {
      wrapper: "block lg:hidden fixed bottom-1.5 left-0 z-[80] w-full px-2.5",
      nav: "px-5 py-2 relative  rounded-full bg-gradient-to-t from-slate-950/60 via-slate-900/60 to-slate-800/95 backdrop-blur-sm border border-slate-700/50",
      btnActive: "bg-blue-500 shadow-lg shadow-blue-500/30 text-white",
      btnInactive: "hover:bg-slate-700/60 text-slate-400",
      iconColorActive: "#fff",
      iconColorInactive: "#64748b",
      textColorActive: "text-white",
      textColorInactive: "text-slate-400",

      settingsBtn:
        "flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl hover:bg-slate-700/60 text-slate-400 transition-all",

      safeAreaBg: "bg-slate-950",
    },
    loadingIndicato: {
      container: "w-full flex justify-center items-center py-4",
      spinner:
        "w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin",
    },
    metricsCard: {
      text: {
        title: "text-white",
        muted: "text-slate-400",
        value: "text-lg font-mono font-medium text-[#E8EEFF]",
      },
    },
    hr: {
      body: "border-t border-gray-700",
    },
    header: {
      bg: " bg-white/5  backdrop-blur-sm border border-white/10",
      text: "text-white",
      announcement: {
        bg: "border border-black/[0.07] bg-white/5",
        text: "text-slate-200",
        textMuted: "text-slate-400",
      },
      tab: {
        item: "border-white/15 bg-[#26314A] hover:bg-[#2E3F80] transition-colors  text-body",
        iteamActive:
          "border-white/15 bg-[#6F7BF7]  hover:bg-[#5C67E8]  text-body",
      },
    },
    login: {
      pageBg:
        "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 font-sans transition-colors duration-500",
      floatingIcon: "absolute text-slate-400/20 hidden lg:block",

      mainCard:
        "relative w-full max-w-6xl lg:h-[740px] h-full flex flex-col flex-col-reverse md:flex-row rounded-[32px] border border-white/20 bg-slate-900/60 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden z-10",
      decorations: "block",
      glowBall:
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none",

      leftPanel:
        "md:w-[42%] bg-white/5 p-10 pb-4 flex flex-col border-r border-white/10 z-10 relative",
      logoBg: "bg-white p-1 rounded-lg",
      textTitle: "text-2xl font-black text-white tracking-tighter leading-none",
      textPrimary: "text-base font-medium text-slate-100 tracking-wide",
      textSecondary: "text-[12px] text-slate-200 mb-4 leading-relaxed",
      textMuted: "text-[10px] text-slate-500 mt-1 font-mono uppercase",

      statusSectionTitle:
        "text-[10px] font-black text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-widest",
      statusBox: "mb-6 p-4 rounded-2xl bg-slate-950/40 border border-white/10",
      announcementTitle:
        "text-xs font-bold text-slate-300 uppercase tracking-[0.15em] flex items-center gap-2 mb-4",
      announcementItem:
        "py-2 px-4 cursor-pointer rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 animate-fade-in",
      announcementText: "text-[13px] font-bold text-white flex-1",
      announcementTime: "ml-1 text-[11px] text-slate-400 font-mono text-nowrap",

      infraTitle: "text-[9px] text-slate-500 uppercase tracking-widest mb-3",
      infraItem:
        "text-[11px] text-slate-300 flex items-center gap-2 whitespace-nowrap",
      infraIcons: {
        network: "text-blue-400",
        code: "text-green-400",
        database: "text-purple-400",
        harddrive: "text-orange-400",
        zap: "text-yellow-400",
        smartphone: "text-violet-400",
      },

      rightPanel:
        "flex-1 p-12 lg:p-20 flex flex-col justify-center relative bg-slate-900/40",
      formTitle:
        "text-4xl font-black text-white mb-3 tracking-tighter family-mono",
      formSubtitle: "text-indigo-400 font-bold text-sm tracking-widest mb-4",
      formDesc: "text-slate-400 text-xs leading-relaxed opacity-80",

      inputLabel:
        "text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1",
      inputBox:
        "w-full h-14 bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-12 text-white placeholder:text-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all",
      inputIcon:
        "absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors",
      inputFocusBlur:
        "absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-xl -z-10 blur",

      toggleBgActive: "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]",
      toggleBgInactive: "bg-slate-800 border border-white/10",
      toggleThumbActive:
        "translate-x-4 shadow-[0_0_5px_rgba(255,255,255,1)] bg-white",
      toggleThumbInactive: "translate-x-0 bg-white",
      toggleText:
        "text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider",

      submitBtn:
        "w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-600 disabled:shadow-none text-white font-black rounded-2xl shadow-xl shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group",
      errorBox:
        "mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm",
      errorText: "text-red-300 text-sm",

      developerTitle: "text-[13px] text-slate-400 mb-2",
      developerCreds: "text-[13px] text-slate-500 font-mono",
      copyrightText: "text-[12px] text-slate-200 font-mono tracking-wide flex",

      status: {
        ACTIVE: {
          textColor: "text-emerald-300",
          bgColor: "bg-emerald-500/20",
          borderColor: "border-emerald-500/40",
          dotColor: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
          label: "ACTIVE",
          animate: "",
        },
        CONNECTING: {
          textColor: "text-amber-300",
          bgColor: "bg-amber-500/20",
          borderColor: "border-amber-500/40",
          dotColor: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
          label: "CONNECTING",
          animate: "animate-pulse",
        },
        FAILED: {
          textColor: "text-rose-200",
          bgColor: "bg-rose-600/30",
          borderColor: "border-rose-500/50",
          dotColor: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
          label: "FAILED",
          animate: "",
        },
        OFFLINE: {
          textColor: "text-slate-300",
          bgColor: "bg-slate-700/40",
          borderColor: "border-slate-500/30",
          dotColor: "bg-slate-400",
          label: "OFFLINE",
          animate: "",
        },
      },
    },
  },
} as const;
