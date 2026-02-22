import { Link } from "react-router-dom";
import bgVideo from "../../assets/藍寶堅尼賽道競速影片.mp4";
import { useState } from "react";

const Home = () => {
  const [isMuted, setIsMuted] = useState(true);
  return (
    <div className="position-relative overflow-hidden min-vh-100">
      {/* 影片 */}
      <div className="video-bg-container">
        <video 
          className="video-bg" 
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline
          src={bgVideo}
        />
        <div className="cinematic-overlay"></div>
      </div>

      <div className="container position-relative z-1">
        <div className="row min-vh-100 align-items-center py-5">
          <div className="col-lg-7">
            <div className="text-start">
              <div className="badge bg-white bg-opacity-10 text-danger cursor-pointer border border-white border-opacity-10 py-2 px-3 mb-4 rounded-pill" onClick={() => setIsMuted(!isMuted)}>
                  <div className="loader-1">
                    <div className="circle">
                      <div className="dot"></div>
                      <div className="outline"></div>
                  </div>
                  LIVE FROM THE TRACK
                </div> 
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row">
              <h1 className="display-1 fw-black fw-bold text-gradient rainbow-glow-text mb-4" style={{ filter: 'drop-shadow(0 0 30px rgba(0,242,255,0.3))' }}>極速</h1>
              <h1 className="display-1 fw-black fw-bold text-gradient rainbow-glow-text mb-4" style={{ filter: 'drop-shadow(0 0 30px rgba(0,242,255,0.3))' }}>領域</h1>
            </div>
            <p className="fs-4 text-secondary mb-5 lh-base">
              體驗頂級工藝的原始力量，從賽道到展間，見證汽車性能的極致巔峰。
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-4">
              <Link to="/product" className="btn btn-aurora btn-lg px-5 py-3 shadow-lg">
                探索車款
              </Link>
              <Link to="/login" className="btn btn-aurora-outline btn-lg px-5 py-3">
                貴賓專區
              </Link>
            </div>
          </div>
          
          <div className="col-lg-5 mt-5 mt-lg-0">
            <div className="glass-card p-4 velocity-card">
              <div className="row g-4 text-center">
                <div className="col-6 border-end border-white border-opacity-10">
                  <h3 className="text-gradient mb-1">217</h3>
                  <p className="small text-secondary fw-bold mb-0">MPH TOP SPEED</p>
                </div>
                <div className="col-6">
                  <h3 className="text-gradient mb-1">2.3</h3>
                  <p className="small text-secondary fw-bold mb-0">0-62 MPH (S)</p>
                </div>
                <div className="col-6 border-end border-white border-opacity-10">
                  <h3 className="text-gradient mb-1">V12</h3>
                  <p className="small text-secondary fw-bold mb-0">HYBRID ENGINE</p>
                </div>
                <div className="col-6">
                  <h3 className="text-gradient mb-1">1001</h3>
                  <p className="small text-secondary fw-bold mb-0">BHP POWER</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 特別推薦 */}
        <div className="row py-5 mt-5 align-items-center">
          <div className="col-12">
            <h2 className="display-2 fw-bold text-gradient text-center mb-4">限量推薦</h2>
          </div>
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="hero-image-frame p-2">
              <img 
                src="Gemini_Generated_Image_gtm6clgtm6clgtm6.png" 
                alt="Aura Model" 
                className="rounded-4 hover-scale-110"
              />
            </div>
          </div>
          <div className="col-lg-6 ps-lg-5">
            <h2 className="display-6 fw-bold fw-black text-gradient mb-4">星雲計畫</h2>
            <p className="text-secondary fs-5 mb-4">
              旗艦級鉅作，以計算流體力學精算打造，劃破氣流，達到近乎零阻力的完美境界。
            </p>
            <div className="glass-card mb-4 border-0 bg-opacity-10">
              <p className="mb-0 italic text-white opacity-75 small font-monospace">
                「這不是在開車，這是在扭曲時空。」——《AURA 評測》
              </p>
            </div>
            <Link to="/product/-OiXuTpaGAVTSY6Mezcc" className="text-aurora fw-bold text-decoration-none hover-glow">
              查看技術規格 →
            </Link>
          </div>
        </div>

        {/* Features Row */}
        <div className="row mt-5 g-4 py-5">
          <div className="col-lg-4">
            <div className="glass-card text-center h-100">
              <div className="mb-4 text-aurora fs-1">✧</div>
              <h4 className="fw-bold mb-3">EXCLUSIVITY</h4>
              <p className="text-secondary small">全球限量打造，讓您永遠保持工程領域的稀有典藏地位。</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="glass-card text-center h-100">
              <div className="mb-4 text-aurora fs-1">◈</div>
              <h4 className="fw-bold mb-3">INNOVATION</h4>
              <p className="text-secondary small">尖端空氣動力學與永續動力系統，不斷突破技術極限。</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="glass-card text-center h-100">
              <div className="mb-4 text-aurora fs-1">❖</div>
              <h4 className="fw-bold mb-3">CRAFTSMANSHIP</h4>
              <p className="text-secondary small">由世界各地頂級工匠手工打造，每一處細節都彰顯不凡工藝。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
