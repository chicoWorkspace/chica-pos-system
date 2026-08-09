import LoadingImage from "@/components/ui/loading-image";
import { useAppTheme } from "@/src/context/theme-provider";
import { RootState } from "@/src/store";
import { BarChart3, Edit3, Eye, Flame, Minus, Plus, Star } from "lucide-react";
import { memo } from "react";
import { useSelector } from "react-redux";
import { ItemProps } from "..";

const HorizontalItem = memo(function (props: ItemProps) {
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
  const horizontalProductCardCls = theme.classes.horizontalProductCard;

  return (
    <>
      <div className={horizontalProductCardCls.shell}>
        <div className="flex">
          {/* Left: Image */}
          <div className={horizontalProductCardCls.imageArea}>
            <div className="w-full h-full flex items-center justify-center">
              {currentPhoto ? (
                <LoadingImage
                  src={currentPhoto.filename}
                  alt={currentPhoto?.alt ?? "商品圖片"}
                  fill
                  className="w-full h-full "
                />
              ) : (
                <svg
                  className={horizontalProductCardCls.imagePlaceholderIcon}
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

            {/* Badges */}
            <div className="absolute top-2.5 left-2 flex flex-col gap-1">
              {!product.isHot && (
                <span className={horizontalProductCardCls.imageHotBadge}>
                  <Flame size={12} className="mr-0.5" />
                  熱門
                </span>
              )}

              {currentSpec.originalPrice > currentSpec.salePrice && (
                <span className={horizontalProductCardCls.imageDiscountBadge}>
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

              <span
                className={`${horizontalProductCardCls.imageLowStockBadge} ${stockStatus.bg}`}
              >
                {stockStatus.status === "out" && "缺貨"}
                {stockStatus.status === "low" && "低庫存"}
                {stockStatus.status === "normal" && "充足"}
              </span>
            </div>

            {/* Rating */}
            <div className={horizontalProductCardCls.imageRatingWrap}>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className={horizontalProductCardCls.imageRatingText}>
                {product.ratings}
              </span>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Top: info + actions */}
            <div
              className={`flex items-start justify-between flex-col sm:flex-row gap-2 px-4 pt-4 pb-3 ${horizontalProductCardCls.middleSection}`}
            >
              <div className="min-w-0">
                <p className={horizontalProductCardCls.title}>
                  {product.name} - {currentSpec.spec}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={horizontalProductCardCls.category}>
                    {product.subtitle}
                  </span>
                  <span className={horizontalProductCardCls.divider}>·</span>
                  <span className={horizontalProductCardCls.subtitle}>
                    {product.description}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(product.hashTag ?? "")
                    .split("#")
                    .filter((item) => item !== "")
                    .map((tag, key) => (
                      <span
                        key={tag + key}
                        className={horizontalProductCardCls.tag}
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center items-center gap-1 shrink-0">
                <span className={horizontalProductCardCls.tag}>
                  {product.categoryName}
                </span>
                <button className={horizontalProductCardCls.actionButton}>
                  <Eye
                    onClick={openLightbox}
                    className={horizontalProductCardCls.actionIcon}
                  />
                </button>
              </div>
            </div>

            {/* Middle: spec + stock + price */}
            <div
              className={`flex flex-wrap items-center gap-3 px-4 py-3 ${horizontalProductCardCls.middleSection}`}
            >
              {/* Spec select */}
              <div className="flex-1 relative min-w-[120px] max-w-[240px]">
                <select
                  className={`${horizontalProductCardCls.select}`}
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
                        className={horizontalProductCardCls.selectOption}
                      >
                        {spec.spec}
                      </option>
                    );
                  })}
                </select>
                <svg
                  className={horizontalProductCardCls.selectCaretIcon}
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

              {/* Stock */}
              <div className={horizontalProductCardCls.stockChip}>
                <div className={horizontalProductCardCls.stockDot} />
                <span className={horizontalProductCardCls.stockText}>庫存</span>
                <span className={horizontalProductCardCls.stockValue}>
                  {currentSpec.stock}
                </span>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <div className="flex items-baseline gap-1.5">
                  <span className={horizontalProductCardCls.priceMain}>
                    NT$ {currentSpec.salePrice}
                  </span>
                  <span className={horizontalProductCardCls.priceOrigin}>
                    {currentSpec.originalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: qty + subtotal */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <button
                  className={horizontalProductCardCls.qtyBtn}
                  onClick={() => {
                    decreaseCartAsync(currentSpec._id.toString());
                  }}
                  disabled={
                    isUpdating ||
                    (currentCartStaeSpec
                      ? currentCartStaeSpec.quantity <= 0
                      : true)
                  }
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className={horizontalProductCardCls.qtyText}>
                  {currentCartStaeSpec?.quantity || 0}
                </span>
                <button
                  className={horizontalProductCardCls.qtyBtn}
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
                <p className={horizontalProductCardCls.subtotalLabel}>小計</p>
                <p className={horizontalProductCardCls.subtotalValue}>
                  NT${" "}
                  {currentSpec.salePrice * (currentCartStaeSpec?.quantity ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
export default HorizontalItem;
