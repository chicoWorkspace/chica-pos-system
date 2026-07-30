import { ProductAddParams, ProductUpdateParams } from "@repo/db/product/index.type";
import { SpecInventoryAddParams, SpecInventoryUpdateParams } from "@repo/db/spec-inventory/index.type";
import { PhotoAddParams, PhotoUpdateParams } from "@repo/db/photo/index.type";
export declare const SpecInventorySchema: import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    spec: import("@sinclair/typebox").TString;
    originalPrice: import("@sinclair/typebox").TNumber;
    salePrice: import("@sinclair/typebox").TNumber;
    vipPrice: import("@sinclair/typebox").TNumber;
    stock: import("@sinclair/typebox").TNumber;
    cost: import("@sinclair/typebox").TNumber;
    name: import("@sinclair/typebox").TString;
}>;
export declare const PhotoSchema: import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    productUuid: import("@sinclair/typebox").TString;
    specUuid: import("@sinclair/typebox").TString;
    filename: import("@sinclair/typebox").TString;
    rank: import("@sinclair/typebox").TNumber;
    alt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare const CreatePhotoSchema: import("@sinclair/typebox").TObject<{
    filename: import("@sinclair/typebox").TString;
    alt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare const ProductSchema: import("@sinclair/typebox").TObject<{
    _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    categoryUuid: import("@sinclair/typebox").TString;
    categoryName: import("@sinclair/typebox").TString;
    isShow: import("@sinclair/typebox").TBoolean;
    name: import("@sinclair/typebox").TString;
    subtitle: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    hashTag: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    is_new: import("@sinclair/typebox").TBoolean;
    isHot: import("@sinclair/typebox").TBoolean;
    isSpecialOffer: import("@sinclair/typebox").TBoolean;
    ratings: import("@sinclair/typebox").TNumber;
    soldQty: import("@sinclair/typebox").TNumber;
    startDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    endDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare const CreateProductSchema: import("@sinclair/typebox").TObject<{
    product: import("@sinclair/typebox").TObject<{
        _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        categoryUuid: import("@sinclair/typebox").TString;
        categoryName: import("@sinclair/typebox").TString;
        isShow: import("@sinclair/typebox").TBoolean;
        name: import("@sinclair/typebox").TString;
        subtitle: import("@sinclair/typebox").TString;
        description: import("@sinclair/typebox").TString;
        hashTag: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        is_new: import("@sinclair/typebox").TBoolean;
        isHot: import("@sinclair/typebox").TBoolean;
        isSpecialOffer: import("@sinclair/typebox").TBoolean;
        ratings: import("@sinclair/typebox").TNumber;
        soldQty: import("@sinclair/typebox").TNumber;
        startDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        endDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    specInventories: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        spec: import("@sinclair/typebox").TString;
        originalPrice: import("@sinclair/typebox").TNumber;
        salePrice: import("@sinclair/typebox").TNumber;
        vipPrice: import("@sinclair/typebox").TNumber;
        stock: import("@sinclair/typebox").TNumber;
        cost: import("@sinclair/typebox").TNumber;
        name: import("@sinclair/typebox").TString;
    }>>;
    photos: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        filename: import("@sinclair/typebox").TString;
        alt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>>;
}>;
export declare const UpdateProductSchema: import("@sinclair/typebox").TObject<{
    product: import("@sinclair/typebox").TObject<{
        _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        categoryUuid: import("@sinclair/typebox").TString;
        categoryName: import("@sinclair/typebox").TString;
        isShow: import("@sinclair/typebox").TBoolean;
        name: import("@sinclair/typebox").TString;
        subtitle: import("@sinclair/typebox").TString;
        description: import("@sinclair/typebox").TString;
        hashTag: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        is_new: import("@sinclair/typebox").TBoolean;
        isHot: import("@sinclair/typebox").TBoolean;
        isSpecialOffer: import("@sinclair/typebox").TBoolean;
        ratings: import("@sinclair/typebox").TNumber;
        soldQty: import("@sinclair/typebox").TNumber;
        startDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        endDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>;
    specInventories: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        spec: import("@sinclair/typebox").TString;
        originalPrice: import("@sinclair/typebox").TNumber;
        salePrice: import("@sinclair/typebox").TNumber;
        vipPrice: import("@sinclair/typebox").TNumber;
        stock: import("@sinclair/typebox").TNumber;
        cost: import("@sinclair/typebox").TNumber;
        name: import("@sinclair/typebox").TString;
    }>>;
    photos: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        _id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        productUuid: import("@sinclair/typebox").TString;
        specUuid: import("@sinclair/typebox").TString;
        filename: import("@sinclair/typebox").TString;
        rank: import("@sinclair/typebox").TNumber;
        alt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>;
}>;
export type CreateProductRequest = {
    product: ProductAddParams;
    specInventories: SpecInventoryAddParams[];
    photos?: PhotoAddParams[];
};
export type UpdateProductRequest = {
    product: ProductUpdateParams;
    specInventories: SpecInventoryUpdateParams[];
    photos?: PhotoUpdateParams[];
};
