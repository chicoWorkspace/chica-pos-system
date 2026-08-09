import LoadingImage from "@/components/ui/loading-image";
import { useAppTheme } from "@/src/context/theme-provider";
import { RootState } from "@/src/store";
import { BarChart3, Edit3, Eye, Flame, Minus, Plus, Star } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ItemProps } from "..";
import { memo } from "react";

const VerticalItem = memo(function (props: ItemProps) {
  const {
    currentPhoto,
    currentSpec,
    currentCartStaeSpec,
    currentSpecUuid,
    product,
    stockStatus,
    specInventories,
    addCartAsync,
    decreaseCartAsync,
    openLightbox,
    setCurrentSpecUuid,
  } = props;

  const isUpdating = useSelector((state: RootState) => state.cart.isUpdating);
  const { theme } = useAppTheme();

  const cls = theme.classes;
  const defaultProductCardCls = theme.classes.defaultProductCard;

  const specMap = useMemo(() => {
    return new Map(specInventories.map((s) => [s._id, s]));
  }, [specInventories]);

  return (
    <>
      <div className={defaultProductCardCls.shell}>
        {/* Image */}
        <div className={defaultProductCardCls.imageArea}>
          <div className={defaultProductCardCls.imagePlaceholder}>
            {currentPhoto ? (
              <LoadingImage
                src={currentPhoto.filename}
                alt={currentPhoto?.alt ?? "商品圖片"}
                fill
                className="w-full h-full P-2 rounded-none"
              />
            ) : (
              <svg
                className={defaultProductCardCls.imagePlaceholderIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            )}
          </div>
          <div className={defaultProductCardCls.imageTopLeftBadges}>
            {!product.isHot && (
              <span className={defaultProductCardCls.imageHotBadge}>
                <Flame size={12} className="mr-0.5" />
                熱門
              </span>
            )}
            {currentSpec.originalPrice > currentSpec.salePrice && (
              <span className={defaultProductCardCls.imageDiscountBadge}>
                -
                {(
                  parseFloat(
                    (
                      1 -
                      currentSpec.salePrice / currentSpec.originalPrice
                    ).toFixed(2),
                  ) * 100
                ).toFixed(0)}
                %
              </span>
            )}
          </div>
          <div className={defaultProductCardCls.imageTopRightBadgeWrap}>
            <span
              className={`${defaultProductCardCls.imageLowStockBadge} ${stockStatus.bg}`}
            >
              {stockStatus.status === "out" && "缺貨"}
              {stockStatus.status === "low" && "低庫存"}
              {stockStatus.status === "normal" && "充足"}
            </span>
          </div>
          <div className={defaultProductCardCls.imageRatingWrap}>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className={defaultProductCardCls.imageRatingText}>
              {product.ratings}
            </span>
          </div>
          <div className={defaultProductCardCls.imageActionsWrap}>
            <button
              onClick={openLightbox}
              className={defaultProductCardCls.imageActionButton}
            >
              <Eye className={defaultProductCardCls.imageActionIcon} />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className={defaultProductCardCls.body}>
          <div className={defaultProductCardCls.titleRow}>
            <p className={defaultProductCardCls.title}>
              {product.name} - {currentSpec.spec}
            </p>
            <span className={defaultProductCardCls.category}>
              {product.categoryName}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={defaultProductCardCls.subtitle}>
              {product.subtitle}
            </span>
            <span className="text-[#334E8A]">·</span>
            <p className={`${defaultProductCardCls.subtitle} !text-xs ml-auto`}>
              {product.description}
            </p>
          </div>
          <div className={defaultProductCardCls.tagsWrap}>
            {(product.hashTag ?? "")
              .split("#")
              .filter((item) => item !== "")
              .map((tag, key) => (
                <span key={tag + key} className={defaultProductCardCls.tag}>
                  #{tag}
                </span>
              ))}
          </div>
          <p className={defaultProductCardCls.specLabel}>規格</p>
          <div className="relative mb-3">
            <select
              className={defaultProductCardCls.select}
              onChange={(e) => {
                setCurrentSpecUuid(e.target.value);
              }}
              value={currentSpecUuid}
            >
              {specInventories.map((spec, key) => {
                return (
                  <option
                    key={`spec2-${key}-${spec._id.toString()}`}
                    value={spec._id.toString()}
                    className={defaultProductCardCls.selectOption}
                  >
                    {spec.spec}
                  </option>
                );
              })}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none"
              viewBox="0 0 10 6"
              fill="none"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="#6A86B8"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="mb-3">
            <div className={defaultProductCardCls.stockChip}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#80ECA0]" />
              <span className={defaultProductCardCls.stockText}>庫存</span>
              <span className={defaultProductCardCls.stockValue}>
                {currentSpec.stock} 件
              </span>
            </div>
          </div>

          <div className={defaultProductCardCls.priceSection}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={defaultProductCardCls.priceMain}>
                NT$ {currentSpec.salePrice}
              </span>
              {currentSpec.originalPrice > currentSpec.salePrice && (
                <span className={defaultProductCardCls.priceOrigin}>
                  NT$ {currentSpec.originalPrice}
                </span>
              )}
            </div>
            <div className="flex gap-4">
              <span className={defaultProductCardCls.metaText}>
                規格{" "}
                <span className={defaultProductCardCls.metaValue}>
                  {specMap.get(currentSpec._id)?.spec}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={defaultProductCardCls.footer}>
          <div className="flex items-center gap-2.5">
            <button
              className={`${defaultProductCardCls.qtyBtn}
                transition-transform duration-150 ease-out active:scale-90
                disabled:opacity-50 disabled:cursor-not-allowed 
                touch-manipulation
                `}
              onClick={() => {
                decreaseCartAsync(currentSpec._id.toString());
              }}
              disabled={
                isUpdating ||
                (currentCartStaeSpec ? currentCartStaeSpec.quantity <= 0 : true)
              }
            >
              <Minus className="w-3.5 h-3.5 " />
            </button>
            <span className={defaultProductCardCls.qtyText}>
              {currentCartStaeSpec?.quantity || 0}
            </span>
            <button
              className={`${defaultProductCardCls.qtyBtn}
                transition-transform duration-150 ease-out active:scale-90
                disabled:opacity-50 disabled:cursor-not-allowed 
                touch-manipulation
                `}
              onClick={() => {
                addCartAsync(currentSpec, 1);
              }}
              disabled={
                isUpdating ||
                (currentCartStaeSpec
                  ? currentCartStaeSpec.quantity >= currentSpec.stock ||
                    currentSpec.stock <= 0
                  : false)
              }
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-right">
            <p className={defaultProductCardCls.subtotalLabel}>小計</p>
            <p className={defaultProductCardCls.subtotalValue}>
              NT$ {currentSpec.salePrice * (currentCartStaeSpec?.quantity ?? 0)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
});
export default VerticalItem;
