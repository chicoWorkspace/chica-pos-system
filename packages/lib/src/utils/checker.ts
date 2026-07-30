import validator from 'validator';

export default class Checker {
  public static checkNotEmpty(value: string) {
    if (!Checker.isNotEmpty(value)) {
      return '此欄位不可為空';
    }
  }
  public static checkAdminUsername(value: string) {
    if (!Checker.isNotEmpty(value)) {
      return '此欄位不可為空';
    }
    if (!Checker.isLetterAndNumber(value)) {
      return '請輸入正確半形英數字。';
    }
    if (!Checker.isLengthBetween(value, 3, 20)) {
      return '請輸入 3~20 半形英數字！';
    }
    return undefined;
  }
  public static checkUsername(value: string) {
    if (!Checker.isNotEmpty(value)) {
      return '此欄位不可為空';
    }
    if (!Checker.isEmail(value)) {
      return '請輸入正確的Email';
    }
    return undefined;
  }

  public static checkPassword(value: string) {
    if (!Checker.isNotEmpty(value)) {
      return '此欄位不可為空';
    }
    if (!Checker.isLetterAndNumber(value)) {
      return '請輸入正確半形英數字。';
    }
    if (!Checker.isLengthBetween(value, 6, 30)) {
      return '請輸入 6~30 半形英數字！';
    }
    return undefined;
  }

  public static checkEmail(value: string) {
    if (!Checker.isEmail(value)) {
      return '請輸入正確的Email';
    }
  }

  public static isLengthBetween(value: string, min: number, max: number) {
    const result = value.length >= min && value.length <= max;
    return result;
  }

  public static isLenth(value: string, length: number) {
    return value.length === length;
  }

  public static isNotEmpty(value?: string) {
    if (value) {
      return value.length > 0;
    }
    return false;
  }

  public static isNumberic(value: string) {
    return validator.isNumeric(value);
  }

  public static isEmail(value: string) {
    return validator.isEmail(value);
  }

  public static isMatcheRegex(value: string, regex: RegExp) {
    const result = validator.matches(value, regex);
    return result;
  }

  public static isTwMobile(value: string) {
    return validator.isMobilePhone(value, 'zh-TW');
  }

  public static isLetterAndNumber(value: string) {
    return Checker.isMatcheRegex(value, /^[a-zA-Z_0-9]{1,}$/);
  }

  public static isNumbers(value: string) {
    return Checker.isMatcheRegex(value, /^[0-9]{1,}$/);
  }

  public static isTwIdNumber(value: string) {
    return Checker.isMatcheRegex(value, /^[A-Z]{1}[0-9]{9}$/);
  }

  public static isDate(value: string) {
    return validator.isDate(value);
  }

  public static isUsername(value: string) {
    const result =
      Checker.isLetterAndNumber(value) && Checker.isLengthBetween(value, 6, 20);

    if (this.isNotEmpty(value)) {
      return result;
    }
    return false;
  }

  public static isJson(text: string) {
    if (
      /^[\],:{}\s]*$/.test(
        text
          .replace(/\\["\\\/bfnrtu]/g, '@')
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            ']',
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
}
