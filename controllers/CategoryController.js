// Import mô hình Category từ thư mục models
const Category = require("../models/Category");

// Xuất một đối tượng chứa các phương thức xử lý các hoạt động liên quan đến category
module.exports = {
  // Hàm bất đồng bộ để tạo một category mới
  createCategory: async (req, res) => {
    // Tạo một thể hiện mới của Category sử dụng dữ liệu từ phần thân của yêu cầu
    const newCategory = new Category(req.body);
    try {
      // Thử lưu category mới vào cơ sở dữ liệu
      await newCategory.save();
      // Nếu thành công, gửi phản hồi với trạng thái 201 và thông báo thành công
      res
        .status(201)
        .json({ status: true, message: "Category created successfully" });
    } catch (error) {
      // Nếu có lỗi, gửi phản hồi với trạng thái 500 và thông báo lỗi
      res.status(500).json({ status: false, message: error.message });
    }
  },

  // Hàm bất đồng bộ để lấy tất cả các category ngoại trừ những category có tiêu đề "More"
  getAllCategories: async (req, res) => {
    try {
      // Tìm tất cả các category có tiêu đề không phải là "More" và loại bỏ trường __v
      const categories = await Category.find(
        { title: { $ne: "More" } },
        { __v: 0 }
      );
      // Nếu thành công, gửi phản hồi với trạng thái 200 và danh sách các category
      res.status(200).json(categories);
    } catch (error) {
      // Nếu có lỗi, gửi phản hồi với trạng thái 500 và thông báo lỗi
      res.status(500).json({ status: false, message: error.message });
    }
  },

  // Hàm bất đồng bộ để lấy ngẫu nhiên các category, đảm bảo rằng category "more" được bao gồm nếu nó tồn tại
  getRandomCategories: async (req, res) => {
    try {
      // Sử dụng aggregate để tìm các category có giá trị không phải là "more" và chọn ngẫu nhiên 4 category
      let categories = await Category.aggregate([
        { $match: { value: { $ne: "more" } } },
        { $sample: { size: 4 } },
      ]);

      // Tìm một category có giá trị là "more" và loại bỏ trường __v
      const moreCategory = await Category.findOne(
        { value: "more" },
        { __v: 0 }
      );

      // Nếu category "more" tồn tại, thêm nó vào danh sách các category
      if (moreCategory) {
        categories.push(moreCategory);
      }

      // Nếu thành công, gửi phản hồi với trạng thái 200 và danh sách các category
      res.status(200).json(categories);
    } catch (error) {
      // Nếu có lỗi, gửi phản hồi với trạng thái 500 và thông báo lỗi
      res.status(500).json({ status: false, message: error.message });
    }
  },
}; // Kết thúc phần xuất module
