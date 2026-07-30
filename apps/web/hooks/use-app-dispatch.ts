import { useDispatch } from "react-redux";
import type { AppDispatch } from "../src/store";

/* 官方建議作法
 這個 hook 會回傳具備 AppDispatch 型別的 dispatch。
 使用這個 dispatch 可以：
    1. 正確支援 createAsyncThunk 的型別提示與回傳型別。
    2. 使用 .unwrap() 時有型別補全。
    3. 傳入參數與錯誤型別都會有型別驗證。
 建議在需要 dispatch redux action 的元件中都用 useAppDispatch 取代原生 useDispatch。
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
