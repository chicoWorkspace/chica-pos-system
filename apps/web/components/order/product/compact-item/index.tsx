import LoadingImage from "@/components/ui/loading-image";
import { useAppTheme } from "@/src/context/theme-provider";
import { RootState } from "@/src/store";
import { Eye, Plus } from "lucide-react";
import { memo } from "react";
import { useSelector } from "react-redux";
import { ItemProps } from "..";

const CompactItem = memo(function (props: ItemProps) {
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
  const { theme } = useAppTheme();
  const isUpdating = useSelector((state: RootState) => state.cart.isUpdating);
  const h = theme.classes.horizontalProductCard;
  const p = theme.classes.compactCard;

  return (
    <div className={p.card}>
      {/* Image */}
      <div className={p.imgWrap}>
        <div className="w-full h-full flex items-center justify-center">
          {currentPhoto ? (
            <LoadingImage
              src={currentPhoto.filename}
              alt={currentPhoto?.alt ?? "商品圖片"}
              fill
              className="w-full h-full P-2 rounded-none"
            />
          ) : (
            <svg
              className={p.imgPlaceholderIcon}
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
        <div className={`absolute top-0 right-2.5 `}>
          <span className={`${h.imageLowStockBadge} ${stockStatus.bg}`}>
            {stockStatus.status === "out" && "缺貨"}
            {stockStatus.status === "low" && "低庫存"}
            {stockStatus.status === "normal" && "充足"}
          </span>
        </div>
        <div className="absolute bottom-2.5 right-2.5 flex gap-1">
          <button onClick={openLightbox} className={p.actionButton}>
            <Eye className={p.actionIcon} />
          </button>
        </div>
      </div>

      {/* Name + price */}
      <div className="px-2.5 pt-2.5 pb-2">
        <p className={p.nameText}>{product.name}</p>
        <p className={p.priceText}>NT$ {currentSpec.salePrice}</p>
      </div>

      {/* Spec select */}
      <div className="px-2.5 pb-2">
        <div className="relative">
          <select
            className={p.selectInput}
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
                  className={p.selectOption}
                >
                  {spec.spec}
                </option>
              );
            })}
          </select>
          <svg
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none"
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
      </div>

      {/* Add button */}
      <div className="px-2.5 pb-2.5">
        <button
          className={p.addBtn}
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
          加入
        </button>
      </div>
    </div>
  );
});
export default CompactItem;
