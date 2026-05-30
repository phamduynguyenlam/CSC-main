import dotenv from 'dotenv';
import { pipeline } from '@xenova/transformers';
import { ChromaClient } from 'chromadb';

dotenv.config();

const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
const CHROMA_COLLECTION = process.env.CHROMA_COLLECTION || 'sentimind_call_memory';
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';

const COMPANY_NAME = 'Công ty Thương mại Sao Bắc';

const companyDocs = [
  {
    id: 'seed_company_overview_01',
    title: 'Tổng quan công ty và triết lý hỗ trợ',
    document: `${COMPANY_NAME} vận hành nhiều mảng kinh doanh gồm bán lẻ, bảo hành, thuê bao và hỗ trợ khách hàng doanh nghiệp. Đội ngũ chăm sóc khách hàng ưu tiên phản hồi nhanh, giao tiếp đồng cảm và xác định rõ người chịu trách nhiệm xử lý. Chính sách của công ty là cố gắng giải quyết ngay ở lần liên hệ đầu tiên, và chỉ chuyển cấp khi cần đổi hàng, hoàn tiền hoặc rà soát kỹ thuật.`,
    metadata: { source: 'seed_company', category: 'overview', topic: 'triet_ly_ho_tro' },
  },
  {
    id: 'seed_company_overview_02',
    title: 'Nguyên tắc vận hành',
    document: `${COMPANY_NAME} yêu cầu nhân viên xác minh danh tính, tóm tắt vấn đề của khách hàng trong một câu, xác nhận kết quả mong muốn và ghi lại đầy đủ mọi cam kết trong CRM. Ba yếu tố quan trọng nhất là tốc độ, độ chính xác và thái độ điềm tĩnh ngay cả khi khách hàng đang bức xúc.`,
    metadata: { source: 'seed_company', category: 'overview', topic: 'nguyen_tac_van_hanh' },
  },
  {
    id: 'seed_company_overview_03',
    title: 'Chính sách chuyển cấp',
    document: `Bắt buộc chuyển cấp khi có tranh chấp thanh toán, nghi ngờ gian lận, nghi bị chiếm đoạt tài khoản, lỗi giao hàng lặp lại, hoặc sự cố kỹ thuật ảnh hưởng đến hơn 20 khách hàng. Nhân viên hỗ trợ phải đính kèm log, ghi lại 3 tương tác gần nhất liên quan và đặt SLA theo dõi trước khi bàn giao cho nhóm chuyên trách.`,
    metadata: { source: 'seed_company', category: 'policy', topic: 'chinh_sach_chuyen_cap' },
  },
  {
    id: 'seed_company_overview_04',
    title: 'Cam kết với khách hàng',
    document: `Cam kết của công ty rất đơn giản: xác nhận vấn đề nhanh, đưa ra mốc thời gian thực tế và không hứa quá mức. Khi yêu cầu đổi hàng được duyệt, khách hàng sẽ nhận email xác nhận trong vòng 15 phút và có cập nhật mã theo dõi ngay khi đơn hàng mới được tạo.`,
    metadata: { source: 'seed_company', category: 'policy', topic: 'cam_ket_khach_hang' },
  },
  {
    id: 'seed_company_overview_05',
    title: 'Các nhóm nội bộ chính',
    document: `${COMPANY_NAME} có 5 nhóm nội bộ chính: chăm sóc khách hàng, hoàn tất đơn hàng, vận hành tài chính, kỹ thuật sản phẩm và đảm bảo chất lượng. Chăm sóc khách hàng phụ trách case với khách, hoàn tất đơn hàng phụ trách giao nhận, tài chính xử lý hoàn tiền, kỹ thuật xử lý lỗi phần mềm, và QA theo dõi các lỗi sản phẩm lặp lại.`,
    metadata: { source: 'seed_company', category: 'overview', topic: 'nhom_noi_bo' },
  },
];

const productDocs = [
  ['Tai nghe không dây Nimbus One', 'Tai nghe cao cấp có chống ồn chủ động, pin 18 giờ và sạc USB-C. Các lỗi thường gặp gồm ghép nối khó khăn, tụt pin sau cập nhật firmware và méo âm ở tai trái.'],
  ['Dock Orbit Pro', 'Đế kết nối desktop có 2 cổng HDMI, cấp nguồn 90W và passthrough Ethernet. Hỗ trợ thường xử lý lỗi nhận màn hình, tương thích cáp và cập nhật firmware.'],
  ['Vòng tay PulseFit', 'Thiết bị theo dõi sức khỏe có cảnh báo nhịp tim, chấm điểm giấc ngủ, vỏ chống nước và ứng dụng di động đi kèm. Câu hỏi phổ biến là đồng bộ chậm, đếm bước sai và thay dây đeo.'],
  ['Loa thông minh Luma Mini', 'Loa thông minh nhỏ gọn hỗ trợ trợ lý giọng nói, Bluetooth 5.3 và hiệu chỉnh theo phòng. Vấn đề thường liên quan đến cài Wi-Fi, độ nhạy từ khóa đánh thức và tiếng rè.'],
  ['Bàn phím Atlas', 'Bàn phím cơ có switch hot-swap, đèn RGB và lớp phím lập trình được. Khách hàng thường hỏi về hiện tượng gõ lặp, đổi profile phím và tương thích keycap.'],
  ['Chuột Vector', 'Chuột công thái học có DPI điều chỉnh, click im lặng và bộ nhớ trong. Case hỗ trợ thường gồm bánh xe cuộn lỗi, trễ con trỏ và ghép nối đầu thu.'],
  ['Webcam Prism', 'Webcam 1080p có màn che riêng tư và bù sáng yếu. Các chủ đề hỗ trợ phổ biến là cài driver, hình ảnh nhấp nháy và chỉnh độ nhạy micro.'],
  ['Đèn bàn Everlight', 'Đèn bàn thông minh có chế độ dim, cổng sạc USB và hẹn giờ qua ứng dụng. Case thường xoay quanh ghép nối app, reset độ sáng và cấu hình timer.'],
  ['Máy lọc khí Cinder', 'Máy lọc khí HEPA 2 tầng có nhắc thay lọc, chế độ yên tĩnh và đèn báo chất lượng không khí. Sự cố hay gặp là quạt kêu to và báo tuổi thọ lọc sai.'],
  ['Miếng sạc Halo', 'Đế sạc không dây cho điện thoại và tai nghe. Hỗ trợ thường gặp các câu hỏi về sạc chậm, độ dày ốp lưng và lỗi canh vị trí.'],
];

const policyDocs = [
  ['Chính sách hoàn tiền', 'Hoàn tiền áp dụng trong vòng 30 ngày kể từ khi giao hàng nếu sản phẩm chưa mở hộp hoặc nếu lỗi được xác minh trong thời hạn bảo hành. Với hàng hư hỏng trong quá trình vận chuyển, cần ảnh chụp và mã đơn hàng.'],
  ['Chính sách đổi hàng', 'Hàng đổi chỉ được gửi sau khi nhân viên xác nhận lỗi và kho xác minh còn tồn kho. Nếu hết hàng, case sẽ chuyển sang hoàn tiền hoặc đặt chờ theo xác nhận của khách.'],
  ['Chính sách bảo hành', 'Bảo hành phần cứng tiêu chuẩn là 12 tháng. Bảo hành mở rộng cộng thêm 12 tháng và chỉ áp dụng lỗi sản xuất, không áp dụng cho rơi vỡ, vào nước hoặc sửa đổi trái phép.'],
  ['Chính sách giao hàng', 'Đơn đặt trước 15:00 thường được giao trong cùng ngày làm việc. Trễ do thời tiết, hải quan hoặc hãng vận chuyển phải được thông báo chủ động kèm ETA mới.'],
  ['Chính sách quyền riêng tư', 'Dữ liệu khách hàng chỉ được dùng để xử lý case hiện tại, cải thiện chất lượng dịch vụ hoặc đáp ứng yêu cầu pháp lý. Nhân viên tuyệt đối không chép số thẻ, giấy tờ tùy thân hay thông tin thanh toán đầy đủ vào ghi chú.'],
  ['Chính sách xử lý khiếu nại', 'Khi khách hàng khiếu nại, nhân viên phải xác nhận vấn đề, diễn đạt lại khiếu nại một cách khách quan và đưa ra bước tiếp theo ngay trong cùng tương tác.'],
  ['Chính sách khách hàng thân thiết', 'Khách hạng Gold được ưu tiên gọi lại, duyệt đổi hàng nhanh hơn với lỗi đã xác minh và có 1 lượt giao nhanh miễn phí mỗi quý.'],
  ['Chính sách trả hàng', 'Hàng trả thiếu phụ kiện gốc có thể bị hoàn một phần. Bản quyền phần mềm, thiết bị cấu hình riêng và vật tư tiêu hao thường không được trả nếu không có lỗi.'],
  ['Chính sách đảm bảo liên tục dịch vụ', 'Nếu sự cố ảnh hưởng đến khách doanh nghiệp, hỗ trợ phải tạo bridge case, báo cho quản lý tài khoản và cập nhật trạng thái mỗi 30 phút cho đến khi khôi phục.'],
  ['Chính sách giao tiếp', 'Nhân viên nên tránh thuật ngữ kỹ thuật trừ khi khách yêu cầu. Mọi cam kết phải cụ thể, có mốc thời gian và được ghi vào case note.'],
];

const technicalDocs = [
  ['Quy trình cập nhật firmware', 'Firmware được gửi qua ứng dụng đi kèm thiết bị. Quy trình cập nhật kiểm tra mức pin, tải gói cập nhật, xác minh checksum và khởi động lại thiết bị. Nếu cập nhật lỗi, hỗ trợ cần hỏi mã lỗi, phiên bản app và số serial thiết bị.'],
  ['Kiến trúc xác thực', 'Ứng dụng khách hàng dùng đăng nhập bằng token với refresh token lưu trong phiên server được mã hóa. Hỗ trợ tuyệt đối không hỏi mật khẩu. Nếu người dùng báo lỗi đăng nhập, cần hỏi xem lỗi bắt đầu sau khi đổi mật khẩu hay đổi thiết bị.'],
  ['Thiết kế dịch vụ đồng bộ', 'Dịch vụ đồng bộ dùng hàng đợi sự kiện để chuyển telemetry từ thiết bị lên cloud mỗi 60 giây. Đồng bộ chậm thường là do mất mạng, token hết hạn hoặc tiến trình nền bị tạm dừng.'],
  ['Xử lý sự cố app di động', 'Khi app bị crash, cần ghi lại model máy, phiên bản OS, phiên bản app và crash xảy ra lúc mở app hay sau một thao tác cụ thể. Nguyên nhân thường gặp là cache cục bộ cũ hoặc quyền thiết bị không tương thích.'],
  ['Chẩn đoán âm thanh', 'Nếu tai nghe bị rớt âm, yêu cầu khách thử trên thiết bị khác, ngắt kết nối Bluetooth và kiểm tra cập nhật firmware. Mất cân bằng âm trái-phải kéo dài có thể là lỗi phần cứng.'],
  ['Khắc phục sự cố mạng', 'Khi gặp lỗi kết nối, cần xác nhận SSID, băng tần 2.4 GHz hay 5 GHz, khoảng cách tới router và thiết bị có truy cập được các dịch vụ internet khác hay không.'],
  ['Ghi chú tích hợp thanh toán', 'Hệ thống thanh toán chạy bất đồng bộ. Hoàn tiền có thể mất tối đa 5 ngày làm việc sau khi duyệt vì cổng thanh toán và mạng thẻ quyết toán theo lịch riêng.'],
  ['Quy trình quét kho', 'Nhân viên kho quét nhãn trả hàng, kiểm tra phụ kiện đầy đủ rồi đánh dấu hàng có thể bán lại, cần tân trang hoặc loại bỏ. Ảnh lỗi được liên kết với đơn hàng.'],
  ['Sổ tay quan sát hệ thống', 'Bảng điều khiển nội bộ theo dõi độ trễ request, số job đồng bộ lỗi, số lần crash và thời gian xử lý hoàn tiền. Khi một chỉ số tăng đột biến, cần kiểm tra cửa sổ deploy gần nhất và trạng thái hãng vận chuyển.'],
  ['Checklist phát hành', 'Trước khi phát hành firmware, kỹ thuật phải chạy regression test, kiểm tra gói rollback, cập nhật macro hỗ trợ và phát hành thông báo lỗi đã biết.'],
];

function makeMockCall(index, productName, issue, resolution, tone, channel) {
  return {
    id: `seed_call_${String(index).padStart(4, '0')}`,
    title: `Cuộc gọi giả lập ${index} - ${issue}`,
    document: [
      `Tóm tắt cuộc gọi ${index}: Một khách hàng có thái độ ${tone} liên hệ qua kênh ${channel} về sản phẩm ${productName}.`,
      `Vấn đề: ${issue}.`,
      `Kết quả xử lý: ${resolution}.`,
      `Hướng dẫn cho nhân viên: xác nhận vấn đề, kiểm tra mã đơn hàng và chốt thời gian theo dõi rõ ràng nếu chưa thể đổi hàng ngay.`,
    ].join(' '),
    metadata: {
      source: 'seed_call',
      category: 'mock_call',
      product: productName,
      issue,
      resolution,
      tone,
      channel,
    },
  };
}

const mockCalls = [];
const callIssues = [
  ['hàng bị hư khi nhận', 'duyệt đổi hàng và gửi nhanh lại cho khách'],
  ['thiết bị không ghép đôi Bluetooth', 'hướng dẫn reset và xác nhận bản firmware mới'],
  ['đơn trễ nên hoàn tiền đang chờ', 'giải thích SLA hoàn tiền và chuyển finance xử lý'],
  ['sạc chỉ lên đến 80 phần trăm', 'đề nghị đổi cáp và hiệu chỉnh pin'],
  ['màn hình nhấp nháy sau cập nhật', 'thu thập log và chuyển kỹ thuật xử lý'],
  ['gói thuê bao bị gia hạn bất ngờ', 'kiểm tra thông báo gia hạn và cấp credit hỗ trợ'],
  ['thiếu phụ kiện trong hộp', 'tạo shipment đổi bù phụ kiện còn thiếu'],
  ['firmware cập nhật lỗi hai lần', 'gửi hướng dẫn khôi phục và đặt lịch gọi lại'],
  ['âm lượng quá thấp', 'chỉnh lại thiết lập âm thanh và đổi thiết bị lỗi'],
  ['ứng dụng tự đăng xuất', 'kiểm tra token refresh và xóa cache ứng dụng'],
];

const tones = ['bực bội', 'lịch sự', 'bối rối', 'khẩn cấp', 'bình tĩnh', 'thiếu kiên nhẫn'];
const channels = ['điện thoại', 'chat', 'email', 'gọi lại'];

for (let i = 0; i < 60; i += 1) {
  const product = productDocs[i % productDocs.length][0];
  const [issue, resolution] = callIssues[i % callIssues.length];
  mockCalls.push(
    makeMockCall(
      i + 1,
      product,
      issue,
      resolution,
      tones[i % tones.length],
      channels[i % channels.length]
    )
  );
}

function chunkText(text, chunkSize = 1200, overlap = 200) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  if (normalized.length <= chunkSize || chunkSize <= overlap) return [normalized];

  const chunks = [];
  let start = 0;
  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length);
    chunks.push(normalized.slice(start, end));
    start += chunkSize - overlap;
  }
  return chunks;
}

async function getEmbedder() {
  return pipeline('feature-extraction', EMBEDDING_MODEL);
}

async function embedTexts(texts) {
  const embedder = await getEmbedder();
  const vectors = [];

  for (const text of texts) {
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    vectors.push(Array.from(output.data));
  }

  return vectors;
}

function expandDocs(items) {
  const expanded = [];

  for (const item of items) {
    const chunks = chunkText(item.document);
    chunks.forEach((chunk, index) => {
      expanded.push({
        id: chunks.length === 1 ? item.id : `${item.id}:${index}`,
        document: chunk,
        metadata: {
          ...item.metadata,
          title: item.title,
          chunk_index: index,
        },
      });
    });
  }

  return expanded;
}

async function main() {
  const collectionName = CHROMA_COLLECTION;
  const client = new ChromaClient({ path: CHROMA_URL });
  const collection = await client.getOrCreateCollection({ name: collectionName });

  const allItems = [
    ...companyDocs,
    ...productDocs.map(([name, description], index) => ({
      id: `seed_product_${String(index + 1).padStart(2, '0')}`,
      title: name,
      document: `${name}: ${description}`,
      metadata: { source: 'seed_product', category: 'product', product: name },
    })),
    ...policyDocs.map(([title, body], index) => ({
      id: `seed_policy_${String(index + 1).padStart(2, '0')}`,
      title,
      document: `${title}: ${body}`,
      metadata: { source: 'seed_policy', category: 'policy', policy: title },
    })),
    ...technicalDocs.map(([title, body], index) => ({
      id: `seed_tech_${String(index + 1).padStart(2, '0')}`,
      title,
      document: `${title}: ${body}`,
      metadata: { source: 'seed_tech', category: 'technical_documentation', topic: title },
    })),
    ...mockCalls,
  ];

  const expandedDocs = expandDocs(allItems);
  const embeddings = await embedTexts(expandedDocs.map((item) => item.document));

  const createdAt = new Date().toISOString();
  const ids = expandedDocs.map((item) => item.id);
  const documents = expandedDocs.map((item) => item.document);
  const metadatas = expandedDocs.map((item) => ({
    ...item.metadata,
    created_at: createdAt,
  }));

  await collection.upsert({
    ids,
    documents,
    embeddings,
    metadatas,
  });

  console.log(JSON.stringify({
    collection: collectionName,
    url: CHROMA_URL,
    docsSeeded: expandedDocs.length,
    categories: {
      company: companyDocs.length,
      products: productDocs.length,
      policies: policyDocs.length,
      technical: technicalDocs.length,
      mockCalls: mockCalls.length,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error('Chroma seeding failed:', error);
  process.exit(1);
});
