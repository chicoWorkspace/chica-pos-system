"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
};

export default function LoadingImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 當 src 改變時，重置載入狀態
  useEffect(() => {
    // 檢查圖片是否已經在快取中完成載入
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-lg bg-gray-200",
        className,
      )}
      style={fill ? undefined : { width, height }}
    >
      {/* Shimmer 加載動畫 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer " />
      )}

      <Image
        ref={imgRef} // 綁定 Ref
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        // 使用 priority 屬性可以減少切換時的閃爍（可選）
        className={clsx(
          "object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
