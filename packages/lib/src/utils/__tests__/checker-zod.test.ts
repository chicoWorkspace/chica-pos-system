import { CheckerZod } from "../checker-zod";

describe("CheckerZod", () => {
  describe("checkNotEmpty", () => {
    it("應該返回 undefined 當值不為空", () => {
      expect(CheckerZod.checkNotEmpty("test")).toBeUndefined();
    });

    it("應該返回錯誤信息當值為空字符串", () => {
      const error = CheckerZod.checkNotEmpty("");
      expect(error).toBeDefined();
      expect(error).toContain("此欄位不可為空");
    });
  });

  describe("checkAdminUsername", () => {
    it("應該驗證有效的管理員用戶名", () => {
      expect(CheckerZod.checkAdminUsername("admin123")).toBeUndefined();
      expect(CheckerZod.checkAdminUsername("test_user")).toBeUndefined();
      expect(CheckerZod.checkAdminUsername("user99")).toBeUndefined();
    });

    it("應該拒絕少於 3 個字符的用戶名", () => {
      const error = CheckerZod.checkAdminUsername("ab");
      expect(error).toBeDefined();
      expect(error).toContain("3~20");
    });

    it("應該拒絕超過 20 個字符的用戶名", () => {
      const error = CheckerZod.checkAdminUsername("a".repeat(21));
      expect(error).toBeDefined();
      expect(error).toContain("3~20");
    });

    it("應該拒絕包含特殊字符的用戶名", () => {
      const error = CheckerZod.checkAdminUsername("admin@123");
      expect(error).toBeDefined();
      expect(error).toContain("半形英數字");
    });

    it("應該拒絕包含中文的用戶名", () => {
      const error = CheckerZod.checkAdminUsername("管理員123");
      expect(error).toBeDefined();
    });
  });

  describe("checkUsername (Email)", () => {
    it("應該驗證有效的 Email", () => {
      expect(CheckerZod.checkUsername("user@example.com")).toBeUndefined();
      expect(CheckerZod.checkUsername("test123@domain.co.jp")).toBeUndefined();
    });

    it("應該拒絕無效的 Email 格式", () => {
      const error = CheckerZod.checkUsername("not-an-email");
      expect(error).toBeDefined();
      expect(error).toContain("Email");
    });

    it("應該拒絕空字符串", () => {
      const error = CheckerZod.checkUsername("");
      expect(error).toBeDefined();
    });

    it("應該拒絕沒有 @ 符號的 Email", () => {
      const error = CheckerZod.checkUsername("userdomain.com");
      expect(error).toBeDefined();
    });
  });

  describe("checkPassword", () => {
    it("應該驗證有效的密碼", () => {
      expect(CheckerZod.checkPassword("password123")).toBeUndefined();
      expect(CheckerZod.checkPassword("Test1234")).toBeUndefined();
      expect(CheckerZod.checkPassword("a1b2c3d4e5f6")).toBeUndefined();
    });

    it("應該拒絕少於 6 個字符的密碼", () => {
      const error = CheckerZod.checkPassword("pass1");
      expect(error).toBeDefined();
      expect(error).toContain("6~30");
    });

    it("應該拒絕超過 30 個字符的密碼", () => {
      const error = CheckerZod.checkPassword("a".repeat(31));
      expect(error).toBeDefined();
      expect(error).toContain("6~30");
    });

    it("應該拒絕包含特殊字符的密碼", () => {
      const error = CheckerZod.checkPassword("pass@word1");
      expect(error).toBeDefined();
      expect(error).toContain("半形英數字");
    });

    it("應該拒絕包含空格的密碼", () => {
      const error = CheckerZod.checkPassword("pass word1");
      expect(error).toBeDefined();
    });
  });

  describe("checkEmail", () => {
    it("應該驗證有效的 Email", () => {
      expect(CheckerZod.checkEmail("user@example.com")).toBeUndefined();
      expect(CheckerZod.checkEmail("test.name@domain.co.jp")).toBeUndefined();
    });

    it("應該拒絕無效的 Email 格式", () => {
      const error = CheckerZod.checkEmail("invalid-email");
      expect(error).toBeDefined();
      expect(error).toContain("Email");
    });

    it("應該拒絕沒有域名的 Email", () => {
      const error = CheckerZod.checkEmail("user@");
      expect(error).toBeDefined();
    });

    it("應該拒絕沒有 @ 符號的 Email", () => {
      const error = CheckerZod.checkEmail("userdomain.com");
      expect(error).toBeDefined();
    });
  });

  describe("isTwMobile", () => {
    it("應該驗證有效的台灣手機號碼", () => {
      expect(CheckerZod.isTwMobile("0912345678")).toBeUndefined();
      expect(CheckerZod.isTwMobile("0987654321")).toBeUndefined();
      expect(CheckerZod.isTwMobile("0900000000")).toBeUndefined();
    });

    it("應該拒絕不以 09 開頭的號碼", () => {
      const error = CheckerZod.isTwMobile("0812345678");
      expect(error).toBeDefined();
      expect(error).toContain("手機號碼");
    });

    it("應該拒絕少於 10 位的號碼", () => {
      const error = CheckerZod.isTwMobile("091234567");
      expect(error).toBeDefined();
    });

    it("應該拒絕超過 10 位的號碼", () => {
      const error = CheckerZod.isTwMobile("09123456789");
      expect(error).toBeDefined();
    });

    it("應該拒絕包含非數字的號碼", () => {
      const error = CheckerZod.isTwMobile("091234567a");
      expect(error).toBeDefined();
    });
  });

  describe("isTwIdNumber", () => {
    it("應該驗證有效的台灣身分證號", () => {
      expect(CheckerZod.isTwIdNumber("A123456789")).toBeUndefined();
      expect(CheckerZod.isTwIdNumber("Z987654321")).toBeUndefined();
    });

    it("應該拒絕小寫字母開頭的身分證號", () => {
      const error = CheckerZod.isTwIdNumber("a123456789");
      expect(error).toBeDefined();
      expect(error).toContain("身分證字號");
    });

    it("應該拒絕少於 10 個字符的身分證號", () => {
      const error = CheckerZod.isTwIdNumber("A12345678");
      expect(error).toBeDefined();
    });

    it("應該拒絕超過 10 個字符的身分證號", () => {
      const error = CheckerZod.isTwIdNumber("A1234567890");
      expect(error).toBeDefined();
    });

    it("應該拒絕非字母開頭的身分證號", () => {
      const error = CheckerZod.isTwIdNumber("1234567890");
      expect(error).toBeDefined();
    });

    it("應該拒絕後面不全是數字的身分證號", () => {
      const error = CheckerZod.isTwIdNumber("A12345678a");
      expect(error).toBeDefined();
    });
  });

  describe("isDate", () => {
    it("應該驗證有效的日期字符串", () => {
      expect(CheckerZod.isDate("2024-01-01")).toBeUndefined();
      expect(CheckerZod.isDate("2024-12-31")).toBeUndefined();
      expect(CheckerZod.isDate("2024/01/01")).toBeUndefined();
    });

    it("應該拒絕無效的日期字符串", () => {
      const error = CheckerZod.isDate("not-a-date");
      expect(error).toBeDefined();
      expect(error).toContain("日期");
    });

    it("應該拒絕不存在的日期", () => {
      const error = CheckerZod.isDate("invalid-date-string");
      expect(error).toBeDefined();
    });

    it("應該拒絕空字符串", () => {
      const error = CheckerZod.isDate("");
      expect(error).toBeDefined();
    });
  });

  describe("isJson", () => {
    it("應該驗證有效的 JSON 字符串", () => {
      expect(CheckerZod.isJson('{"key": "value"}')).toBeUndefined();
      expect(CheckerZod.isJson('["item1", "item2"]')).toBeUndefined();
      expect(CheckerZod.isJson('{"nested": {"key": "value"}}')).toBeUndefined();
    });

    it("應該拒絕無效的 JSON 字符串", () => {
      const error = CheckerZod.isJson("{key: value}");
      expect(error).toBeDefined();
      expect(error).toContain("JSON");
    });

    it("應該拒絕單引號的 JSON", () => {
      const error = CheckerZod.isJson("{'key': 'value'}");
      expect(error).toBeDefined();
    });

    it("應該拒絕空字符串", () => {
      const error = CheckerZod.isJson("");
      expect(error).toBeDefined();
    });
  });

  describe("isLetterAndNumber", () => {
    it("應該驗證包含字母、數字和下劃線的字符串", () => {
      expect(CheckerZod.isLetterAndNumber("abc123")).toBe(true);
      expect(CheckerZod.isLetterAndNumber("test_user")).toBe(true);
      expect(CheckerZod.isLetterAndNumber("ABC_123")).toBe(true);
    });

    it("應該拒絕包含特殊字符的字符串", () => {
      expect(CheckerZod.isLetterAndNumber("abc@123")).toBe(false);
      expect(CheckerZod.isLetterAndNumber("test-user")).toBe(false);
      expect(CheckerZod.isLetterAndNumber("user.name")).toBe(false);
    });

    it("應該拒絕包含空格的字符串", () => {
      expect(CheckerZod.isLetterAndNumber("abc 123")).toBe(false);
    });

    it("應該拒絕包含中文的字符串", () => {
      expect(CheckerZod.isLetterAndNumber("abc中文")).toBe(false);
    });
  });

  describe("isNumbers", () => {
    it("應該驗證純數字字符串", () => {
      expect(CheckerZod.isNumbers("123456")).toBe(true);
      expect(CheckerZod.isNumbers("0")).toBe(true);
      expect(CheckerZod.isNumbers("9876543210")).toBe(true);
    });

    it("應該拒絕包含字母的字符串", () => {
      expect(CheckerZod.isNumbers("123abc")).toBe(false);
      expect(CheckerZod.isNumbers("abc")).toBe(false);
    });

    it("應該拒絕包含特殊字符的字符串", () => {
      expect(CheckerZod.isNumbers("123-456")).toBe(false);
      expect(CheckerZod.isNumbers("123.456")).toBe(false);
    });

    it("應該拒絕空字符串", () => {
      expect(CheckerZod.isNumbers("")).toBe(false);
    });
  });

  describe("isNotEmpty", () => {
    it("應該驗證非空字符串", () => {
      expect(CheckerZod.isNotEmpty("test")).toBe(true);
      expect(CheckerZod.isNotEmpty("a")).toBe(true);
    });

    it("應該拒絕空字符串", () => {
      expect(CheckerZod.isNotEmpty("")).toBe(false);
    });

    it("應該拒絕 undefined", () => {
      expect(CheckerZod.isNotEmpty(undefined)).toBe(false);
    });

    it("應該拒絕 null（作為 undefined）", () => {
      expect(CheckerZod.isNotEmpty(null as any)).toBe(false);
    });
  });

  describe("isLengthBetween", () => {
    it("應該驗證長度在指定範圍內的字符串", () => {
      expect(CheckerZod.isLengthBetween("abc", 2, 5)).toBe(true);
      expect(CheckerZod.isLengthBetween("test", 3, 5)).toBe(true);
      expect(CheckerZod.isLengthBetween("ab", 2, 5)).toBe(true);
    });

    it("應該拒絕長度小於最小值的字符串", () => {
      expect(CheckerZod.isLengthBetween("ab", 3, 5)).toBe(false);
      expect(CheckerZod.isLengthBetween("a", 2, 5)).toBe(false);
    });

    it("應該拒絕長度大於最大值的字符串", () => {
      expect(CheckerZod.isLengthBetween("toolong", 2, 5)).toBe(false);
      expect(CheckerZod.isLengthBetween("abcdef", 2, 5)).toBe(false);
    });

    it("應該驗證邊界情況", () => {
      expect(CheckerZod.isLengthBetween("abc", 3, 3)).toBe(true);
      expect(CheckerZod.isLengthBetween("ab", 3, 3)).toBe(false);
    });
  });

  describe("isLenth", () => {
    it("應該驗證正確長度的字符串", () => {
      expect(CheckerZod.isLenth("abc", 3)).toBe(true);
      expect(CheckerZod.isLenth("test", 4)).toBe(true);
      expect(CheckerZod.isLenth("a", 1)).toBe(true);
    });

    it("應該拒絕不同長度的字符串", () => {
      expect(CheckerZod.isLenth("abc", 2)).toBe(false);
      expect(CheckerZod.isLenth("test", 5)).toBe(false);
      expect(CheckerZod.isLenth("ab", 3)).toBe(false);
    });

    it("應該驗證空字符串長度為 0", () => {
      expect(CheckerZod.isLenth("", 0)).toBe(true);
      expect(CheckerZod.isLenth("", 1)).toBe(false);
    });
  });
});
