import { PresetGraph } from '../types';

export const PRESET_GRAPHS: PresetGraph[] = [
  {
    id: 'test-1-c4',
    name: '1. Chu trình C4',
    category: 'Bài kiểm thử chuẩn',
    description: 'Chu trình đơn 4 đỉnh A, B, C, D. Mọi đỉnh đều có bậc 2 (bậc chẵn) và liên thông.',
    expectedEuler: 'CÓ Chu trình Euler (mọi đỉnh bậc 2)',
    expectedHamilton: 'CÓ Chu trình Hamilton (chính là chu trình C4: A-B-C-D-A)',
    vertices: [
      { id: 'v1', label: 'A', x: 200, y: 120 },
      { id: 'v2', label: 'B', x: 440, y: 120 },
      { id: 'v3', label: 'C', x: 440, y: 360 },
      { id: 'v4', label: 'D', x: 200, y: 360 },
    ],
    edges: [
      { u: 'v1', v: 'v2' },
      { u: 'v2', v: 'v3' },
      { u: 'v3', v: 'v4' },
      { u: 'v4', v: 'v1' },
    ],
  },
  {
    id: 'test-2-square-diagonal',
    name: '2. Hình vuông có một đường chéo',
    category: 'Bài kiểm thử chuẩn',
    description: 'Hình vuông ABCD có thêm cạnh chéo AC. Đỉnh A và C có bậc 3 (lẻ), đỉnh B và D có bậc 2.',
    expectedEuler: 'KHÔNG có Euler (có 2 đỉnh bậc lẻ là A và C)',
    expectedHamilton: 'CÓ Chu trình Hamilton (A → B → C → D → A)',
    vertices: [
      { id: 'v1', label: 'A', x: 200, y: 120 },
      { id: 'v2', label: 'B', x: 440, y: 120 },
      { id: 'v3', label: 'C', x: 440, y: 360 },
      { id: 'v4', label: 'D', x: 200, y: 360 },
    ],
    edges: [
      { u: 'v1', v: 'v2' },
      { u: 'v2', v: 'v3' },
      { u: 'v3', v: 'v4' },
      { u: 'v4', v: 'v1' },
      { u: 'v1', v: 'v3' }, // Đường chéo AC
    ],
  },
  {
    id: 'test-3-two-odd',
    name: '3. Có đúng 2 đỉnh bậc lẻ (Đường đi Euler)',
    category: 'Bài kiểm thử chuẩn',
    description: 'Đồ thị liên thông gồm tam giác ABC và một cạnh râu AD gắn vào A. Đỉnh D có bậc 1, đỉnh A có bậc 3, B và C bậc 2.',
    expectedEuler: 'CÓ ĐƯỜNG ĐI Euler (bắt đầu tại D kết thúc tại A hoặc ngược lại), KHÔNG có Chu trình',
    expectedHamilton: 'KHÔNG có Hamilton (đỉnh D có bậc 1, không thể tạo chu trình)',
    vertices: [
      { id: 'v1', label: 'A', x: 300, y: 220 },
      { id: 'v2', label: 'B', x: 440, y: 140 },
      { id: 'v3', label: 'C', x: 440, y: 300 },
      { id: 'v4', label: 'D', x: 160, y: 220 },
    ],
    edges: [
      { u: 'v1', v: 'v2' },
      { u: 'v2', v: 'v3' },
      { u: 'v3', v: 'v1' },
      { u: 'v4', v: 'v1' }, // Cạnh râu AD
    ],
  },
  {
    id: 'test-4-disconnected',
    name: '4. Đồ thị không liên thông',
    category: 'Bài kiểm thử chuẩn',
    description: 'Bao gồm hai tam giác rời nhau (A-B-C) và (D-E-F). Mỗi đỉnh đều có bậc 2 nhưng đồ thị bị phân rã thành 2 thành phần.',
    expectedEuler: 'KHÔNG có Euler (tập cạnh không liên thông)',
    expectedHamilton: 'KHÔNG có Hamilton (đồ thị không liên thông)',
    vertices: [
      { id: 'v1', label: 'A', x: 180, y: 150 },
      { id: 'v2', label: 'B', x: 280, y: 150 },
      { id: 'v3', label: 'C', x: 230, y: 310 },
      { id: 'v4', label: 'D', x: 420, y: 150 },
      { id: 'v5', label: 'E', x: 520, y: 150 },
      { id: 'v6', label: 'F', x: 470, y: 310 },
    ],
    edges: [
      { u: 'v1', v: 'v2' },
      { u: 'v2', v: 'v3' },
      { u: 'v3', v: 'v1' },
      { u: 'v4', v: 'v5' },
      { u: 'v5', v: 'v6' },
      { u: 'v6', v: 'v4' },
    ],
  },
  {
    id: 'test-5-isolated',
    name: '5. Đồ thị có đỉnh cô lập',
    category: 'Bài kiểm thử chuẩn',
    description: 'Chu trình C4 (A-B-C-D) kèm theo 1 đỉnh cô lập E (bậc 0).',
    expectedEuler: 'CÓ Chu trình Euler trên tập cạnh (đỉnh cô lập không làm mất tính Euler của cạnh)',
    expectedHamilton: 'KHÔNG có Hamilton (không thể ghé thăm đỉnh cô lập E trong chu trình)',
    vertices: [
      { id: 'v1', label: 'A', x: 180, y: 130 },
      { id: 'v2', label: 'B', x: 380, y: 130 },
      { id: 'v3', label: 'C', x: 380, y: 330 },
      { id: 'v4', label: 'D', x: 180, y: 330 },
      { id: 'v5', label: 'E', x: 520, y: 230 }, // Đỉnh cô lập
    ],
    edges: [
      { u: 'v1', v: 'v2' },
      { u: 'v2', v: 'v3' },
      { u: 'v3', v: 'v4' },
      { u: 'v4', v: 'v1' },
    ],
  },
  {
    id: 'test-6-no-hamilton',
    name: '6. Không có Hamilton (Đồ thị Hình Nơ / Cầu Nối)',
    category: 'Bài kiểm thử chuẩn',
    description: 'Hai chu trình C3 chung đỉnh trung tâm C (hình cánh bướm A-B-C và C-D-E). Bậc C = 4, các đỉnh khác bậc 2.',
    expectedEuler: 'CÓ Chu trình Euler (mọi đỉnh đều có bậc chẵn 2 hoặc 4)',
    expectedHamilton: 'KHÔNG có Hamilton (đỉnh C là điểm khớp / cắt, phải đi qua C 2 lần)',
    vertices: [
      { id: 'v1', label: 'A', x: 160, y: 150 },
      { id: 'v2', label: 'B', x: 160, y: 330 },
      { id: 'v3', label: 'C', x: 320, y: 240 },
      { id: 'v4', label: 'D', x: 480, y: 150 },
      { id: 'v5', label: 'E', x: 480, y: 330 },
    ],
    edges: [
      { u: 'v1', v: 'v2' },
      { u: 'v2', v: 'v3' },
      { u: 'v3', v: 'v1' },
      { u: 'v4', v: 'v5' },
      { u: 'v5', v: 'v3' },
      { u: 'v3', v: 'v4' },
    ],
  },
  {
    id: 'test-7-minimal-empty',
    name: '7. Đồ thị đặc biệt cực tiểu (2 đỉnh 1 cạnh)',
    category: 'Bài kiểm thử chuẩn',
    description: 'Đồ thị chỉ gồm 2 đỉnh A và B nối nhau bằng 1 cạnh duy nhất.',
    expectedEuler: 'CÓ ĐƯỜNG ĐI Euler (A-B), KHÔNG có chu trình',
    expectedHamilton: 'KHÔNG có Hamilton (cần ít nhất 3 đỉnh cho đồ thị đơn)',
    vertices: [
      { id: 'v1', label: 'A', x: 220, y: 240 },
      { id: 'v2', label: 'B', x: 420, y: 240 },
    ],
    edges: [
      { u: 'v1', v: 'v2' },
    ],
  },
  {
    id: 'test-8-house',
    name: '8. Ngôi nhà Konigsberg (Hình phong bì)',
    category: 'Bài kiểm thử mở rộng',
    description: 'Đồ thị hình ngôi nhà 5 đỉnh (A, B, C, D tạo hình vuông và E là mái nhà nối với A và B). A và B bậc 4; C, D, E bậc 2.',
    expectedEuler: 'CÓ Chu trình Euler (tất cả các đỉnh đều có bậc chẵn)',
    expectedHamilton: 'CÓ Chu trình Hamilton (E → A → D → C → B → E)',
    vertices: [
      { id: 'v1', label: 'A', x: 220, y: 200 },
      { id: 'v2', label: 'B', x: 420, y: 200 },
      { id: 'v3', label: 'C', x: 420, y: 380 },
      { id: 'v4', label: 'D', x: 220, y: 380 },
      { id: 'v5', label: 'E', x: 320, y: 90 }, // Mái nhà
    ],
    edges: [
      { u: 'v5', v: 'v1' },
      { u: 'v5', v: 'v2' },
      { u: 'v1', v: 'v2' },
      { u: 'v2', v: 'v3' },
      { u: 'v3', v: 'v4' },
      { u: 'v4', v: 'v1' },
      { u: 'v1', v: 'v3' }, // Đường chéo bên trong
      { u: 'v2', v: 'v4' }, // Đường chéo bên trong
    ],
  },
  {
    id: 'test-9-k5',
    name: '9. Đồ thị đầy đủ K5 (Ngôi sao 5 cánh)',
    category: 'Bài kiểm thử mở rộng',
    description: 'Đồ thị 5 đỉnh nối đôi một với nhau. Mọi đỉnh đều có bậc 4.',
    expectedEuler: 'CÓ Chu trình Euler (tất cả 5 đỉnh đều có bậc 4)',
    expectedHamilton: 'CÓ Chu trình Hamilton (nhiều chu trình tồn tại)',
    vertices: [
      { id: 'v1', label: 'A', x: 320, y: 100 },
      { id: 'v2', label: 'B', x: 480, y: 210 },
      { id: 'v3', label: 'C', x: 420, y: 390 },
      { id: 'v4', label: 'D', x: 220, y: 390 },
      { id: 'v5', label: 'E', x: 160, y: 210 },
    ],
    edges: [
      { u: 'v1', v: 'v2' }, { u: 'v1', v: 'v3' }, { u: 'v1', v: 'v4' }, { u: 'v1', v: 'v5' },
      { u: 'v2', v: 'v3' }, { u: 'v2', v: 'v4' }, { u: 'v2', v: 'v5' },
      { u: 'v3', v: 'v4' }, { u: 'v3', v: 'v5' },
      { u: 'v4', v: 'v5' },
    ],
  }
];
