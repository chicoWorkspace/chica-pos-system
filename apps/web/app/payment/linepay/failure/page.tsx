import { LinePayStatusPage } from '../_components/status-page';

export default function LinePayFailurePage() {
  return (
    <LinePayStatusPage
      variant="failure"
      title="LINE Pay 付款失敗"
      description="付款過程中發生問題，請確認付款資訊後再試一次。"
    />
  );
}
