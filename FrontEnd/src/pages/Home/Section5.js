import React from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
// import StoreIOS from "../../assets/shop/appstore.png"; // IMAGE MISSING
// import StoreGoogle from "../../assets/shop/googleplay.png"; // IMAGE MISSING
// import DownloadImage from "../../assets/shop/e-shop.png"; // IMAGE MISSING
// import Brand1 from "../../assets/brands/brand-11.png"; // IMAGE MISSING
// import Brand2 from "../../assets/brands/brand-12.png"; // IMAGE MISSING
// import Brand3 from "../../assets/brands/brand-13.png"; // IMAGE MISSING
// import Brand4 from "../../assets/brands/brand-14.png"; // IMAGE MISSING
// import Brand5 from "../../assets/brands/brand-15.png"; // IMAGE MISSING
// import Brand6 from "../../assets/brands/brand-16.png"; // IMAGE MISSING
// import Brand7 from "../../assets/brands/brand-17.png"; // IMAGE MISSING
// import Brand8 from "../../assets/brands/brand-18.png"; // IMAGE MISSING

function Section5() {
  return (
    <>
      <section className="shop_section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
              <h4>Download mobile App and</h4>
              <h2>save up to 20%</h2>
              <p>
                Aliquam a augue suscipit, luctus neque purus ipsum and neque
                dolor primis libero tempus, blandit varius
              </p>
              <Link to="/">
                {/* <img
                  src={StoreIOS}
                  alt="IOS"
                  className="img-fluid store me-3"
                /> */}
                <div style={{display: 'inline-block', width: '150px', height: '50px', backgroundColor: '#f8f9fa', marginRight: '12px', border: '2px dashed #dee2e6', textAlign: 'center', lineHeight: '46px', fontSize: '12px', color: '#6c757d'}}>
                  App Store
                </div>
              </Link>
              <Link to="/">
                {/* <img
                  src={StoreGoogle}
                  alt="Android"
                  className="img-fluid store me-3"
                /> */}
                <div style={{display: 'inline-block', width: '150px', height: '50px', backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6', textAlign: 'center', lineHeight: '46px', fontSize: '12px', color: '#6c757d'}}>
                  Google Play
                </div>
              </Link>
            </Col>
            <Col lg={6}>
              {/* <img src={DownloadImage} alt="e-shop" className="img-fluid" /> */}
              <div style={{width: '100%', height: '300px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #dee2e6'}}>
                <span style={{color: '#6c757d'}}>E-shop Image Placeholder</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="brand_section">
        <Container>
          <Row>
            <Carousel>
              <Carousel.Item>
                <Carousel.Caption>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="brand_img">
                      {/* <img src={Brand1} className="img-fluid" alt="brand-1" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 1</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand2} className="img-fluid" alt="brand-2" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 2</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand3} className="img-fluid" alt="brand-3" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 3</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand4} className="img-fluid" alt="brand-4" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 4</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand5} className="img-fluid" alt="brand-5" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 5</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand6} className="img-fluid" alt="brand-6" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 6</div>
                    </div>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Carousel.Caption>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="brand_img">
                      {/* <img src={Brand3} className="img-fluid" alt="brand-3" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 3</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand4} className="img-fluid" alt="brand-4" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 4</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand5} className="img-fluid" alt="brand-5" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 5</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand6} className="img-fluid" alt="brand-6" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 6</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand7} className="img-fluid" alt="brand-7" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 7</div>
                    </div>
                    <div className="brand_img">
                      {/* <img src={Brand8} className="img-fluid" alt="brand-8" /> */}
                      <div style={{width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6c757d'}}>Brand 8</div>
                    </div>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Section5;
