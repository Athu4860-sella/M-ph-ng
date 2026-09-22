import { X, BookOpen, CheckCircle2, AlertTriangle, Layers, GitBranch } from 'lucide-react';

interface TheoryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TheoryGuideModal({ isOpen, onClose }: TheoryGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Lý Thuyết Toán Rời Rạc: Chu Trình Euler & Hamilton
              </h2>
              <p className="text-xs text-slate-500">
                Hướng dẫn sử dụng ứng dụng và các định lý toán học nền tảng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* PHẦN 1: EULER */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>1. ĐỒ THỊ EULER & THUẬT TOÁN HIERHOLZER</span>
            </h3>
            <div className="bg-indigo-50/60 border border-indigo-100 p-3.5 rounded-xl space-y-2 text-xs">
              <p>
                <strong>Định nghĩa:</strong> Đường đi Euler là đường đi đi qua mỗi cạnh của đồ thị đúng một lần. Chu trình Euler là đường đi Euler khép kín (bắt đầu và kết thúc tại cùng một đỉnh).
              </p>
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Điều kiện có Chu trình Euler:</strong> Đồ thị liên thông (trên tập các đỉnh có bậc dương) và <em>mọi đỉnh đều có bậc chẵn</em>.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Điều kiện có Đường đi Euler:</strong> Đồ thị liên thông và có <em>đúng 2 đỉnh bậc lẻ</em> (đường đi sẽ bắt đầu ở đỉnh bậc lẻ này và kết thúc ở đỉnh bậc lẻ kia).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Đỉnh cô lập:</strong> Các đỉnh có bậc bằng 0 không làm mất tính Euler trên tập hợp các cạnh của đồ thị.
                  </span>
                </div>
              </div>
              <p className="pt-1 text-slate-600">
                <strong>Thuật toán Hierholzer:</strong> Khởi tạo tại đỉnh xuất phát, dùng ngăn xếp duyệt qua các cạnh chưa thăm để tạo chu trình con. Khi một đỉnh không còn cạnh nào để đi tiếp, rút đỉnh đó vào danh sách kết quả (ghép chu trình). Độ phức tạp: <code>O(|V| + |E|)</code>.
              </p>
            </div>
          </section>

          {/* PHẦN 2: HAMILTON */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>2. ĐỒ THỊ HAMILTON & THUẬT TOÁN QUAY LUI (BACKTRACKING)</span>
            </h3>
            <div className="bg-purple-50/60 border border-purple-100 p-3.5 rounded-xl space-y-2 text-xs">
              <p>
                <strong>Định nghĩa:</strong> Chu trình Hamilton là chu trình đơn đi qua <em>mỗi đỉnh của đồ thị đúng một lần</em> (trừ đỉnh xuất phát xuất hiện ở đầu và cuối chu trình).
              </p>
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Điều kiện cần cơ bản:</strong> Để tồn tại chu trình Hamilton trong đồ thị đơn n đỉnh (n ≥ 3), mọi đỉnh đều phải có bậc <em>ít nhất bằng 2</em> (deg(v) ≥ 2) và đồ thị phải liên thông.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Độ phức tạp NP-đầy đủ:</strong> Hiện chưa có điều kiện cần và đủ đa thức để nhận biết đồ thị Hamilton. Thuật toán quay lui duyệt nhánh có độ phức tạp <code>O(n!)</code> trong trường hợp xấu nhất.
                  </span>
                </div>
              </div>
              <p className="pt-1 text-slate-600">
                <strong>Xử lý trong ứng dụng:</strong> Thuật toán sử dụng cơ chế bảo vệ (ngưỡng tối đa 100.000 trạng thái) để phân biệt rõ ràng giữa "Đã duyệt hết toàn bộ không gian trạng thái và khẳng định không có chu trình" với "Dừng sớm do quy mô đồ thị quá lớn".
              </p>
            </div>
          </section>

          {/* PHẦN 3: HƯỚNG DẪN SỬ DỤNG ỨNG DỤNG */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              <span>3. HƯỚNG DẪN THAO TÁC TRÊN GIAO DIỆN</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <li><strong>Kéo thả đỉnh:</strong> Chọn chế độ <em>"Kéo & Chọn"</em> và dùng chuột kéo đỉnh đến vị trí mong muốn trên vùng vẽ.</li>
              <li><strong>Nối cạnh nhanh:</strong> Chọn chế độ <em>"Nối Cạnh Nhanh"</em> rồi bấm lần lượt 2 đỉnh để tạo cạnh tức thì.</li>
              <li><strong>Nhập chuỗi cạnh:</strong> Chuyển sang tab <em>"Nhập Cạnh"</em> và gõ danh sách cạnh như <code>AB, BC, CD, DA</code>.</li>
              <li><strong>Chạy bài mẫu:</strong> Chọn tab <em>"Bài Mẫu (1-8)"</em> để nạp ngay các trường hợp kiểm thử chuẩn theo đề bài (C4, đồ thị có râu, không liên thông, đỉnh cô lập...).</li>
              <li><strong>Mô phỏng từng bước:</strong> Nhấn nút <em>"Mô phỏng từng bước"</em> để quan sát thuật toán di chuyển đỉnh/cạnh, đổi màu và giải thích chi tiết bằng tiếng Việt.</li>
              <li><strong>Lấy mã nguồn Python:</strong> Bấm nút <em>"Mã Python"</em> ở góc trên bên phải để sao chép hoặc tải tập tin <code>.py</code> chạy trên máy tính hoặc Google Colab.</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
