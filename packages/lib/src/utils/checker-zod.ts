import { z, ZodError } from "zod";

// 自定義正則
const letterAndNumberRegex = /^[a-zA-Z0-9_]+$/;
const numbersRegex = /^[0-9]+$/;
const twIdRegex = /^[A-Z][0-9]{9}$/;

export  class CheckerZod {
  private static parseSchema(
    schema: z.ZodTypeAny,
    value: string
  ): string | undefined {
    try {
      schema.parse(value);
      return undefined;
    } catch (err) {
      if (err instanceof ZodError) {
        return err.issues[0]?.message;
      }
      return "未知錯誤";
    }
  }

  // Schema 定義
   static notEmptySchema = z
    .string()
    .min(1, { message: "此欄位不可為空" });
   static adminUsernameSchema = z
    .string()
    .min(3, { message: "請輸入 3~20 半形英數字！" })
    .max(20, { message: "請輸入 3~20 半形英數字！" })
    .regex(letterAndNumberRegex, { message: "請輸入正確半形英數字。" });
   static usernameSchema = z
    .string()
    .nonempty({ message: "此欄位不可為空" })
    .email({ message: "請輸入正確的Email" });
   static passwordSchema = z
    .string()
    .min(6, { message: "請輸入 6~30 半形英數字！" })
    .max(30, { message: "請輸入 6~30 半形英數字！" })
    .regex(letterAndNumberRegex, { message: "請輸入正確半形英數字。" });
   static emailSchema = z
    .string()
    .email({ message: "請輸入正確的Email" });
   static twMobileSchema = z
    .string()
    .regex(/^09\d{8}$/, { message: "請輸入正確的手機號碼" });
   static twIdSchema = z
    .string()
    .regex(twIdRegex, { message: "請輸入正確的身分證字號" });
   static dateSchema = z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "請輸入正確日期" });
   static jsonSchema = z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "請輸入正確的 JSON 字串" }
  );

  // ======== checkXXX 方法 ========
  static checkNotEmpty(value: string) {
    return this.parseSchema(this.notEmptySchema, value);
  }

  static checkAdminUsername(value: string) {
    return this.parseSchema(this.adminUsernameSchema, value);
  }

  static checkUsername(value: string) {
    return this.parseSchema(this.usernameSchema, value);
  }

  static checkPassword(value: string) {
    return this.parseSchema(this.passwordSchema, value);
  }

  static checkEmail(value: string) {
    return this.parseSchema(this.emailSchema, value);
  }

  // ======== isXXX 方法 ========
  static isTwMobile(value: string) {
    return this.parseSchema(this.twMobileSchema, value);
  }

  static isTwIdNumber(value: string) {
    return this.parseSchema(this.twIdSchema, value);
  }

  static isDate(value: string) {
    return this.parseSchema(this.dateSchema, value);
  }

  static isJson(value: string) {
    return this.parseSchema(this.jsonSchema, value);
  }

  static isLetterAndNumber(value: string) {
    return letterAndNumberRegex.test(value);
  }

  static isNumbers(value: string) {
    return numbersRegex.test(value);
  }

  static isNotEmpty(value?: string) {
    return value ? value.length > 0 : false;
  }

  static isLengthBetween(value: string, min: number, max: number) {
    return value.length >= min && value.length <= max;
  }

  static isLenth(value: string, length: number) {
    return value.length === length;
  }
}
