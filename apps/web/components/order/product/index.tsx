"use client";
import { systemToastSonner } from "@/components/ui/system-toast-sonner";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { RootState } from "@/src/store";
import { CartItem } from "@/src/store/cart/cartSlice";
import {
  addApiCartAsync,
  addCartAsync,
  decreaseApiCartAsync,
  decreaseCartAsync,
} from "@/src/store/cart/cartThunk";

import {
  PhotosProps,
  ProductProps,
  ProudctInListResult,
  SpecInventoriesProps,
} from "@repo/api-client";
import { useMapState } from "@repo/ui/src/hooks/use-map-state";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { productView } from "..";
import HorizontalItem from "./horizontal-item";
import VerticalItem from "./vertical-item";
import CompactItem from "./compact-item";
import { Button } from "@/components/ui/button";

interface ProductCompProps {
  productView: productView;
  product: ProudctInListResult;
}

export interface ItemProps {
  currentPhoto: PhotosProps | undefined;
  currentSpec: SpecInventoriesProps;
  currentCartStaeSpec: CartItem | undefined;
  currentSpecUuid: string | undefined;
  product: ProductProps;
  stockStatus: GetStockStatusResultProps;
  specInventories: SpecInventoriesProps[];
  addCartAsync: (product: SpecInventoriesProps, quantity: number) => void;
  decreaseCartAsync: (uuid: string) => void;
  openLightbox: () => void;
  setCurrentSpecUuid: (value: string) => void;
}

const Product = (props: ProductCompProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [animateIn, setAnimateIn] = useState<boolean>(true);

  const cartState = useSelector((state: RootState) => state.cart);
  const appDispatch = useAppDispatch();

  const productView = props.productView;
  const product = props.product.product;
  const specInventories = props.product.specInventories;
  const photos = props.product.photos;

  const [currentSpecUuid, setCurrentSpecUuid] = useState<string>();
  const [currentSpec, setCurrentSpec] = useState<SpecInventoriesProps>(
    specInventories[0],
  );

  const speces = useMapState<SpecInventoriesProps>();
  useEffect(() => {
    specInventories.forEach((spec, key) => {
      speces.set(spec._id.toString(), spec);
    });
  }, [specInventories]);

  useEffect(() => {
    setCurrentSpecUuid(specInventories[0]._id.toString());
  }, [specInventories]);

  useEffect(() => {
    const spec = speces.get(currentSpecUuid) || specInventories[0];
    setCurrentSpec(spec);
  }, [currentSpecUuid]);

  const currentCartStaeSpec =
    cartState.products.find((item) => {
      return item._id === currentSpec._id;
    }) ?? undefined;

  const currentPhoto = photos.find(
    (photo) => photo.specUuid === currentSpec._id,
  );

  const stockStatus = getStockStatus({
    stock: currentSpec.stock,
    minStock: 10,
  });

  const openLightbox = () => {
    setLightboxOpen(true);
    setZoomLevel(1);
    setTimeout(() => {
      setAnimateIn(true);
    }, 200);
  };
  const closeLightbox = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setLightboxOpen(false);
    }, 200);
    setZoomLevel(1);
  };
  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };
  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  // 在燈箱中雙擊切換放大/縮小
  const handleLightboxImageDoubleClick = () => {
    if (zoomLevel === 1) {
      setZoomLevel(2.5);
    } else {
      setZoomLevel(1);
    }
  };

  const addCartAsyncCallback = useCallback(
    (product: SpecInventoriesProps, quantity: number) => {
      appDispatch(addApiCartAsync({ product, quantity }))
        .unwrap()
        .then(() => {})
        .catch((err) => {
          systemToastSonner({
            title: "加入購物車失敗",
            description: "加入失敗:" + err,
            type: "error",
          });
        });
    },
    [appDispatch],
  );

  const decreaseCartAsyncCallback = useCallback(
    (uuid: string) => {
      appDispatch(decreaseApiCartAsync(uuid))
        .unwrap()
        .then(() => {})
        .catch((err) => {
          systemToastSonner({
            title: "減少商品數量失敗",
            description: "減少失敗:" + err,
            type: "error",
          });
        });
    },
    [appDispatch],
  );

  const itemData: ItemProps = useMemo(
    () => ({
      currentPhoto,
      currentSpec,
      currentCartStaeSpec,
      currentSpecUuid,
      product,
      stockStatus,
      specInventories,
      addCartAsync: addCartAsyncCallback,
      decreaseCartAsync: decreaseCartAsyncCallback,
      openLightbox,
      setCurrentSpecUuid,
    }),
    [
      currentPhoto,
      currentSpec,
      currentCartStaeSpec,
      currentSpecUuid,
      product,
      stockStatus,
      specInventories,
      addCartAsyncCallback,
      decreaseCartAsyncCallback,
      openLightbox,
      setCurrentSpecUuid,
    ],
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {productView == "vertical" && (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <VerticalItem {...itemData} />
          </motion.div>
        )}
        {productView == "horizontal" && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <HorizontalItem {...itemData} />
          </motion.div>
        )}

        {productView == "compact" && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <CompactItem {...itemData} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Lightbox 燈箱 */}
      {lightboxOpen && (
        <div
          className={`fixed inset-0 bg-black  z-50 flex items-center justify-center overflow-auto
          transition-all duration-300
           ${animateIn ? "opacity-100" : "opacity-0"}
          `}
        >
          {/* 背景遮罩 */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300
            ${animateIn ? "opacity-100" : "opacity-0"}
            `}
            onClick={closeLightbox}
          />
          {/* 關閉按鈕 */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>
          {/* 縮放控制 */}
          <div className="absolute top-4 left-4 flex space-x-2 z-10">
            <button
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              onClick={zoomOut}
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut size={20} />
            </button>
            <button
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              onClick={zoomIn}
              disabled={zoomLevel >= 3}
            >
              <ZoomIn size={20} />
            </button>
            <div className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-full text-sm">
              {Math.round(zoomLevel * 100)}%
            </div>
          </div>
          {/* 主要圖片 */}
          <div className="max-w-4xl max-h-full overflow-auto p-8">
            {currentPhoto && (
              <Image
                src={currentPhoto.filename}
                alt={currentPhoto.alt ?? "商品圖片"}
                className={`max-w-full max-h-full object-contain transition-transform duration-300 ${zoomLevel > 1 ? "cursor-zoom-out" : "cursor-zoom-in"} `}
                style={{ transform: `scale(${zoomLevel})` }}
                onClick={handleLightboxImageDoubleClick}
                fill
                draggable={false}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Product);

export interface GetStockStatusProps {
  stock: number;
  minStock: number;
}
export interface GetStockStatusResultProps {
  status: string;
  bg: string;
}

export const getStockStatus = (
  props: GetStockStatusProps,
): GetStockStatusResultProps => {
  if (props.stock <= 0)
    return {
      status: "out",
      bg: "bg-[#6B1F1F] text-[#FFB0B0] border border-[#9B3030]",
    };
  if (props.stock <= props.minStock)
    return {
      status: "low",
      bg: "bg-[#5A3C08] text-[#FFD080] border border-[#8A6010]",
    };
  return {
    status: "normal",
    bg: "bg-[#1A4428] text-[#80ECA0] border border-[#2A7040]",
  };
};

export interface GetProfitProps {
  price: number;
  cost: number;
}
export const getProfit = (props: GetProfitProps) => {
  return (((props.price - props.cost) / props.price) * 100).toFixed(1);
};
