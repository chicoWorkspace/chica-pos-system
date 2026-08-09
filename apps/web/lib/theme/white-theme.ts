export const whiteTheme = {
  meta: {
    name: "white",
    direction: "Ivory + Stone",
  },
  tokens: {
    colors: {
      appBg: "#F5F4F1",
      surface1: "#FFFFFF",
      surface2: "#F0EEE9",
      surface3: "#FAF9F7",
      surfaceOverlay: "#FFFFFF",
      surfaceSoft: "rgba(0,0,0,0.02)",
      borderDefault: "rgba(0,0,0,0.10)",
      borderStrong: "#D4D0C8",
      primary: "#3D52A0",
      primaryHover: "#2E3F80",
      primarySoft: "rgba(61,82,160,0.10)",
      primaryBorder: "rgba(61,82,160,0.20)",
      success: "#1A7F5A",
      successSoft: "rgba(26,127,90,0.08)",
      warning: "#B76E00",
      warningSoft: "rgba(183,110,0,0.08)",
      danger: "#C0373F",
      dangerSoft: "rgba(192,55,63,0.08)",
      textMain: "#1A1917",
      textStrong: "#2E2C28",
      textSub: "#6B6760",
      textMuted: "#A8A49C",
      white: "#FFFFFF",
    },
  },
  classes: {
    layout: {
      page: "bg-[#F5F4F1] text-[#1A1917]",
      container: "px-4 py-6 md:px-8",
    },
    section: {
      shell:
        "rounded-[32px] border border-black/[0.08] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]",
      card: "rounded-[28px] bg-gradient-to-t from-[#F9F8F6]/60 via-white/60 to-white/80 backdrop-blur-lg border border-[#1f1f1e26] p-5",
      innerCard: "rounded-3xl border border-black/[0.07] g-[#F5F4F1] p-4",
      mutedBlock: "rounded-2xl border border-black/[0.07] bg-[#F0EEE9] p-4",
      mutedBlock2: "rounded-2xl border border-black/[0.07] bg-[#F0EEE9] p-4",
      overlayCard:
        "rounded-[28px] border border-black/[0.08] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
    },

    text: {
      title: "text-[#1A1917]",
      strong: "text-[#2E2C28]",
      sub: "text-[#6B6760]",
      muted: "text-[#A8A49C]",
      accent: "text-[#3D52A0]",
      danger: "text-[#C0373F]",
    },
    icon: {
      primaryChip:
        "flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3D52A0]/20 bg-[#3D52A0]/08 text-[#3D52A0]",
    },
    badge: {
      primary:
        "inline-flex items-center gap-2 rounded-full border border-[#3D52A0]/20 bg-[#3D52A0]/08 px-4 py-2 text-sm text-[#3D52A0]",
      active:
        "inline-flex items-center rounded-full border border-[#3D52A0]/20 bg-[#3D52A0]/08 px-3 py-1 text-xs text-[#3D52A0]",
      success:
        "inline-flex rounded-full border border-[#1A7F5A]/20 bg-[#1A7F5A]/08 px-3 py-1 text-xs text-[#1A7F5A]",
      warning:
        "inline-flex rounded-full border border-[#B76E00]/20 bg-[#B76E00]/08 px-3 py-1 text-xs text-[#8A5300]",
      danger:
        "inline-flex rounded-full border border-[#C0373F]/20 bg-[#C0373F]/08 px-3 py-1 text-xs text-[#C0373F]",
      neutral:
        "inline-flex rounded-full border border-black/[0.10] bg-[#F0EEE9] px-3 py-1 text-xs text-[#2E2C28]",
    },
    button: {
      primary:
        "rounded-2xl bg-[#3D52A0] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2E3F80]",
      nebula:
        "flex items-center justify-center px-4 py-3 rounded-2xl bg-[#EEF0F9] border border-[#C2C8E8] text-sm font-medium text-[#3D52A0] transition-all hover:bg-[#E0E4F4] active:bg-[#CDD3EE] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#EEF0F9]",
      primaryWide:
        "inline-flex items-center rounded-2xl bg-[#3D52A0] px-5 py-3 text-sm font-medium text-white shadow-[0_4px_14px_rgba(61,82,160,0.22)] transition-colors hover:bg-[#2E3F80] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#3D52A0]",
      secondary:
        "rounded-2xl border border-black/[0.10] bg-white px-4 py-3 text-sm text-[#2E2C28] transition-colors hover:bg-[#F0EEE9]",
      iconSecondary:
        "rounded-xl border border-black/[0.10] bg-white p-3 text-[#2E2C28] transition-colors hover:bg-[#F0EEE9]",
      success:
        "flex items-center justify-between rounded-2xl border border-[#1A7F5A]/40 bg-[#1A7F5A]/08 text-sm text-[#0ceb91]",
      warning:
        "flex items-center justify-between rounded-2xl border border-[#B76E00]/20 bg-[#B76E00]/08 text-sm text-[#8A5300]",
      danger:
        "flex items-center justify-between rounded-2xl border border-[#C0373F]/20 bg-[#C0373F]/08 text-sm text-[#C0373F]",
      blue: "rounded-2xl border border-blue-500/20 bg-blue-50 px-4 py-3 text-sm text-blue-700 transition-colors hover:bg-blue-100",
      green:
        "rounded-2xl border border-green-500/20 bg-green-50 px-4 py-3 text-sm text-green-700 transition-colors hover:bg-green-100",
    },
    input: {
      field:
        "px-4 py-3 rounded-xl bg-white border border-black/[0.12] text-sm text-[#1A1917] outline-none transition-colors placeholder:text-[#A8A49C] focus:border-[#3D52A0]/60 focus:bg-white",
      staticField:
        "rounded-2xl border border-black/[0.10] bg-white px-4 py-3 text-sm text-[#1A1917] outline-none transition-colors placeholder:text-[#A8A49C] focus:border-[#3D52A0]/60",
      textarea:
        "rounded-2xl border border-black/[0.10] bg-white px-4 py-3 text-sm leading-6 text-[#2E2C28] outline-none transition-colors placeholder:text-[#A8A49C] focus:border-[#3D52A0]/60",
    },
    select: {
      normal:
        "px-4 py-3 rounded-xl bg-white border border-black/[0.12] text-sm text-[#1A1917] outline-none transition-colors focus:border-[#3D52A0]/60",
      options:
        "rounded-2xl border border-black/[0.10] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.10)]",
      option:
        "rounded-xl cursor-pointer px-3 py-2 text-sm text-[#2E2C28] transition-colors hover:bg-[#F0EEE9]",
      optionActive:
        "rounded-xl cursor-pointer border border-[#3D52A0]/20 bg-[#3D52A0]/08 px-3 py-2 text-sm text-[#3D52A0]",
      optionDanger:
        "rounded-xl px-3 py-2 text-sm text-[#C0373F] transition-colors hover:bg-[#C0373F]/08",
    },
    table: {
      wrapper: "overflow-hidden rounded-2xl border border-black/[0.08]",
      header: "bg-[#F0EEE9] px-5 py-4 text-sm text-[#2E2C28] font-medium",
      row: "px-5 py-4",
      rowOdd: "bg-white",
      rowEven: "bg-[#FAF9F7]",
      divider: "divide-y divide-black/[0.06]",
      media:
        "h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,#E8EBF5_0%,#B8C0DE_52%,#8A98CC_100%)]",
      detailsRow: {
        card: {
          body: "border border-black/[0.08] bg-white  shadow-[0_8px_32px_rgba(0,0,0,0.10)]",
          item: {
            body: "border border-black/[0.07] bg-[#F5F4F1]",
            text: "text-[#A8A49C]",
            title: "text-[#1A1917]",
          },
          badge: "border border-black/[0.07] bg-[#F0EEE9] text-[#6B6760]",
        },
      },
    },
    dialog: {
      shell:
        "rounded-[28px] border border-black/[0.08] bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.10)]",
      section:
        "space-y-4 rounded-3xl border border-black/[0.07] bg-[#F5F4F1] p-4",
      media:
        "rounded-2xl border-2 border-dashed border-black/[0.12] bg-[#F5F4F1] p-5 text-center",
      mediaIcon:
        "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3D52A0]/20 bg-[#3D52A0]/08 text-[#3D52A0]",
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
        "rounded-2xl border border-dashed border-black/[0.12] bg-[#F5F4F1] px-4 py-10 text-center",
      loading:
        "rounded-2xl border border-black/[0.08] bg-[#F5F4F1] px-4 py-10 text-center",
      infoSuccess:
        "rounded-2xl border border-[#1A7F5A]/20 bg-[#1A7F5A]/06 px-4 py-4 text-sm text-[#1A7F5A]",
      infoDanger:
        "rounded-2xl border border-[#C0373F]/20 bg-[#C0373F]/06 px-4 py-4 text-sm text-[#C0373F]",
    },
    card: {
      default:
        "rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(61,82,160,0.10)]",
    },
    productCard: {
      bg: "rounded-2xl border border-black/[0.08] bg-white",
    },
    defaultProductCard: {
      shell:
        "w-full h-full shadow-lg overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)]",
      imageArea: "relative h-44 bg-[#F0EEE9]",
      imagePlaceholder: "flex h-full w-full items-center justify-center",
      imagePlaceholderIcon: "h-11 w-11 text-[#A8A49C]",
      imageTopLeftBadges: "absolute left-2.5 top-2.5 flex gap-1.5",
      imageHotBadge:
        "flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#C0373F]/25 bg-white px-2 py-0.5 text-[10px] font-medium text-[#C0373F] shadow-sm",
      imageDiscountBadge:
        "text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#1A7F5A]/25 bg-white px-2 py-0.5 text-[10px] font-medium text-[#1A7F5A] shadow-sm",
      imageTopRightBadgeWrap: "absolute right-2.5 top-2.5",
      imageLowStockBadge:
        "rounded-full border border-[#B76E00]/25 bg-white px-2 py-0.5 text-[10px] font-medium text-[#8A5300] shadow-sm",
      imageRatingWrap:
        "absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full border border-black/[0.10] bg-white px-2 py-0.5 shadow-sm",
      imageRatingText: "text-[11px] font-mono text-[#1A1917]",
      imageActionsWrap: "absolute bottom-2.5 right-2.5 flex gap-1",
      imageActionButton:
        "flex h-6 w-6 items-center justify-center rounded-lg border border-black/[0.10] bg-white shadow-sm",
      imageActionIcon: "h-3 w-3 text-[#6B6760]",
      body: "px-3.5 pt-3.5",
      titleRow: "mb-0.5 flex items-start justify-between gap-2",
      title: "text-sm font-medium leading-snug text-[#1A1917]",
      category: "shrink-0 pt-px text-[11px] text-[#A8A49C]",
      subtitle: "text-[11px] leading-relaxed text-[#6B6760]",
      tagsWrap: "mb-3 flex flex-wrap gap-1",
      tag: "rounded-lg border border-black/[0.08] bg-[#F0EEE9] px-2 py-0.5 text-[11px] text-[#6B6760]",
      specLabel: "mb-1 text-[11px] text-[#A8A49C]",
      selectWrap: "relative mb-3",
      select:
        "w-full cursor-pointer appearance-none rounded-lg border border-black/[0.10] bg-[#F5F4F1] px-3 py-1.5 pr-8 text-[13px] text-[#1A1917] focus:outline-none",
      selectOption: "bg-white text-[#1A1917] cursor-pointer",
      selectCaretWrap:
        "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2",
      selectCaretIcon: "h-2.5 w-2.5 text-[#A8A49C]",
      stockWrap: "mb-3",
      stockChip:
        "inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-[#F0EEE9] px-2.5 py-1.5",
      stockText: "text-xs text-[#6B6760]",
      stockValue: "text-[13px] font-medium font-mono text-[#1A1917]",
      priceSection: "border-t border-black/[0.07] pb-3 pt-3",
      priceRow: "mb-1 flex items-baseline gap-2",
      priceMain: "text-[22px] font-medium font-mono text-[#1A1917]",
      priceOrigin: "text-xs font-mono text-[#A8A49C] line-through",
      metaRow: "flex gap-4",
      metaText: "text-[11px] text-[#A8A49C]",
      metaValue: "text-[#6B6760]",
      footer:
        "flex items-center justify-between border-t border-black/[0.07] px-3.5 py-3.5",
      qtyWrap: "flex items-center gap-2.5",
      qtyBtn:
        "flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.10] bg-[#F0EEE9] text-[#2E2C28] hover:bg-[#E8E5DD] transition-transform duration-150 ease-out active:scale-90 disabled:opacity-70 disabled:text-[#A09E96] disabled:border-black/[0.03] disabled:bg-[#F5F3EE] disabled:cursor-not-allowed disabled:hover:bg-[#F0EEE9] disabled:scale-100",
      qtyText: "w-6 text-center text-base font-medium font-mono text-[#1A1917]",
      subtotalWrap: "text-right",
      subtotalLabel: "mb-0.5 text-[11px] text-[#A8A49C]",
      subtotalValue: "text-lg font-medium font-mono text-[#1A1917]",
    },
    horizontalProductCard: {
      shell:
        "w-full h-full shadow-lg rounded-2xl overflow-hidden border border-black/[0.08] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)] shadow-lg",
      rowWrap: "flex",

      imageArea: "relative w-40 shrink-0 bg-[#F0EEE9]",
      imagePlaceholder: "w-full h-full flex items-center justify-center",
      imagePlaceholderIcon: "w-10 h-10 text-[#A8A49C]",

      imageBadgesWrap: "absolute top-2.5 left-2 flex flex-col gap-1",
      imageHotBadge:
        "flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#C0373F]/25 bg-white text-[#C0373F] shadow-sm",
      imageDiscountBadge:
        "text-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#1A7F5A]/25 bg-white text-[#1A7F5A] shadow-sm",
      imageLowStockBadge:
        "text-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#B76E00]/25 bg-white text-[#8A5300] shadow-sm",

      imageRatingWrap:
        "absolute bottom-2.5 left-2 flex items-center gap-1 rounded-full border border-black/[0.10] bg-white px-2 py-0.5 shadow-sm",
      imageRatingText: "text-[11px] font-mono text-[#1A1917]",

      contentArea: "flex flex-col flex-1 min-w-0",

      topSection:
        "flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b border-black/[0.07]",
      infoWrap: "min-w-0",
      title: "text-lg font-semibold leading-snug text-[#1A1917]",
      metaInfoRow: "flex items-center gap-2 mt-0.5",
      category: "text-[11px] text-[#A8A49C]",
      divider: "text-black/[0.15]",
      subtitle: "text-[11px] leading-relaxed text-[#6B6760]",
      tagsWrap: "flex flex-wrap gap-1 mt-2",
      tag: "rounded-lg border border-black/[0.08] bg-[#F0EEE9] px-2 py-0.5 text-[11px] text-[#6B6760]",

      actionsWrap: "flex gap-1 shrink-0",
      actionButton:
        "flex h-6 w-6 items-center justify-center rounded-lg border border-black/[0.10] bg-white shadow-sm",
      actionIcon: "h-3 w-3 text-[#6B6760]",

      middleSection: "border-b border-black/[0.07]",
      selectWrap: "flex-1 relative",
      select:
        "w-full cursor-pointer appearance-none rounded-lg border border-black/[0.10] bg-[#F5F4F1] px-2.5 py-1.5 pr-8 text-[13px] text-[#1A1917] focus:outline-none",
      selectOption: "bg-white text-[#1A1917] cursor-pointer",
      selectCaretIcon:
        "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-[#A8A49C]",

      stockChip:
        "inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-[#F0EEE9] px-2.5 py-1.5 shrink-0",
      stockDot: "w-1.5 h-1.5 rounded-full bg-[#80ECA0]",
      stockText: "text-xs text-[#6B6760]",
      stockValue: "text-[13px] font-medium font-mono text-[#1A1917]",

      priceWrap: "text-right shrink-0",
      priceRow: "flex items-baseline gap-1.5",
      priceMain: "text-lg font-medium font-mono text-[#1A1917]",
      priceOrigin: "text-xs font-mono text-[#A8A49C] line-through",
      costText: "text-[11px] text-[#A8A49C]",
      costValue: "text-[#6B6760]",

      bottomSection: "flex items-center justify-between px-4 py-3",
      qtyWrap: "flex items-center gap-2.5",
      qtyBtn:
        "flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.10] bg-[#F0EEE9] text-[#2E2C28] hover:bg-[#E8E5DD] transition-transform duration-150 ease-out active:scale-90 disabled:opacity-70 disabled:text-[#A09E96] disabled:border-black/[0.03] disabled:bg-[#F5F3EE] disabled:cursor-not-allowed disabled:hover:bg-[#F0EEE9] disabled:scale-100",
      qtyText: "w-6 text-center text-base font-medium font-mono text-[#1A1917]",

      subtotalWrap: "text-right",
      subtotalLabel: "mb-0.5 text-[11px] text-[#A8A49C]",
      subtotalValue: "text-lg font-medium font-mono text-[#1A1917]",
    },
    compactCard: {
      card: "rounded-xl border border-black/[0.06] bg-white w-full  shadow-[0_8px_20px_rgba(26,25,23,0.04)]",

      imgWrap: "relative h-24 bg-[#F0EEE9] rounded-t-xl overflow-hidden",
      imgPlaceholderIcon: "w-8 h-8 text-[#A8A49C]",

      badge:
        "absolute top-1.5 left-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#C0373F]/[0.08] text-[#C0373F] border border-[#C0373F]/20",

      infoSection: "px-2.5 pt-2.5 pb-2",
      nameText: "text-sm font-semibold text-[#1A1917] leading-snug truncate",
      priceText: "text-base font-semibold font-mono text-[#1A1917] mt-0.5",

      specSection: "px-2.5 pb-2",
      selectWrapper: "relative",
      selectInput:
        "w-full px-2 py-1 cursor-pointer text-[11px] text-[#1A1917] bg-[#F5F4F1] border border-black/[0.08] rounded-lg appearance-none pr-5 focus:outline-none",
      selectOption: "cursor-pointer bg-white text-[#1A1917]",
      selectArrowIcon: "#6B6760",

      btnSection: "px-2.5 pb-2.5",

      addBtn:
        "w-full inline-flex items-center justify-center gap-1 rounded-lg bg-[#1A1917] border border-[#1A1917] py-1.5 text-xs text-white font-medium shadow-sm transition-all hover:opacity-90 active:scale-95",
      actionButton:
        "flex h-6 w-6 items-center justify-center rounded-lg border border-black/[0.10] bg-white shadow-sm",
      actionIcon: "h-3 w-3 text-[#6B6760]",
    },
    cart: {
      wrapperSection:
        "mt-6 bg-[#F5F4F1] rounded-[32px] border border-black/[0.07] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.22)]",
      headerRow: "mb-4 flex items-center justify-between",
      headerTitleWrap: "flex items-center gap-2",
      headerIcon: "h-5 w-5 text-[#1A1917]",
      headerTitle: "text-lg font-semibold text-[#1A1917]",

      themeChip:
        "rounded-full bg-[#1A1917] border border-[#1A1917] px-3 py-1 text-xs text-white font-medium",

      panel:
        "mx-auto max-w-[360px] rounded-l-[28px] bg-white !border-1.5 border-[#1f1f1e26]  shadow-[0_12px_28px_rgba(15,23,42,0.06)]",

      statusRow:
        "flex items-center justify-between rounded-2xl bg-[#F5F4F1] border border-black/[0.06] px-3 py-2",
      statusTitleWrap: "flex items-center gap-2 text-sm text-[#1A1917]",
      statusIcon: "h-4 w-4 text-[#1A1917]",

      successChip:
        "inline-flex items-center gap-1 rounded-full bg-[#1A7F5A]/[0.08] border border-[#1A7F5A]/25 px-2 py-0.5 text-xs text-[#1A7F5A] font-medium",
      successIcon: "h-3.5 w-3.5",

      groupWrap: "space-y-4",
      groupHeader:
        "mb-2 flex items-center gap-2 text-xs font-medium text-[#6B6760]",
      groupIcon: "h-3.5 w-3.5 text-[#1A1917]",
      groupList: "space-y-2",

      itemCard: "rounded-2xl bg-white border border-black/[0.06] p-3 shadow-sm",
      itemMainRow: "flex items-start gap-3",

      itemImgWrap:
        "relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F0EEE9] border border-black/[0.06]",
      itemImg: "object-cover",

      itemInfo: "min-w-0 flex-1",
      itemName: "truncate text-sm font-semibold text-[#1A1917]",
      itemMetaRow: "mt-0.5 flex items-center gap-2",
      itemSpec: "text-xs text-[#A8A49C]",

      warningChip:
        "rounded-full bg-[#8A5300]/[0.08] border border-[#8A5300]/25 px-1.5 py-0.5 text-[10px] text-[#8A5300] font-medium",
      normalChip:
        "rounded-full bg-[#F0EEE9] border border-black/[0.06] px-1.5 py-0.5 text-[10px] text-[#6B6760]",

      trashBtn:
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C0373F]/[0.10] border border-[#C0373F]/30 text-[#C0373F] transition-colors hover:bg-[#C0373F]/[0.18] active:scale-95",
      trashIcon: "h-3.5 w-3.5",

      itemBottomRow: "mt-3 flex items-center justify-between gap-2",
      priceCalcText: " text-base font-bold text-[#A8A49C]",
      priceCalcBold: "font-bold text-[#1A1917] font-mono",

      qtyActionWrap: "flex items-center gap-2",
      qtyMinusBtn:
        "flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EEE9] border border-black/[0.10] text-[#2E2C28] transition-all hover:bg-[#E8E5DD] active:scale-90",
      qtyPlusBtn:
        "flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1917] border border-[#1A1917] text-white transition-all hover:opacity-90 active:scale-90",
      qtyMinusIcon: "h-3.5 w-3.5",
      qtyPlusIcon: "h-3.5 w-3.5",
      qtyValueDisplay:
        "min-w-[40px] rounded-lg bg-white border border-black/[0.06] px-2 py-1 text-center text-sm font-semibold text-[#1A1917] font-mono",

      summaryCard:
        "mt-4 rounded-2xl bg-white border border-black/[0.06] p-3 text-sm shadow-sm",
      summaryRow: "flex items-center justify-between text-[#6B6760]",
      summaryRowMuted: "mt-1 flex items-center justify-between text-[#6B6760]",
      summaryDivider: "mt-2 border-t border-black/[0.06] pt-2",
      totalRow:
        "flex items-center justify-between text-base font-semibold text-[#1A1917]",
      totalValue: "font-mono text-lg text-[#1A1917]",

      paymentGrid: "mt-4 grid grid-cols-3 gap-2",
      paymentBtnActive:
        "inline-flex items-center justify-center gap-1 rounded-xl bg-[#1A1917]/60 border  px-2 py-2 text-xs font-medium text-white shadow-sm transition-all active:scale-95",
      paymentBtnNormal:
        "inline-flex items-center justify-center gap-1 rounded-xl bg-white border border-black/[0.06] px-2 py-2 text-xs font-medium text-[#6B6760] transition-colors hover:bg-[#F5F4F1] active:scale-95",
      paymentIcon: "h-3.5 w-3.5",

      checkoutBtn:
        "mt-4 flex w-full justify-center items-center gap-2 rounded-xl bg-[#1A1917] text-white font-medium py-3 text-sm shadow-md transition-transform duration-150 ease-out hover:opacity-90 active:scale-[0.98]",
      checkoutIcon: "h-4 w-4",
    },
    viewSwitcher: {
      outerPosition: "w-auto flex",
      container:
        "ml-auto relative flex p-1 bg-gradient-to-t from-[#F9F8F6]/60 via-white/60 to-white/80 backdrop-blur-sm border border-[#1f1f1e26] rounded-md  shadow-sm",
      indicator:
        "absolute top-1 left-1 w-10 h-10 bg-[#1A1917] rounded-sm transition-all duration-300 ease-out",

      btnActive: "text-white",
      btnInactive: "text-[#A8A49C] hover:text-[#6B6760]",
      btnBase:
        "relative z-10 flex items-center justify-center w-10 h-10 transition-colors",
    },
    sidebar: {
      // 側邊欄本體（溫潤暖白底、微透細邊、軟陰影）
      wrapper:
        "hidden shadow-lg lg:flex flex-col h-screen rounded-r-[28px] bg-[#F9F8F6] border-r border-black/[0.04] shadow-[4px_0_24px_rgba(26,25,23,0.02)] relative overflow-hidden",
      glow: "absolute inset-0 bg-gradient-to-b from-[#F0EEE9]/30 to-transparent pointer-events-none",
      borderStyle: { borderRight: "1.5px solid #1f1f1e26" },

      // 區塊分割線與結構
      divider: "border-b border-black/[0.1]",
      sectionDivider: "my-4 border-t border-black/[0.1]",

      // 導覽按鈕狀態
      navBtnActive: "bg-[#F0EEE9] border border-[#0b0b0b] text-white shadow-sm",
      navBtnInactive:
        "hover:bg-[#F0EEE9] border border-transparent text-[#6B6760]",
      // 通知中心 Popover 內容
      popoverContent:
        "w-96 text-[#1A1917] rounded-xl shadow-2xl px-4 py-4 z-50 backdrop-blur-md border border-black/[0.06] bg-white/95 animate-fade-in",
      popoverItem:
        "py-3 px-2 cursor-pointer rounded-xl border border-black/[0.1] bg-[#FBFBFA] hover:bg-[#F5F4F1] transition-all duration-300",
      popoverArrow: "fill-white",

      // 載入中（Popover 內）
      loadingSpinner:
        "w-10 h-10 border-4 border-black/[0.06] border-t-[#1A1917] rounded-full animate-spin",

      // 底部快速切換使用者按鈕
      userBtn:
        "w-full h-8 rounded-lg bg-[#F0EEE9] hover:bg-[#E6E3DC] font-semibold text-xs transition-colors text-[#6B6760]",

      // 主題切換器專用樣式
      themeToggler: {
        container:
          " flex p-1 bg-[#F0EEE9]/80 rounded-xl border border-black/[0.1]  items-center",
        btnActive: "bg-white text-[#1A1917] shadow-sm font-semibold",
        btnInactive: "text-[#A8A49C] hover:text-[#6B6760] font-medium",
      },
    },
    mobileNav: {
      wrapper: "block lg:hidden fixed bottom-1.5 left-0 z-[80] w-full px-2.5",
      nav: "px-5 py-2 relative rounded-full bg-gradient-to-t from-[#F9F8F6]/60 via-white/60 to-white/80 backdrop-blur-sm border border-[#1f1f1e26] shadow-[0_8px_32px_rgba(26,25,23,0.08)]",
      btnActive:
        "bg-[#F0EEE9] border border-[#0b0b0b] text-[#6B6760] shadow-sm shadow-black/5",
      btnInactive:
        "hover:bg-[#F0EEE9] border border-transparent text-[#6B6760]",
      iconColorActive: "#ffffff",
      iconColorInactive: "#6B6760",
      textColorActive: "text-white",
      textColorInactive: "text-[#6B6760]",
      settingsBtn:
        "flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl hover:bg-[#F0EEE9] border border-transparent text-[#6B6760] transition-all",
      safeAreaBg: "bg-[#F9F8F6]",
    },
    loadingIndicato: {
      container: "w-full flex justify-center items-center py-4", // py-4 增加上下間距
      spinner:
        "w-10 h-10 border-4 border-black/[0.06] border-t-[#1A1917] rounded-full animate-spin",
    },
    metricsCard: {
      text: {
        title: "text-white",
        muted: "text-slate-400",
        value: "text-lg font-mono font-medium text-[#E8EEFF]",
      },
    },
    hr: {
      body: "border-t border-black/[0.2]",
    },
    header: {
      bg: "border-black/[0.08] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]",
      text: "text-[#1A1917]",
      announcement: {
        bg: "border border-black/[0.07] bg-[#F0EEE9]",
        text: "text-[#1A1917]",
        textMuted: "text-[#1A1917]",
      },
      tab: {
        item: "border-[#0b0b0b] text-[#2E2C28] hover:bg-[#0b0b0b]/20",
        iteamActive: "border-[#0b0b0b] bg-[#0b0b0b]/20 text-[#2E2C28]",
      },
    },
    login: {
      pageBg:
        "min-h-screen flex items-center justify-center p-4 bg-[#F5F4F1] font-sans transition-colors duration-500",
      floatingIcon: "absolute text-[#6B6760]/10 hidden lg:block",

      // 主卡片與裝飾
      mainCard:
        "relative w-full max-w-6xl lg:h-[740px] h-full flex flex-col flex-col-reverse md:flex-row rounded-[32px] border border-[#1f1f1e26] bg-white shadow-[0_40px_100px_rgba(26,25,23,0.06)] overflow-hidden z-10",
      decorations: "hidden", // 淺色版走極簡扁平風，隱藏暗色的發光網格
      glowBall: "hidden",

      // 左側：系統狀態與公告
      leftPanel:
        "md:w-[42%] bg-[#F9F8F6] p-10 pb-4 flex flex-col border-r border-[#1f1f1e26] z-10 relative",
      logoBg: "bg-white border border-[#1f1f1e26] p-1 rounded-lg shadow-sm",
      textTitle:
        "text-2xl font-black text-[#1A1917] tracking-tighter leading-none",
      textPrimary: "text-base font-medium text-[#1A1917] tracking-wide",
      textSecondary: "text-[12px] text-[#6B6760] mb-4 leading-relaxed",
      textMuted: "text-[10px] text-[#A8A49C] mt-1 font-mono uppercase",

      // 狀態監控與公告區
      statusSectionTitle:
        "text-[10px] font-black text-[#6B6760] mb-3 flex items-center gap-2 uppercase tracking-widest",
      statusBox:
        "mb-6 p-4 rounded-2xl bg-white border border-[#1f1f1e26] shadow-sm",
      announcementTitle:
        "text-xs font-bold text-[#6B6760] uppercase tracking-[0.15em] flex items-center gap-2 mb-4",
      announcementItem:
        "py-2 px-4 cursor-pointer rounded-xl border border-transparent bg-[#F0EEE9]/50 hover:bg-[#F0EEE9] text-[#1A1917] transition-all duration-300",
      announcementText: "text-[13px] font-bold text-[#2E2C28] flex-1",
      announcementTime: "ml-1 text-[11px] text-[#A8A49C] font-mono text-nowrap",

      // 底部基礎架構
      infraTitle: "text-[9px] text-[#A8A49C] uppercase tracking-widest mb-3",
      infraItem:
        "text-[11px] text-[#6B6760] flex items-center gap-2 whitespace-nowrap font-medium",
      infraIcons: {
        network: "text-blue-600",
        code: "text-emerald-600",
        database: "text-purple-600",
        harddrive: "text-orange-600",
        zap: "text-amber-600",
        smartphone: "text-violet-600",
      },

      // 右側：登入表單
      rightPanel:
        "flex-1 p-12 lg:p-20 flex flex-col justify-center relative bg-white",
      formTitle:
        "text-4xl font-black text-[#1A1917] mb-3 tracking-tighter family-mono",
      formSubtitle: "text-[#6B6760] font-bold text-sm tracking-widest mb-4",
      formDesc: "text-[#6B6760]/80 text-xs leading-relaxed",

      // 輸入框與控制項
      inputLabel:
        "text-[10px] font-black text-[#6B6760] uppercase tracking-widest ml-1",
      inputBox:
        "w-full h-14 bg-[#FBFBFA] border border-[#1f1f1e26] rounded-2xl pl-12 pr-12 text-[#1A1917] placeholder:text-[#A8A49C] outline-none focus:bg-white focus:border-[#1A1917] focus:ring-4 focus:ring-black/[0.02] transition-all",
      inputIcon:
        "absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6760] group-focus-within:text-[#1A1917] transition-colors",
      inputFocusBlur: "hidden", // 淺色版不需要發光霓虹

      // 記住我與提交按鈕
      toggleBgActive: "bg-[#1A1917] shadow-sm",
      toggleBgInactive: "bg-[#F0EEE9] border border-[#1f1f1e26]",
      toggleThumbActive: "translate-x-4 bg-white",
      toggleThumbInactive: "translate-x-0 bg-[#6B6760]",
      toggleText:
        "text-xs font-bold text-[#6B6760] group-hover:text-[#1A1917] transition-colors uppercase tracking-wider",

      submitBtn:
        "w-full h-14 bg-[#1A1917] hover:bg-[#2E2C28] disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-300 text-white font-black rounded-2xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-3 group",
      errorBox: "mb-6 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl",
      errorText: "text-rose-600 text-sm",

      developerTitle: "text-[13px] text-[#6B6760] mb-2",
      developerCreds: "text-[13px] text-[#A8A49C] font-mono",
      copyrightText:
        "text-[12px] text-[#6B6760] font-mono tracking-wide flex justify-center",

      // 狀態監控節點專屬樣式
      status: {
        ACTIVE: {
          textColor: "text-emerald-700",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/20",
          dotColor: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
          label: "ACTIVE",
          animate: "",
        },
        CONNECTING: {
          textColor: "text-amber-700",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/20",
          dotColor: "bg-amber-500 animate-pulse",
          label: "CONNECTING",
          animate: "animate-pulse",
        },
        FAILED: {
          textColor: "text-rose-700",
          bgColor: "bg-rose-500/10",
          borderColor: "border-rose-500/20",
          dotColor: "bg-rose-500",
          label: "FAILED",
          animate: "",
        },
        OFFLINE: {
          textColor: "text-[#6B6760]",
          bgColor: "bg-[#F0EEE9]",
          borderColor: "border-[#1f1f1e26]",
          dotColor: "bg-[#A8A49C]",
          label: "OFFLINE",
          animate: "",
        },
      },
    },
  },
} as const;
