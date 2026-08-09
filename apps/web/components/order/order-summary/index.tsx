"use client";
import LoadingImage from "@/components/ui/loading-image";
import { systemToastSonner } from "@/components/ui/system-toast-sonner";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useDialog } from "@/hooks/use-dialog";
import { useWebSocket } from "@/hooks/use-web-socket";
import { useAppTheme } from "@/src/context/theme-provider";
import { RootState } from "@/src/store";
import { CartItem } from "@/src/store/cart/cartSlice";
import {
  addApiCartAsync,
  clearApiCartAsync,
  decreaseApiCartAsync,
  deleteApiCartAsync,
  getCartAsync,
} from "@/src/store/cart/cartThunk";
import { closeSideMenu, toggleSideMenu } from "@/src/store/sideMenuSlice";
import { cartActionWrapper } from "@/src/wrappers/cart-action-wrapper";
import {
  CategoryResult,
  OrderCreaterResult,
  OrderEvent,
} from "@repo/api-client";
import { Clock as ClockTemplate } from "@repo/ui/src/clock";
import { AnimatePresence, motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  Check,
  CircleDollarSign,
  Clock,
  CreditCard,
  DollarSign,
  LucideIcon,
  Minus,
  Package,
  Plus,
  ReceiptText,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CashModal, CashOrderPayload } from "./cash-modal";
import QrcodeModal from "./qrcode-modal";
import ReceiptPreview from "./receipt";
import { isMobile } from "react-device-detect";
interface OrderSummaryProps {
  categories: CategoryResult;
}

export default function OrderSummary(props: OrderSummaryProps) {
  const isOpen = useSelector((state: RootState) => state.sideMenu.isOpen);
  const cartState = useSelector((state: RootState) => state.cart);
  const cartLoaded = useSelector((state: RootState) => state.cart.cartLoaded);

  const products = cartState.products;
  const appDispatch = useAppDispatch();
  const [currentOrder, setCurrentOrder] = useState<CartItem[]>(products);
  const isUpdating = useSelector((state: RootState) => state.cart.isUpdating);
  const cashOrderRef = useRef<CashOrderPayload>({
    expectedAmount: "0",
    amount: "0",
    changeAmount: "0",
  });
  const { theme } = useAppTheme();
  const tipRate = process.env.NEXT_PUBLIC_TIP_RATE
    ? parseFloat(process.env.NEXT_PUBLIC_TIP_RATE)
    : 0;
  const categoriesIconMap = new Map(
    props.categories.map((cat) => [cat._id, cat.icon]),
  );

  const orderCreater = useRef<OrderCreaterResult | null>(null);

  const loadingDialogRef = useRef<string | null>(null);

  const { openDialog, closeDialog } = useDialog();

  const ctx = useWebSocket();
  if (!ctx) return null;
  const { socket, status } = ctx;

  useEffect(() => {
    setCurrentOrder(products);
  }, [products]);

  useEffect(() => {
    if (!cartLoaded) {
      appDispatch(getCartAsync())
        .unwrap()
        .then((item) => {})
        .catch((err: any) => {});
    }
  }, [cartLoaded, appDispatch]);

  const [selectedPayment, setSelectedPayment] = useState("");
  const [orderStatus, setOrderStatus] = useState("編輯中");
  const [isOpenPayment, setIsOpenPayment] = useState(false);

  const subtotal = currentOrder.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0,
  );
  const tip = Math.round(subtotal * tipRate);
  const total = subtotal + tip;

  useEffect(() => {
    if (!socket) return;

    const handleOrderState = (event: OrderEvent) => {
      switch (event.type) {
        case "success":
        case "linepay_url":
          console.log("訂單成功或取得 linepay_url，清空購物車");
          appDispatch(clearApiCartAsync())
            .unwrap()
            .then((item) => {})
            .catch((err: any) => {
              console.error("清空購物車失敗:", err);
            });
          break;
      }

      switch (event.type) {
        case "success":
          orderCreater.current = event.payload;
          closeLoadingModal();
          openCashSuccessModal();
          break;

        case "linepay_url":
          if (isMobile) {
            window.location.href = event.payload.app;
            return;
          }

          closeLoadingModal();
          openDialog({
            title: "電子錢包",
            size: "max-w-xl",
            content: (
              <QrcodeModal
                onClose={() => setIsOpenPayment(false)}
                snedOrder={(after) => {}}
                expectedAmount={total}
                text={event.payload.app}
              />
            ),
          });
          break;

        case "failed":
          closeLoadingModal();
          openDialog({
            title: "訂單處理失敗",
            subTitle: "很抱歉，您的訂單處理失敗了",
            type: "warning",
            description: "請稍後再試一次，或聯繫客服尋求協助",
            content: event.payload.message,
          });
          break;
      }
    };

    socket.on("order:state", handleOrderState);

    return () => {
      socket.off("order:state", handleOrderState);
    };
  }, [socket, total]);

  const LinePayIcon = () => (
    <div className="w-16">
      <Image
        src="/LINE_Pay_logo.svg"
        alt="Responsive SVG"
        width={0}
        height={0}
        sizes="100vw"
        className=" bg-white p-1 rounded-sm"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );

  const paymentMethods: {
    id: string;
    name?: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    { id: "cash", name: "現金", icon: DollarSign, color: "slate" },
    {
      id: "linepay",
      icon: LinePayIcon,
      color: "slate",
    },
  ];

  const submitOrder = () => {
    setOrderStatus("已確認");
    setIsOpenPayment(true);

    switch (selectedPayment) {
      case "cash":
        const id = openDialog({
          title: "現金付款",
          size: "max-w-xl",
          content: (
            <CashModal
              onClose={() => setIsOpenPayment(false)}
              sendOrder={(payload, after) => {
                cashOrderRef.current = payload;
                closeDialog(id);
                openLoadinModal();

                cartActionWrapper
                  .order({ paymentMethod: "cash" })
                  .then(() => {})
                  .catch((err) => {
                    closeLoadingModal();
                    systemToastSonner({
                      title: "發生錯誤",
                      description: err.message,
                      type: "error",
                    });
                  });
              }}
              expectedAmount={total}
            />
          ),
        });
        break;
      case "card":
        break;
      case "linepay":
        openLoadinModal();
        cartActionWrapper
          .order({ paymentMethod: "linepay" })
          .then((res) => {})
          .catch((err) => {
            closeLoadingModal();
            systemToastSonner({
              title: "發生錯誤",
              description: err.message,
              type: "error",
            });
          });

        break;
    }
  };

  function deleteCart(uuid: string): any {
    throw new Error("Function not implemented.");
  }

  const groupedByCategory = currentOrder.reduce(
    (acc, item) => {
      const category = item.categoryName || "未分類";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, CartItem[]>,
  );

  useEffect(() => {
    // 螢幕進入 lg 以上就關閉側欄
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && isOpen) {
        appDispatch(closeSideMenu());
      }
    };

    // 首次檢查
    if (mediaQuery.matches && isOpen) {
      appDispatch(closeSideMenu());
    }
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    // 螢幕進入 lg 以上就關閉側欄
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && isOpen) {
        appDispatch(closeSideMenu());
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, [isOpen]);

  const categoryConfig = [
    {
      color: "text-green-400",
      bg: "from-green-500/40 to-emerald-500/40",
    },
    {
      color: "text-blue-400",
      bg: "from-blue-500/40 to-cyan-500/40",
    },
    {
      color: "text-yellow-400",
      bg: "from-yellow-500/40 to-amber-500/40",
    },

    {
      color: "text-orange-400",
      bg: "from-orange-500/40 to-red-500/40",
    },
  ];

  const formatAmount = (value: string) => {
    return parseInt(value).toLocaleString();
  };
  const openLoadinModal = () => {
    loadingDialogRef.current = openDialog({
      title: "處理中...",
      size: "max-w-sm",
      content: (
        <div className="w-100">
          <div className="rounded-2xl p-8 w-full font-mono">
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">
                列隊建立訂單中...
              </h2>
              <p className="text-gray-400">請稍候，正在處理您的付款</p>
            </div>
          </div>
        </div>
      ),
    });
  };

  const closeLoadingModal = () => {
    if (!loadingDialogRef.current) return;
    closeDialog(loadingDialogRef.current);
    loadingDialogRef.current = null;
  };

  const openCashSuccessModal = () => {
    const { expectedAmount, amount, changeAmount } = cashOrderRef.current;
    const order = orderCreater.current;

    const id = openDialog({
      title: "付款成功",
      size: "max-w-md",
      content: (
        <div className="rounded-2xl p-8 w-full font-mono">
          <div>
            <div className="flex items-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mr-4">
                <Check size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-300 font-medium">訂單已完成！</p>
                <div className=" text-white">
                  應收金額:{" "}
                  <span className="text-emerald-200/80">
                    {" "}
                    NT$ {formatAmount(expectedAmount.toString())}
                  </span>
                  <br />
                  實收金額:{" "}
                  <span className="text-emerald-200/80">
                    {" "}
                    NT$ {formatAmount(amount)}
                  </span>
                  <br />
                  找零:
                  <span className="text-red-500">
                    NT$ {formatAmount(changeAmount.toString())}
                  </span>
                </div>
              </div>
            </div>
            {order && <ReceiptPreview receipt={order} />}
          </div>
        </div>
      ),
    });
  };
  const cls = theme.classes;
  const c = cls.cart;
  const l = cls.loadingIndicato;
  const horizontalProductCardCls = cls.horizontalProductCard;

  return (
    <div className="w-full shadow-xl h-dvh overflow-hidden overscroll-contain">
      {/* 選單開關 */}

      <button
        onClick={() => appDispatch(toggleSideMenu())}
        className="block lg:hidden  fixed top-4 right-4 z-50 p-3 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200"
      >
        {isOpen ? <X size={24} /> : <ShoppingCart size={24} />}
      </button>
      {/* 遮罩層 */}
      <div
        className={`fixed inset-0 shadow-lg 
          lg:hidden
          bg-black/60  transition-opacity duration-200 z-30 
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => appDispatch(toggleSideMenu())}
      />
      {/* 選單主區域 */}
      <div
        className={`
          ${c.panel} 
         fixed top-0 right-0 w-full h-dvh overscroll-contain
         transform transition-transform duration-200 ease-in-out z-40
        ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full"}
        sm:w-2/3
        lg:translate-x-0
        lg:static
        lg:block lg:w-80 xl:w-96  
        overflow-hidden
        `}
      >
        <div className="flex min-h-0 flex-col h-dvh p-4">
          <div className={c.statusRow}>
            <div className={c.statusTitleWrap}>
              <ReceiptText className={c.statusIcon} />
              購物車
            </div>
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold ${cls.text.sub} `}
            >
              <Clock size={12} className="mr-1" />
              <ClockTemplate />
            </div>
          </div>
          <div className={`h-[1px] w-full ${cls.hr.body} my-3`} />
          {!cartLoaded && (
            <div className={l.container}>
              <div className={l.spinner} />
            </div>
          )}
          <div
            className="min-h-0 flex-1 will-change-scroll overflow-y-auto overscroll-contain scrollbar-clean space-y-4
        "
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 90%, rgba(0,0,0,0.5) 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 90%, rgba(0,0,0,0.5) 90%, transparent 100%)",
            }}
          >
            {Object.entries(groupedByCategory).map(
              ([category, items], index) => {
                const catLenght = categoryConfig.length;
                const bg = categoryConfig[index % catLenght].bg;
                const color = categoryConfig[index % catLenght].color;
                const cateUuid = items[0].categoryUuid;
                const iconName = cateUuid && categoriesIconMap.get(cateUuid);
                const IconComponent =
                  (iconName
                    ? (Icons[iconName as keyof typeof Icons] as LucideIcon)
                    : Package) || Package;

                return (
                  <div key={category}>
                    <div
                      className={`mb-2 flex items-center gap-2 text-sm font-medium pl-2  py-0.5
                        border-l-4  group border-green-500/50
                        ${cls.text.title}
                        `}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      {category}
                    </div>
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {items.map((item, key) => (
                          <motion.div
                            key={`item-${item.categoryUuid}-${key}`}
                            className={`${c.itemCard} !shadow-md`}
                            layout
                            initial={{
                              opacity: 0,
                              y: 20,
                              scale: 0.95,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              x: -100,
                              scale: 0.95,
                              transition: {
                                duration: 0.2,
                                ease: "easeInOut",
                              },
                            }}
                            transition={{
                              layout: {
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              },
                              duration: 0.3,
                              ease: "easeOut",
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <motion.div className={c.itemImgWrap}>
                                <LoadingImage
                                  src={item.photo?.filename ?? ""}
                                  alt={item.name}
                                  fill
                                  className="w-12 h-12 object-cover rounded-lg shadow-md"
                                />
                              </motion.div>
                              <div className="min-w-0 flex-1">
                                <div className={c.itemName}>
                                  <p>{item.name}</p>
                                  <p className={c.itemSpec}>{item.spec}</p>
                                </div>
                              </div>
                              <button
                                className={c.trashBtn}
                                onClick={() => {
                                  appDispatch(
                                    deleteApiCartAsync(item._id.toString()),
                                  )
                                    .unwrap()
                                    .then(() => {})
                                    .catch((err) => {
                                      systemToastSonner({
                                        title: "刪除商品失敗",
                                        description: "刪除失敗:" + err,
                                        type: "error",
                                      });
                                    });
                                }}
                                disabled={isUpdating}
                              >
                                <Trash2 className={c.trashIcon} />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <div className="flex items-center">
                                <motion.div
                                  key={`total-${item.salePrice * item.quantity}`}
                                  initial={{
                                    scale: 1.1,
                                  }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.1 }}
                                  className={`${c.priceCalcText}`}
                                >
                                  NT$ {item.salePrice * item.quantity}
                                </motion.div>
                                <div
                                  className={`text-[11px] ml-3 ${cls.text.sub}`}
                                >
                                  ( NT$ {item.salePrice} x
                                  <motion.span
                                    key={`quantity-${item.quantity}`}
                                    initial={{
                                      scale: 1.2,
                                    }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className={`${cls.text.sub} text-[14px] font-bold pl-1 `}
                                  >
                                    {item.quantity}
                                  </motion.span>{" "}
                                  )
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  className={`${horizontalProductCardCls.qtyBtn}`}
                                  onClick={() => {
                                    appDispatch(
                                      decreaseApiCartAsync(item._id.toString()),
                                    )
                                      .unwrap()
                                      .then(() => {})
                                      .catch((err) => {
                                        systemToastSonner({
                                          title: "減少商品數量失敗",
                                          description: "減少失敗:" + err,
                                          type: "error",
                                        });
                                      });
                                  }}
                                  disabled={isUpdating}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <div
                                  className={horizontalProductCardCls.qtyText}
                                >
                                  {item.quantity}
                                </div>
                                <button
                                  className={`${horizontalProductCardCls.qtyBtn}`}
                                  onClick={() => {
                                    appDispatch(
                                      addApiCartAsync({
                                        product: item,
                                        quantity: 1,
                                      }),
                                    )
                                      .unwrap()
                                      .then(() => {})
                                      .catch((err) => {
                                        systemToastSonner({
                                          title: "加入購物車失敗",
                                          description: "加入失敗:" + err,
                                          type: "error",
                                        });
                                      });
                                  }}
                                  disabled={isUpdating}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              },
            )}
            <div className="h-8 w-full" />
          </div>
          <div className={`w-full ${cls.hr.body} my-2`} />
          <div>
            <div className={c.summaryCard}>
              <div className={c.summaryRow}>
                <span>小計</span>
                <span>NT$ {subtotal}</span>
              </div>
              <div className={c.summaryRowMuted}>
                <span>服務費</span>
                <span>NT$ {tip}</span>
              </div>
              <div className={c.summaryDivider}>
                <div className={c.totalRow}>
                  <span>應付總額</span>
                  <span>NT$ {total}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {paymentMethods.map((method, index) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`
                    ${isSelected ? c.paymentBtnActive : c.paymentBtnNormal}
                    flex items-center justify-center cursor-pointer gap-1 rounded-xl border px-2 py-2 !text-lg font-medium transition-colors`}
                  >
                    <method.icon className="h-3.5 w-3.5" />
                    {method.name ?? ""}
                  </div>
                );
              })}
            </div>

            <button
              className={cls.button.primaryWide + " mt-4 w-full justify-center"}
              disabled={
                status != "connected" ||
                !selectedPayment ||
                currentOrder.length === 0
              }
              onClick={() => submitOrder()}
            >
              {(status == "connecting" || status == "reconnecting") && (
                <span>連線中...</span>
              )}
              {status == "disconnected" && <span>未連線</span>}
              {status == "failed" && <span>連線失敗</span>}
              {status == "connected" && (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span className="pl-1">
                    立即結帳 <span className="pl-1">(NT$ {total})</span>
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
