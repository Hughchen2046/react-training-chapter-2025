function App() {
    const products = [
        {
            category: "甜甜圈",
            content: "尺寸：14x14cm",
            description: "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
            id: "-L9tH8jxVb2Ka_DYPwng",
            is_enabled: 1,
            origin_price: 150,
            price: 99,
            title: "草莓莓果夾心圈",
            price_unit: "元",
            unit: "個",
            num: 10,
            imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8",
            imagesUrl: [
                "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a",
                "https://images.unsplash.com/photo-1559656914-a30970c1affd"
            ]
        },
        {
            category: "蛋糕",
            content: "尺寸：6寸",
            description: "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
            id: "-McJ-VvcwfN1_Ye_NtVA",
            is_enabled: 1,
            origin_price: 1000,
            price: 900,
            title: "蜂蜜檸檬蛋糕",
            price_unit: "元",
            unit: "個",
            num: 1,
            imageUrl: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
            imagesUrl: [
                "https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80"
            ]
        },
        {
            category: "蛋糕",
            content: "尺寸：6寸",
            description: "法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。",
            id: "-McJ-VyqaFlLzUMmpPpm",
            is_enabled: 1,
            origin_price: 700,
            price: 600,
            title: "暗黑千層",
            price_unit: "元",
            unit: "個",
            num: 15,
            imageUrl: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
            imagesUrl: [
                "https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
                "https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"
            ]
        }
    ];
    const [product, setProduct] = React.useState(products);
    const [detail, setDetail] = React.useState();
    console.log(product);

    return (<div className="container">
        <div className="row">
            <div className="col-4">
                <h2>產品列表</h2>
                <table className="table table-hover table-striped table-warning table-borderless  ">
                    <thead>
                        <tr>
                            <th>產品名稱</th>
                            <th>原價</th>
                            <th>售價</th>
                            <th>是否啟用</th>
                            <th>查看細節</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {product.map(item => {
                            return (<tr key={item.id}>
                                <th>{item.title}</th>
                                <th>{item.origin_price}</th>
                                <th>{item.price}</th>
                                <th>{item.is_enabled ? "啟用中" : "開發中"}</th>
                                <th>
                                    <button type="button" className="btn btn-primary" onClick={() => setDetail(item)}>查看細節</button>
                                </th>
                            </tr>)
                        })}

                    </tbody>
                </table>
            </div>
            <div className="col-8">
                {detail ? (<><h2>單一產品細節</h2>
                    <div className="card border-warning align-items-center p-3">
                        <img src={detail.imageUrl}
                            className="card-img-top object-fit-cover primary-image" alt={`${detail.title}主圖`} />
                        <div className="card-body border-top border-warning mt-3">
                            <h5 className="card-title ">{detail.title}<span className="badge bg-warning ms-2">{detail.category}</span></h5>
                            <p className="card-text">商品描述：{detail.description}</p>
                            <p className="card-text">商品內容：{detail.content}</p>
                            <div className="d-flex gap-5 align-items-bottom card-text">
                                <p className="">原價： <del>{detail.origin_price}{detail.price_unit}</del></p>
                                <p className="h5 fw-bold text-danger">售價：{detail.price}{detail.price_unit}</p>
                            </div>
                            <div className="d-flex gap-5 align-items-bottom card-text">
                                <h4>剩餘數量：</h4>
                                <h4> <span className="badge text-bg-danger me-5">{detail.num}</span>{detail.unit}</h4>
                            </div>
                            <div className="row">
                                <h5>更多圖片：</h5>
                                {detail.imagesUrl.map((item, index) => {
                                    return (<img className="object-fit-cover col-4 secondary-image"
                                        src={item} key={index} alt={`${detail.title}副圖${index}`} />)
                                })}
                            </div>
                        </div>
                    </div></>) : (<h2>請選擇產品來查看細節</h2>)}

            </div>
        </div>
    </div>)
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);