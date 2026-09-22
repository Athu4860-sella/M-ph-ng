# HƯỚNG DẪN CHẠY TRÊN GOOGLE COLAB:
# 1. Truy cập https://colab.research.google.com/
# 2. Tạo một Notebook mới (New Notebook).
# 3. Tạo một ô mã (Code cell) và dán đoạn mã sau để cài đặt và chạy ngay:

#!pip install -q networkx matplotlib

# Sau đó tải tập tin euler_hamilton.py hoặc dán trực tiếp toàn bộ mã nguồn bên dưới vào và chạy.


"""
=============================================================================
BÀI TẬP TOÁN RỜI RẠC: NHẬN BIẾT & TÌM CHU TRÌNH EULER - HAMILTON BẰNG PYTHON
=============================================================================
Thư viện yêu cầu:
    pip install networkx matplotlib

Cách chạy:
    python euler_hamilton.py
Hoặc chạy trực tiếp trên Google Colab / Jupyter Notebook.
"""

import sys
import time
from collections import defaultdict, deque
import networkx as nx
import matplotlib.pyplot as plt


class Graph:
    """
    Lớp biểu diễn đồ thị vô hướng và các thuật toán kiểm tra Euler, Hamilton.
    """
    def __init__(self):
        self.adj = defaultdict(set)      # Danh sách kề: u -> tập hợp các đỉnh v
        self.vertices = set()           # Tập hợp các đỉnh
        self.edges = set()              # Tập hợp các cạnh dạng tuple (min(u,v), max(u,v))

    def add_vertex(self, u):
        """Thêm đỉnh vào đồ thị"""
        self.vertices.add(str(u).strip())

    def remove_vertex(self, u):
        """Xóa đỉnh và các cạnh liên thuộc"""
        u = str(u).strip()
        if u in self.vertices:
            self.vertices.remove(u)
            neighbors = list(self.adj[u])
            for v in neighbors:
                self.adj[v].discard(u)
                self.edges.discard((min(u, v), max(u, v)))
            del self.adj[u]

    def add_edge(self, u, v):
        """Thêm cạnh vô hướng giữa u và v"""
        u = str(u).strip()
        v = str(v).strip()
        if u == v:
            print(f"[-] Bỏ qua khuyên (tự lặp): ({u}, {v})")
            return False
        self.add_vertex(u)
        self.add_vertex(v)
        self.adj[u].add(v)
        self.adj[v].add(u)
        self.edges.add((min(u, v), max(u, v)))
        return True

    def remove_edge(self, u, v):
        """Xóa cạnh giữa u và v"""
        u = str(u).strip()
        v = str(v).strip()
        self.adj[u].discard(v)
        self.adj[v].discard(u)
        self.edges.discard((min(u, v), max(u, v)))

    def clear(self):
        """Xóa sạch đồ thị"""
        self.adj.clear()
        self.vertices.clear()
        self.edges.clear()

    def get_degrees(self):
        """Tính bậc của từng đỉnh trong đồ thị"""
        degrees = {}
        for v in sorted(self.vertices):
            degrees[v] = len(self.adj[v])
        return degrees

    def check_edge_connectivity(self):
        """
        Kiểm tra tính liên thông của các đỉnh có bậc > 0.
        (Các đỉnh cô lập không làm ảnh hưởng đến điều kiện tồn tại chu trình Euler).
        """
        degrees = self.get_degrees()
        active_nodes = [v for v, deg in degrees.items() if deg > 0]
        
        if len(active_nodes) <= 1:
            return True, 1 if active_nodes else 0

        visited = set()
        queue = deque([active_nodes[0]])
        visited.add(active_nodes[0])

        while queue:
            curr = queue.popleft()
            for neighbor in self.adj[curr]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        # Kiểm tra xem toàn bộ các đỉnh có bậc > 0 đã được duyệt qua chưa
        is_connected = (len(visited) == len(active_nodes))
        return is_connected, 1 if is_connected else 2

    # =========================================================================
    # PHẦN 1: THUẬT TOÁN EULER (ĐỊNH LÝ EULER & THUẬT TOÁN HIERHOLZER)
    # =========================================================================
    def check_euler(self):
        """
        Kiểm tra tính chất Euler của đồ thị vô hướng:
        - Chu trình Euler: Liên thông (phần có cạnh) và TẤT CẢ các đỉnh đều có bậc chẵn.
        - Đường đi Euler: Liên thông (phần có cạnh) và có ĐÚNG 2 đỉnh bậc lẻ.
        """
        n_vertices = len(self.vertices)
        n_edges = len(self.edges)

        # Trường hợp đồ thị rỗng hoặc không có cạnh
        if n_vertices == 0:
            return {
                "type": "none",
                "message": "Đồ thị rỗng (0 đỉnh, 0 cạnh).",
                "cycle_or_trail": None,
                "odd_vertices": []
            }
        
        if n_edges == 0:
            if n_vertices == 1:
                v = list(self.vertices)[0]
                return {
                    "type": "euler_cycle",
                    "message": "Đồ thị 1 đỉnh không cạnh: Theo quy ước lý thuyết đồ thị có chu trình Euler rỗng.",
                    "cycle_or_trail": [v],
                    "odd_vertices": []
                }
            return {
                "type": "none",
                "message": f"Đồ thị có {n_vertices} đỉnh nhưng không có cạnh nào (|E| = 0). Không tồn tại chu trình hay đường đi Euler.",
                "cycle_or_trail": None,
                "odd_vertices": []
            }

        is_connected, _ = self.check_edge_connectivity()
        degrees = self.get_degrees()
        odd_vertices = [v for v, deg in degrees.items() if deg % 2 != 0]

        if not is_connected:
            return {
                "type": "none",
                "message": "Đồ thị KHÔNG EULER vì các cạnh không liên thông với nhau.",
                "cycle_or_trail": None,
                "odd_vertices": odd_vertices
            }

        # Có chu trình Euler
        if len(odd_vertices) == 0:
            # Chọn đỉnh xuất phát có bậc > 0
            start_vertex = next(v for v, d in degrees.items() if d > 0)
            cycle = self._hierholzer(start_vertex)
            return {
                "type": "euler_cycle",
                "message": "ĐỒ THỊ CÓ CHU TRÌNH EULER (Tất cả đỉnh bậc > 0 đều liên thông và có bậc chẵn).",
                "cycle_or_trail": cycle,
                "odd_vertices": []
            }

        # Có đường đi Euler (không có chu trình)
        elif len(odd_vertices) == 2:
            start_vertex = odd_vertices[0]
            trail = self._hierholzer(start_vertex)
            return {
                "type": "euler_trail",
                "message": f"ĐỒ THỊ CÓ ĐƯỜNG ĐI EULER nhưng KHÔNG CÓ CHU TRÌNH (Có đúng 2 đỉnh bậc lẻ: {odd_vertices}).",
                "cycle_or_trail": trail,
                "odd_vertices": odd_vertices
            }

        # Không phải Euler
        else:
            return {
                "type": "none",
                "message": f"KHÔNG PHẢI EULER vì có {len(odd_vertices)} đỉnh bậc lẻ: {odd_vertices}.",
                "cycle_or_trail": None,
                "odd_vertices": odd_vertices
            }

    def _hierholzer(self, start_vertex):
        """
        Thuật toán Hierholzer tìm chu trình / đường đi Euler:
        Sử dụng ngăn xếp (stack), xóa cạnh đã đi và ghép nối chu trình con.
        """
        # Tạo bản sao danh sách kề để theo dõi cạnh còn lại
        temp_adj = defaultdict(list)
        for u in self.adj:
            temp_adj[u] = list(self.adj[u])

        stack = [start_vertex]
        circuit = []

        while stack:
            curr = stack[-1]
            if temp_adj[curr]:
                # Còn cạnh kề chưa đi qua
                next_v = temp_adj[curr].pop()
                temp_adj[next_v].remove(curr)
                stack.append(next_v)
            else:
                # Không còn cạnh đi tiếp, rút ra đưa vào chu trình
                circuit.append(stack.pop())

        return circuit[::-1]  # Đảo ngược để có thứ tự thuận

    # =========================================================================
    # PHẦN 2: THUẬT TOÁN HAMILTON (QUAY LUI - BACKTRACKING)
    # =========================================================================
    def check_hamilton(self, start_vertex=None, max_states=200000):
        """
        Kiểm tra chu trình Hamilton bằng thuật toán quay lui (Backtracking).
        Có giới hạn max_states để tránh treo máy đối với đồ thị lớn.
        """
        n = len(self.vertices)
        if n == 0:
            return {"is_hamilton": False, "completed": True, "cycle": None, "message": "Đồ thị rỗng."}
        if n < 3:
            return {
                "is_hamilton": False,
                "completed": True,
                "cycle": None,
                "message": f"Đồ thị có {n} đỉnh. Đồ thị đơn cần ít nhất 3 đỉnh để tạo chu trình Hamilton."
            }

        # Điều kiện cần: Mỗi đỉnh phải có bậc >= 2
        degrees = self.get_degrees()
        invalid_degrees = [v for v, deg in degrees.items() if deg < 2]
        if invalid_degrees:
            return {
                "is_hamilton": False,
                "completed": True,
                "cycle": None,
                "message": f"KHÔNG CÓ CHU TRÌNH HAMILTON: Tồn tại đỉnh bậc nhỏ hơn 2 ({invalid_degrees})."
            }

        vertex_list = sorted(list(self.vertices))
        start_node = start_vertex if (start_vertex and start_vertex in self.vertices) else vertex_list[0]

        path = [start_node]
        visited = {start_node}
        state_count = [0]
        start_time = time.time()

        def backtrack(u):
            state_count[0] += 1
            if state_count[0] > max_states:
                return None  # Đạt ngưỡng giới hạn an toàn

            if len(path) == n:
                # Nếu đã duyệt qua tất cả n đỉnh, kiểm tra cạnh nối về đỉnh đầu
                if start_node in self.adj[u]:
                    return path + [start_node]
                return None

            for neighbor in sorted(self.adj[u]):
                if neighbor not in visited:
                    visited.add(neighbor)
                    path.append(neighbor)

                    result = backtrack(neighbor)
                    if result is not None:
                        return result

                    # Quay lui
                    path.pop()
                    visited.remove(neighbor)

            return None

        hamilton_cycle = backtrack(start_node)
        elapsed = round((time.time() - start_time) * 1000, 2)

        if state_count[0] > max_states:
            return {
                "is_hamilton": False,
                "completed": False,
                "cycle": None,
                "message": f"CHƯA HOÀN TẤT TÌM KIẾM: Vượt ngưỡng an toàn ({max_states} trạng thái, {elapsed} ms). Đồ thị lớn/dày đặc có độ phức tạp lũy thừa."
            }

        if hamilton_cycle:
            return {
                "is_hamilton": True,
                "completed": True,
                "cycle": hamilton_cycle,
                "message": f"CÓ CHU TRÌNH HAMILTON (Đã tìm thấy sau {state_count[0]} bước kiểm tra, {elapsed} ms)."
            }
        else:
            return {
                "is_hamilton": False,
                "completed": True,
                "cycle": None,
                "message": f"KHÔNG CÓ CHU TRÌNH HAMILTON (Đã vét cạn toàn bộ {state_count[0]} nhánh tìm kiếm từ đỉnh {start_node}, {elapsed} ms)."
            }

    # =========================================================================
    # PHẦN 3: VẼ ĐỒ THỊ BẰNG NETWORKX & MATPLOTLIB
    # =========================================================================
    def visualize(self, highlight_cycle=None, title="Đồ thị"):
        """
        Vẽ đồ thị với Matplotlib và NetworkX.
        Nếu truyền highlight_cycle, các cạnh và đỉnh trong chu trình sẽ được tô màu nổi bật.
        """
        if len(self.vertices) == 0:
            print("Đồ thị rỗng, không có dữ liệu để vẽ.")
            return

        G = nx.Graph()
        for v in self.vertices:
            G.add_node(v)
        for u, v in self.edges:
            G.add_edge(u, v)

        plt.figure(figsize=(8, 6))
        pos = nx.spring_layout(G, seed=42)

        # Vẽ cạnh nền
        nx.draw_networkx_edges(G, pos, edge_color="#cbd5e1", width=2.0)
        nx.draw_networkx_nodes(G, pos, node_color="#e0e7ff", node_size=800, edgecolors="#4338ca", linewidths=2.0)
        nx.draw_networkx_labels(G, pos, font_size=12, font_family="sans-serif", font_weight="bold")

        # Tô màu chu trình nếu có
        if highlight_cycle and len(highlight_cycle) > 1:
            cycle_edges = []
            for i in range(len(highlight_cycle) - 1):
                u = highlight_cycle[i]
                v = highlight_cycle[i + 1]
                cycle_edges.append((u, v))

            nx.draw_networkx_edges(G, pos, edgelist=cycle_edges, edge_color="#10b981", width=3.5)
            nx.draw_networkx_nodes(G, pos, nodelist=list(set(highlight_cycle)), node_color="#34d399", node_size=850, edgecolors="#065f46", linewidths=2.5)

        plt.title(title, fontsize=14, fontweight="bold", pad=15)
        plt.axis("off")
        plt.tight_layout()
        plt.show()


# =============================================================================
# HÀM XỬ LÝ NHẬP LIỆU TỪ CHUỖI CẠNH (VD: AB, BC, CD, DA)
# =============================================================================
def parse_edge_list_string(edge_string, graph):
    """
    Phân tích chuỗi cạnh người dùng nhập vào.
    Hỗ trợ dạng: 'AB, BC, CD' hoặc 'A-B, B-C' hoặc '1-2, 2-3'
    """
    tokens = [t.strip() for t in edge_string.replace(';', ',').split(',') if t.strip()]
    added_count = 0
    errors = []

    for token in tokens:
        if '-' in token:
            parts = [p.strip() for p in token.split('-') if p.strip()]
            if len(parts) == 2:
                u, v = parts[0], parts[1]
                if graph.add_edge(u, v):
                    added_count += 1
            else:
                errors.append(f"Không nhận diện được cạnh: '{token}'")
        elif len(token) == 2:
            u, v = token[0], token[1]
            if graph.add_edge(u, v):
                added_count += 1
        else:
            errors.append(f"Định dạng không hợp lệ: '{token}' (Gợi ý: dùng dạng 'AB' hoặc 'A-B')")

    return added_count, errors


# =============================================================================
# BỘ DỮ LIỆU KIỂM THỬ CHUẨN (8 TRƯỜNG HỢP THEO ĐỀ BÀI)
# =============================================================================
def load_preset_test_case(case_num, graph):
    graph.clear()
    if case_num == 1:
        # 1. Chu trình C4 (Có cả Euler và Hamilton)
        edges = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "A")]
        for u, v in edges: graph.add_edge(u, v)
        desc = "Trường hợp 1: Chu trình C4 (Có cả Euler và Hamilton)"

    elif case_num == 2:
        # 2. Hình vuông có 1 đường chéo (Có Hamilton, không Euler)
        edges = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A", "C")]
        for u, v in edges: graph.add_edge(u, v)
        desc = "Trường hợp 2: Hình vuông có 1 đường chéo (Có Hamilton, không Euler)"

    elif case_num == 3:
        # 3. Đồ thị liên thông có đúng 2 đỉnh bậc lẻ (Có đường đi Euler, không chu trình)
        edges = [("A", "B"), ("B", "C"), ("C", "A"), ("D", "A")]
        for u, v in edges: graph.add_edge(u, v)
        desc = "Trường hợp 3: Có đúng 2 đỉnh bậc lẻ (Đường đi Euler)"

    elif case_num == 4:
        # 4. Đồ thị không liên thông (2 tam giác rời)
        edges = [("A", "B"), ("B", "C"), ("C", "A"), ("D", "E"), ("E", "F"), ("F", "D")]
        for u, v in edges: graph.add_edge(u, v)
        desc = "Trường hợp 4: Đồ thị không liên thông"

    elif case_num == 5:
        # 5. Đồ thị có đỉnh cô lập
        edges = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "A")]
        for u, v in edges: graph.add_edge(u, v)
        graph.add_vertex("E") # Đỉnh cô lập
        desc = "Trường hợp 5: Đồ thị có đỉnh cô lập E"

    elif case_num == 6:
        # 6. Đồ thị không có Hamilton (Hình nơ / 2 chu trình chung đỉnh C)
        edges = [("A", "B"), ("B", "C"), ("C", "A"), ("C", "D"), ("D", "E"), ("E", "C")]
        for u, v in edges: graph.add_edge(u, v)
        desc = "Trường hợp 6: Đồ thị hình nơ (Không có Hamilton do C là khớp)"

    elif case_num == 7:
        # 7. Đồ thị cực tiểu (2 đỉnh 1 cạnh)
        graph.add_edge("A", "B")
        desc = "Trường hợp 7: Đồ thị cực tiểu (2 đỉnh 1 cạnh)"

    else:
        # 8. Đồ thị hình ngôi nhà Konigsberg
        edges = [("E", "A"), ("E", "B"), ("A", "B"), ("B", "C"), ("C", "D"), ("D", "A"), ("A", "C"), ("B", "D")]
        for u, v in edges: graph.add_edge(u, v)
        desc = "Trường hợp 8: Đồ thị hình phong bì / ngôi nhà (Euler & Hamilton)"

    return desc


# =============================================================================
# CHƯƠNG TRÌNH CHÍNH (MENU GIAO DIỆN CONSOLE)
# =============================================================================
def main():
    graph = Graph()
    # Khởi tạo mặc định với đồ thị C4
    load_preset_test_case(1, graph)

    while True:
        print("\n" + "=" * 60)
        print(" CHƯƠNG TRÌNH NHẬN BIẾT ĐỒ THỊ EULER & HAMILTON (PYTHON)")
        print("=" * 60)
        print(f"[*] Số đỉnh: {len(graph.vertices)} | Số cạnh: {len(graph.edges)}")
        print(f"[*] Danh sách đỉnh: {sorted(list(graph.vertices))}")
        print(f"[*] Bảng bậc đỉnh: {graph.get_degrees()}")
        print("-" * 60)
        print("1. Kiểm tra tính chất Euler (Chu trình / Đường đi Hierholzer)")
        print("2. Kiểm tra chu trình Hamilton (Thuật toán Quay lui Backtracking)")
        print("3. Kiểm tra CẢ HAI (Euler & Hamilton)")
        print("4. Nhập đồ thị mới bằng danh sách cạnh (VD: AB, BC, CD, DA)")
        print("5. Thêm đỉnh / Xóa đỉnh")
        print("6. Thêm cạnh / Xóa cạnh")
        print("7. Chọn bộ kiểm thử mẫu (Test cases 1 - 8)")
        print("8. Vẽ đồ thị trực quan (Matplotlib)")
        print("9. Xóa toàn bộ đồ thị")
        print("0. Thoát")
        print("-" * 60)

        choice = input("Vui lòng chọn chức năng (0-9): ").strip()

        if choice == "1":
            res = graph.check_euler()
            print("\n--- KẾT QUẢ KIỂM TRA EULER ---")
            print(f"[!] Kết luận: {res['message']}")
            if res['cycle_or_trail']:
                print(f"[✓] Thứ tự duyệt: {' -> '.join(res['cycle_or_trail'])}")
            if input("Bạn có muốn vẽ đồ thị và tô màu đường đi Euler? (y/n): ").lower() == 'y':
                graph.visualize(highlight_cycle=res['cycle_or_trail'], title="Kết quả Euler: " + res['message'])

        elif choice == "2":
            res = graph.check_hamilton()
            print("\n--- KẾT QUẢ KIỂM TRA HAMILTON ---")
            print(f"[!] Kết luận: {res['message']}")
            if res['cycle']:
                print(f"[✓] Chu trình Hamilton: {' -> '.join(res['cycle'])}")
            if input("Bạn có muốn vẽ đồ thị và tô màu chu trình Hamilton? (y/n): ").lower() == 'y':
                graph.visualize(highlight_cycle=res['cycle'], title="Kết quả Hamilton: " + res['message'])

        elif choice == "3":
            res_e = graph.check_euler()
            res_h = graph.check_hamilton()
            print("\n" + "=" * 50)
            print("--- BÁO CÁO TOÀN DIỆN EULER & HAMILTON ---")
            print(f"[EULER]    : {res_e['message']}")
            if res_e['cycle_or_trail']:
                print(f"            Chuỗi duyệt: {' -> '.join(res_e['cycle_or_trail'])}")
            print(f"[HAMILTON] : {res_h['message']}")
            if res_h['cycle']:
                print(f"            Chu trình  : {' -> '.join(res_h['cycle'])}")
            print("=" * 50)

        elif choice == "4":
            print("\nNhập danh sách cạnh phân cách bằng dấu phẩy.")
            print("Ví dụ: AB, BC, CD, DA hoặc 1-2, 2-3, 3-4, 4-1")
            raw = input("Nhập danh sách cạnh: ").strip()
            if raw:
                graph.clear()
                added, errs = parse_edge_list_string(raw, graph)
                print(f"[+] Đã thêm thành công {added} cạnh mới.")
                if errs:
                    for err in errs: print(f"[-] {err}")

        elif choice == "5":
            sub = input("Chọn (1) Thêm đỉnh, (2) Xóa đỉnh: ").strip()
            if sub == "1":
                v = input("Nhập nhãn đỉnh muốn thêm: ").strip()
                if v: graph.add_vertex(v); print(f"[+] Đã thêm đỉnh {v}")
            elif sub == "2":
                v = input("Nhập nhãn đỉnh muốn xóa: ").strip()
                graph.remove_vertex(v)
                print(f"[-] Đã xóa đỉnh {v} cùng các cạnh liên thuộc.")

        elif choice == "6":
            sub = input("Chọn (1) Thêm cạnh, (2) Xóa cạnh: ").strip()
            if sub == "1":
                u = input("Đỉnh đầu: ").strip()
                v = input("Đỉnh cuối: ").strip()
                if graph.add_edge(u, v): print(f"[+] Đã nối cạnh ({u} - {v})")
            elif sub == "2":
                u = input("Đỉnh đầu: ").strip()
                v = input("Đỉnh cuối: ").strip()
                graph.remove_edge(u, v)
                print(f"[-] Đã xóa cạnh ({u} - {v})")

        elif choice == "7":
            print("\n--- DANH SÁCH BÀI KIỂM THỬ MẪU (TEST CASES) ---")
            print("1. Chu trình C4 (Cả Euler & Hamilton)")
            print("2. Hình vuông có 1 đường chéo (Có Hamilton, không Euler)")
            print("3. Có đúng 2 đỉnh bậc lẻ (Đường đi Euler)")
            print("4. Đồ thị không liên thông (2 tam giác rời)")
            print("5. Đồ thị có đỉnh cô lập")
            print("6. Đồ thị không Hamilton (Hình nơ / điểm khớp)")
            print("7. Đồ thị cực tiểu (2 đỉnh 1 cạnh)")
            print("8. Đồ thị ngôi nhà Konigsberg (Euler & Hamilton)")
            tc = input("Nhập số bài kiểm thử (1-8): ").strip()
            if tc.isdigit() and 1 <= int(tc) <= 8:
                desc = load_preset_test_case(int(tc), graph)
                print(f"[✓] Đã tải thành công: {desc}")
            else:
                print("[-] Lựa chọn không hợp lệ.")

        elif choice == "8":
            graph.visualize(title="Trực quan hóa đồ thị hiện tại")

        elif choice == "9":
            graph.clear()
            print("[✓] Đã xóa toàn bộ đồ thị.")

        elif choice == "0":
            print("Cảm ơn bạn đã sử dụng chương trình!")
            sys.exit(0)


if __name__ == "__main__":
    main()
