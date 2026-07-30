import { LinePayStatusPage } from '../_components/status-page';

export default function LinePaySuccessPage() {
  return (
    <LinePayStatusPage
      variant="success"
      title="LINE Pay 付款成功"
      description="您的訂單已完成付款，接下來會為您整理出貨資訊。"
    />
  );
}
