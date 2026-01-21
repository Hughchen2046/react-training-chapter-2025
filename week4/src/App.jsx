import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./component/Login";
import Navbar from "./component/Navbar";
import "./assets/style.css";

const apiPath = import.meta.env.VITE_API_PATH;
const baseUrl = import.meta.env.VITE_BASE_URL;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [detailProduct, setDetailProduct] = useState(null);

  const dataFormat = {
    title: "",
    category: "",
    origin_price: 100,
    price: 100,
    unit: "",
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
    imagesUrl: [],
    starRating: 5,
  };
  const [modalProduct, setModalProduct] = useState(dataFormat);

  // 取得產品資料
  const getData = async (page = 1) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/${apiPath}/admin/products?page=${page}&limit=9`,
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (product, mode) => {
    setModalMode(mode);
    setModalProduct(
      product ? { ...product, imagesUrl: product.imagesUrl || [] } : dataFormat,
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setModalProduct((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalProduct.imagesUrl];
    newImages[index] = value;
    setModalProduct((prev) => ({ ...prev, imagesUrl: newImages }));
  };

  const addImage = () => {
    setModalProduct((prev) => ({
      ...prev,
      imagesUrl: [...(prev.imagesUrl || []), ""],
    }));
  };

  const removeImage = () => {
    setModalProduct((prev) => {
      const restImages = [...(prev.imagesUrl || [])];
      restImages.pop();
      return { ...prev, imagesUrl: restImages };
    });
  };

  const updateProduct = async () => {
    let api = `${baseUrl}/api/${apiPath}/admin/product`;
    let method = "post";

    if (modalMode === "edit") {
      api = `${baseUrl}/api/${apiPath}/admin/product/${modalProduct.id}`;
      method = "put";
    }

    const payload = {
      data: {
        ...modalProduct,
        origin_price: Number(modalProduct.origin_price),
        price: Number(modalProduct.price),
        starRating: Number(modalProduct.starRating || 5),
      },
    };

    try {
      const res = await axios[method](api, payload);
      alert(res.data.message);
      closeModal();
      getData(pageInfo.current_page);
    } catch (error) {
      alert("失敗: " + (error.response?.data?.message || "網路錯誤"));
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(
        `${baseUrl}/api/${apiPath}/admin/product/${id}`,
      );
      alert(res.data.message);
      closeModal();
      getData(pageInfo.current_page);
    } catch (error) {
      alert("刪除失敗: " + (error.response?.data?.message || "網路錯誤"));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const res = await axios.post(
        `${baseUrl}/api/${apiPath}/admin/upload`,
        formData,
      );
      const imageUrl = res.data.imageUrl;
      setModalProduct((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
      alert("上傳成功");
    } catch (error) {
      alert("上傳失敗: " + (error.response?.data?.message || "網路錯誤"));
    }
  };

  // 檢查登入狀態
  const checkLogin = async () => {
    try {
      await axios.post(`${baseUrl}/api/user/check`);
      setIsAuth(true);
      getData();
    } catch (error) {
      console.error(error);
      setIsAuth(false);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      checkLogin();
    }
  }, []);

  const handleLogout = () => {
    document.cookie =
      "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete axios.defaults.headers.common["Authorization"];
    setIsAuth(false);
    alert("已登出");
  };

  return (
    <div className="App">
      {isAuth ? (
        <Navbar
          products={products}
          pageInfo={pageInfo}
          getData={getData}
          onLogout={handleLogout}
          onOpenModal={openModal}
          onDetail={setDetailProduct}
          detailProduct={detailProduct}
          modalMode={modalMode}
          isModalOpen={isModalOpen}
          modalProduct={modalProduct}
          onCloseModal={closeModal}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          onAddImage={addImage}
          onRemoveImage={removeImage}
          onFileUpload={handleFileUpload}
        />
      ) : (
        <Login setIsAuth={setIsAuth} getData={getData} />
      )}
    </div>
  );
}

export default App;
