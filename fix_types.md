trong phần movie, bỏ producer, bỏ genres, phần rating chỉnh lại cho tự tính chứ không lấy từ database
cinema bỏ các phần city: string;           // ❌ KHÔNG CÓ trong DB
  numberOfRooms: number;  // ❌ KHÔNG CÓ trong DB
  description: string;    // ❌ KHÔNG CÓ trong DB
  imageUrl: string;       // ❌ KHÔNG CÓ trong DB
  facilities: string[];   // ❌ KHÔNG CÓ trong DB
  phone: string;          // ❌ KHÔNG CÓ trong DB
phần showtime, bỏ ticket price, bỏ status, phần cinemaId hãy tìm cách xử lý cho phù hợp với qua room_id
phần movie review: xử lý phần reviewId cho phù hợp với coposite key, bỏ title, bỏ tag, bỏ likeCount
phần food: bỏ category, bỏ image
đồng thời cần sửa các phần UI liên quan đến các phần này
tôi cần chia thành các giai đoạn
giải đoạn 1: đổi tên các phần hiện tại của mock data cho giống tên các biến của type trong service, chỉnh sửa các phần liên quan
giải đoạn 2: xóa các trường hoặc điều chỉnh như trên và chỉnh sửa các UI liên quan lại
hoặc có thể đề xuất kế hoạch chia nhỏ hơn để cải thiện từ từ
